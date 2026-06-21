/**
 * Store Zustand — Progression de l'apprenant Hafiz
 *
 * Ce store centralise toute la progression de l'utilisateur :
 * - Lettres arabes apprises
 * - Versets mémorisés (hifz) avec algorithme SM-2
 * - File de révision espacée
 * - Statistiques de sessions
 *
 * Persisté dans localStorage via zustand/middleware (persist).
 * Les dates sont sérialisées en ISO string et désérialisées à la lecture.
 *
 * "وَقُل رَّبِّ زِدۡنِي عِلۡمًا" — Ô mon Seigneur, accroît mes connaissances (20:114)
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type {
  VerseProgress,
  ReviewItem,
  DailyStats,
  HifzSession,
  SM2Quality,
} from '../types'

import {
  calculateNextReview,
  calculateNextReviewForItem,
  getDueItems,
  getDueVerses,
  createVerseProgress,
} from '../utils/spacedRepetition'

// ─────────────────────────────────────────────────────────────
// Types du store
// ─────────────────────────────────────────────────────────────

export interface ProgressStore {
  // ── Alphabet ──────────────────────────────────────────────
  /** IDs (1–28) des lettres maîtrisées */
  learnedLetters: number[]
  markLetterLearned: (letterId: number) => void
  unmarkLetterLearned: (letterId: number) => void
  isLetterLearned: (letterId: number) => boolean

  // ── Hifz (mémorisation des versets) ───────────────────────
  /** Clé : "surahNum:verseNum", valeur : progression SM-2 */
  memorizedVerses: Record<string, VerseProgress>
  /** Ajoute ou met à jour un verset dans le hifz */
  addVerseToHifz: (surahNum: number, verseNum: number) => void
  /** Met à jour la progression après une révision */
  updateVerseProgress: (surahNum: number, verseNum: number, quality: SM2Quality) => void
  /** Indique si un verset est en cours de mémorisation */
  isVerseInHifz: (surahNum: number, verseNum: number) => boolean
  /** Retourne la progression d'un verset */
  getVerseProgress: (surahNum: number, verseNum: number) => VerseProgress | undefined

  // ── File de révision espacée (SM-2) ───────────────────────
  reviewQueue: ReviewItem[]
  addToReview: (item: Omit<ReviewItem, 'easeFactor' | 'interval' | 'repetitions' | 'lastReviewed'>) => void
  updateReview: (id: string, quality: SM2Quality) => void
  getDueReviews: () => ReviewItem[]
  getDueVersesList: () => VerseProgress[]

  // ── Sessions d'étude ──────────────────────────────────────
  lastSession: string | null // ISO date string
  currentSessionStart: string | null
  sessions: HifzSession[]
  startSession: () => void
  endSession: (versesStudied: number, reviewsCompleted: number) => void

  // ── Statistiques quotidiennes ──────────────────────────────
  /** Clé : "YYYY-MM-DD" */
  dailyStats: Record<string, DailyStats>
  getTodayStats: () => DailyStats
  recordDailyActivity: (versesStudied: number, reviewsCompleted?: number) => void

  // ── Utilitaires ───────────────────────────────────────────
  resetAllProgress: () => void
  getOverallProgress: () => {
    totalLettersLearned: number
    totalVersesInHifz: number
    totalVersesMemorized: number
    currentStreak: number
  }
}

// ─────────────────────────────────────────────────────────────
// Valeurs initiales
// ─────────────────────────────────────────────────────────────

const INITIAL_STATE = {
  learnedLetters: [] as number[],
  memorizedVerses: {} as Record<string, VerseProgress>,
  reviewQueue: [] as ReviewItem[],
  lastSession: null as string | null,
  currentSessionStart: null as string | null,
  sessions: [] as HifzSession[],
  dailyStats: {} as Record<string, DailyStats>,
}

