/**
 * Algorithme SM-2 (SuperMemo 2) pour la révision espacée
 *
 * Référence originale : Piotr Wozniak, "Optimization of Learning", 1990
 * https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-super-memo-method
 *
 * Le SM-2 est particulièrement adapté au hifz (mémorisation du Coran) car :
 * - Il espace les révisions de manière exponentielle selon la maîtrise
 * - Il identifie les versets fragiles (intervalle réduit si qualité < 3)
 * - Il permet un apprentissage lifelong sans surcharge cognitive
 *
 * Barème de qualité (quality):
 *   0 = Oubli complet — aucune reconnaissance du verset
 *   1 = Rappel incorrect malgré que la bonne réponse paraisse facile
 *   2 = Rappel incorrect mais la bonne réponse était reconnue
 *   3 = Correct mais avec effort significatif — seuil minimum de succès
 *   4 = Correct après légère hésitation
 *   5 = Parfait, réponse immédiate — (bismillah, tawfiq d'Allah)
 */

import type { VerseProgress, ReviewItem, SM2Quality } from '../types'

// ─────────────────────────────────────────────────────────────
// Constantes SM-2
// ─────────────────────────────────────────────────────────────

/** Facteur de facilité minimal (empêche des intervalles trop courts) */
const EASE_FACTOR_MIN = 1.3

/** Facteur de facilité initial pour un nouvel élément */
const EASE_FACTOR_INITIAL = 2.5

/** Intervalle initial (jours) pour la première révision réussie */
const INTERVAL_FIRST_REVIEW = 1

/** Intervalle (jours) pour la deuxième révision réussie */
const INTERVAL_SECOND_REVIEW = 6

// ─────────────────────────────────────────────────────────────
// Fonctions principales
// ─────────────────────────────────────────────────────────────

/**
 * Calcule le prochain intervalle de révision selon l'algorithme SM-2.
 *
 * @param progress - État actuel du verset mémorisé
 * @param quality  - Qualité de la réponse (0–5)
 * @returns Nouvel état avec intervalle, easeFactor, nextReview mis à jour
 */
export function calculateNextReview(
  progress: VerseProgress,
  quality: SM2Quality,
): VerseProgress {
  const now = new Date()
  let { interval, easeFactor, repetitions } = progress

  if (quality < 3) {
    // Réponse incorrecte ou effort majeur → recommencer depuis le début
    // Le verset est "oublié", on le remet en apprentissage immédiat
    repetitions = 0
    interval = INTERVAL_FIRST_REVIEW
  } else {
    // Réponse correcte (quality ≥ 3)
    if (repetitions === 0) {
      interval = INTERVAL_FIRST_REVIEW
    } else if (repetitions === 1) {
      interval = INTERVAL_SECOND_REVIEW
    } else {
      // Intervalle suivant = intervalle précédent × easeFactor
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  }

  // Mise à jour du facteur de facilité (formule SM-2 originale)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  easeFactor = Math.max(EASE_FACTOR_MIN, newEaseFactor)

  // Calcul de la date de prochaine révision
  const nextReview = addDays(now, interval)

  // Détermination du statut de mémorisation
  const status = getMemorizationStatus(repetitions, interval)

  return {
    ...progress,
    repetitions,
    interval,
    easeFactor,
    lastReview: now,
    nextReview,
    status,
  }
}

/**
 * Crée un nouvel élément VerseProgress pour un verset non encore étudié.
 *
 * @param surahNumber  - Numéro de sourate
 * @param verseNumber  - Numéro du verset dans la sourate
 */
export function createVerseProgress(
  surahNumber: number,
  verseNumber: number,
): VerseProgress {
  return {
    id: `${surahNumber}:${verseNumber}`,
    surahNumber,
    verseNumber,
    repetitions: 0,
    lastReview: null,
    nextReview: new Date(), // dû immédiatement (première étude)
    easeFactor: EASE_FACTOR_INITIAL,
    interval: 0,
    status: 'nouveau',
  }
}

/**
 * Calcule la progression SM-2 pour un ReviewItem générique.
 * Utilisé pour les lettres et tout autre type d'élément révisable.
 *
 * @param item    - Élément de révision
 * @param quality - Qualité de la réponse (0–5)
 */
export function calculateNextReviewForItem(
  item: ReviewItem,
  quality: SM2Quality,
): ReviewItem {
  const now = new Date()
  let { interval, easeFactor, repetitions } = item

  if (quality < 3) {
    repetitions = 0
    interval = INTERVAL_FIRST_REVIEW
  } else {
    if (repetitions === 0) {
      interval = INTERVAL_FIRST_REVIEW
    } else if (repetitions === 1) {
      interval = INTERVAL_SECOND_REVIEW
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  }

  const newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  easeFactor = Math.max(EASE_FACTOR_MIN, newEF)

  return {
    ...item,
    repetitions,
    interval,
    easeFactor,
    lastReviewed: now,
    dueDate: addDays(now, interval),
  }
}

/**
 * Détermine les éléments dus pour révision (dueDate ≤ maintenant).
 *
 * @param items - Tous les éléments de la file de révision
 * @returns Éléments à réviser aujourd'hui, triés par ancienneté
 */
export function getDueItems(items: ReviewItem[]): ReviewItem[] {
  const now = new Date()
  return items
    .filter((item) => new Date(item.dueDate) <= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

/**
 * Détermine les VerseProgress dues pour révision.
 *
 * @param verses - Map des progressions de versets
 */
export function getDueVerses(
  verses: Record<string, VerseProgress>,
): VerseProgress[] {
  const now = new Date()
  return Object.values(verses)
    .filter((v) => new Date(v.nextReview) <= now)
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
}

// ─────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────

/**
 * Ajoute un nombre de jours à une date.
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Détermine le statut de mémorisation en fonction du progrès SM-2.
 */
function getMemorizationStatus(
  repetitions: number,
  interval: number,
): VerseProgress['status'] {
  if (repetitions === 0) return 'nouveau'
  if (interval < 7) return 'apprentissage'
  if (interval < 21) return 'revue'
  return 'maitrise'
}

// ─────────────────────────────────────────────────────────────
// Statistiques
// ─────────────────────────────────────────────────────────────

export interface SM2Stats {
  total: number
  nouveaux: number
  enApprentissage: number
  enRevue: number
  maitrise: number
  dusAujourdhui: number
}

/**
 * Calcule les statistiques globales de mémorisation.
 */
export function computeSM2Stats(
  verses: Record<string, VerseProgress>,
): SM2Stats {
  const all = Object.values(verses)
  const now = new Date()

  return {
    total: all.length,
    nouveaux: all.filter((v) => v.status === 'nouveau').length,
    enApprentissage: all.filter((v) => v.status === 'apprentissage').length,
    enRevue: all.filter((v) => v.status === 'revue').length,
    maitrise: all.filter((v) => v.status === 'maitrise').length,
    dusAujourdhui: all.filter((v) => new Date(v.nextReview) <= now).length,
  }
}