// ─────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyDailyStats(): DailyStats {
  return {
    date: todayKey(),
    versesStudied: 0,
    lettersReviewed: 0,
    sessionDurationMinutes: 0,
    reviewsCompleted: 0,
  }
}

/**
 * Calcule le streak (jours consécutifs d'étude) à partir des clés de dailyStats.
 */
function computeStreak(dailyStats: Record<string, DailyStats>): number {
  const today = new Date()
  let streak = 0
  let current = new Date(today)

  while (true) {
    const key = current.toISOString().slice(0, 10)
    if (!dailyStats[key]) break
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}

// ─────────────────────────────────────────────────────────────
// Création du store
// ─────────────────────────────────────────────────────────────

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── Alphabet ───────────────────────────────────────────

      markLetterLearned: (letterId) =>
        set((state) => {
          if (state.learnedLetters.includes(letterId)) return state
          return { learnedLetters: [...state.learnedLetters, letterId] }
        }),

      unmarkLetterLearned: (letterId) =>
        set((state) => ({
          learnedLetters: state.learnedLetters.filter((id) => id !== letterId),
        })),

      isLetterLearned: (letterId) => get().learnedLetters.includes(letterId),

      // ── Hifz ──────────────────────────────────────────────

      addVerseToHifz: (surahNum, verseNum) => {
        const key = `${surahNum}:${verseNum}`
        const existing = get().memorizedVerses[key]
        if (existing) return // déjà en cours

        const newProgress = createVerseProgress(surahNum, verseNum)
        set((state) => ({
          memorizedVerses: { ...state.memorizedVerses, [key]: newProgress },
        }))
      },

      updateVerseProgress: (surahNum, verseNum, quality) => {
        const key = `${surahNum}:${verseNum}`
        const current = get().memorizedVerses[key]

        if (!current) {
          // Premier apprentissage — on crée et on met à jour directement
          const initial = createVerseProgress(surahNum, verseNum)
          const updated = calculateNextReview(initial, quality)
          set((state) => ({
            memorizedVerses: { ...state.memorizedVerses, [key]: updated },
          }))
          return
        }

        const updated = calculateNextReview(current, quality)
        set((state) => ({
          memorizedVerses: { ...state.memorizedVerses, [key]: updated },
        }))
      },

      isVerseInHifz: (surahNum, verseNum) => {
        const key = `${surahNum}:${verseNum}`
        return key in get().memorizedVerses
      },

      getVerseProgress: (surahNum, verseNum) => {
        const key = `${surahNum}:${verseNum}`
        return get().memorizedVerses[key]
      },

      // ── File de révision ───────────────────────────────────

      addToReview: (itemPartial) => {
        const existing = get().reviewQueue.find((r) => r.id === itemPartial.id)
        if (existing) return // déjà dans la file

        const newItem: ReviewItem = {
          ...itemPartial,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          lastReviewed: null,
          dueDate: itemPartial.dueDate,
        }

        set((state) => ({
          reviewQueue: [...state.reviewQueue, newItem],
        }))
      },

      updateReview: (id, quality) => {
        set((state) => ({
          reviewQueue: state.reviewQueue.map((item) =>
            item.id === id
              ? calculateNextReviewForItem(item, quality)
              : item,
          ),
        }))
      },

      getDueReviews: () => getDueItems(get().reviewQueue),

      getDueVersesList: () => getDueVerses(get().memorizedVerses),

      // ── Sessions ───────────────────────────────────────────

      startSession: () =>
        set({ currentSessionStart: new Date().toISOString() }),

      endSession: (versesStudied, reviewsCompleted) => {
        const { currentSessionStart, sessions } = get()
        if (!currentSessionStart) return

        const startedAt = new Date(currentSessionStart)
        const endedAt = new Date()
        const durationSeconds = Math.round(
          (endedAt.getTime() - startedAt.getTime()) / 1000,
        )

        const session: HifzSession = {
          id: `session-${Date.now()}`,
          startedAt,
          endedAt,
          durationSeconds,
          versesStudied,
          reviewsCompleted,
          averageQuality: 0, // calculé séparément si besoin
        }

        set({
          currentSessionStart: null,
          lastSession: endedAt.toISOString(),
          sessions: [...sessions.slice(-49), session], // garder les 50 dernières
        })

        // Enregistrement des stats quotidiennes
        get().recordDailyActivity(versesStudied, reviewsCompleted)
      },

      // ── Statistiques quotidiennes ──────────────────────────

      getTodayStats: () => {
        const key = todayKey()
        return get().dailyStats[key] ?? emptyDailyStats()
      },

      recordDailyActivity: (versesStudied, reviewsCompleted = 0) => {
        const key = todayKey()
        set((state) => {
          const existing = state.dailyStats[key] ?? emptyDailyStats()
          return {
            dailyStats: {
              ...state.dailyStats,
              [key]: {
                ...existing,
                versesStudied: existing.versesStudied + versesStudied,
                reviewsCompleted: existing.reviewsCompleted + reviewsCompleted,
              },
            },
          }
        })
      },

      // ── Utilitaires ────────────────────────────────────────

      resetAllProgress: () => set(INITIAL_STATE),

      getOverallProgress: () => {
        const { learnedLetters, memorizedVerses, dailyStats } = get()
        const verses = Object.values(memorizedVerses)
        return {
          totalLettersLearned: learnedLetters.length,
          totalVersesInHifz: verses.length,
          totalVersesMemorized: verses.filter((v) => v.status === 'maitrise').length,
          currentStreak: computeStreak(dailyStats),
        }
      },
    }),

    {
      name: 'hafiz-progress-v1', // clé localStorage
      storage: createJSONStorage(() => localStorage),

      /**
       * Sélection des données à persister (on exclut les fonctions).
       * Les dates sont automatiquement sérialisées en ISO string par JSON.stringify.
       */
      partialize: (state) => ({
        learnedLetters: state.learnedLetters,
        memorizedVerses: state.memorizedVerses,
        reviewQueue: state.reviewQueue,
        lastSession: state.lastSession,
        sessions: state.sessions,
        dailyStats: state.dailyStats,
      }),

      /**
       * Migration du store si la version change.
       * Ajouter ici les migrations si le schéma évolue.
       */
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration depuis v0 (avant ce store) → v1
          return { ...INITIAL_STATE, ...(persistedState as Partial<ProgressStore>) }
        }
        return persistedState as ProgressStore
      },
    },
  ),
)

// ─────────────────────────────────────────────────────────────
// Sélecteurs dérivés (hooks utilitaires)
// ─────────────────────────────────────────────────────────────

/** Retourne le nombre de versets dus aujourd'hui */
export const useDueCount = () =>
  useProgressStore((state) => {
    const now = new Date()
    return Object.values(state.memorizedVerses).filter(
      (v) => new Date(v.nextReview) <= now,
    ).length
  })

/** Retourne le streak actuel */
export const useStreak = () =>
  useProgressStore((state) => computeStreak(state.dailyStats))

/**
 * Retourne la progression globale.
 * Chaque sélecteur ne retourne qu'une primitive (stable) pour éviter la boucle
 * infinie de re-render de useSyncExternalStore (Zustand v5). L'objet est ensuite
 * composé localement dans le hook — ce n'est pas un sélecteur, donc aucun souci.
 */
export const useOverallProgress = () => {
  const totalLettersLearned = useProgressStore((s) => s.learnedLetters.length)
  const totalVersesInHifz = useProgressStore((s) => Object.keys(s.memorizedVerses).length)
  const totalVersesMemorized = useProgressStore(
    (s) => Object.values(s.memorizedVerses).filter((v) => v.status === 'maitrise').length,
  )
  const currentStreak = useProgressStore((s) => computeStreak(s.dailyStats))
  return { totalLettersLearned, totalVersesInHifz, totalVersesMemorized, currentStreak }
}
