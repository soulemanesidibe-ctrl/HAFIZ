/**
 * RevisionPage — Module Révision (répétition espacée SM-2)
 *
 * Présente la file de révision du jour comme une 'ibada (acte d'adoration),
 * pas comme un jeu. Sobriété, thème sombre, accents dorés.
 *
 * Hadith de référence :
 *   « Maintenez votre connaissance du Coran, car il s'échappe plus vite
 *     que les chameaux de leurs liens. » — Sahih al-Bukhari 5033
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgressStore, useStreak } from '../store/progressStore'
import { getVerse, getSurahList } from '../services/quranApi'
import { StatsCard } from '../components/StatsCard'
import type { VerseProgress, Verse, SM2Quality, SurahInfo } from '../types'

type Phase = 'idle' | 'reviewing' | 'done'

interface EvalButton {
  label: string
  quality: SM2Quality
  classes: string
}

const EVAL_BUTTONS: EvalButton[] = [
  { label: 'Oublié', quality: 0, classes: 'bg-red-600/90 hover:bg-red-600 text-white' },
  { label: 'Difficile', quality: 2, classes: 'bg-orange-500/90 hover:bg-orange-500 text-white' },
  { label: 'Bien', quality: 3, classes: 'bg-blue-600/90 hover:bg-blue-600 text-white' },
  { label: 'Parfait', quality: 5, classes: 'bg-islamic-green-light/90 hover:bg-islamic-green-light text-white' },
]

export function RevisionPage() {
  // ── Store ────────────────────────────────────────────────
  const memorizedVerses = useProgressStore((s) => s.memorizedVerses)
  const getDueVersesList = useProgressStore((s) => s.getDueVersesList)
  const updateVerseProgress = useProgressStore((s) => s.updateVerseProgress)
  const streak = useStreak()

  // Versets mémorisés (total) + taux de rétention (maîtrisés / total)
  const allVerses = useMemo(() => Object.values(memorizedVerses), [memorizedVerses])
  const totalMemorized = allVerses.length
  const masteredCount = allVerses.filter((v) => v.status === 'maitrise').length
  const retentionRate =
    totalMemorized > 0 ? Math.round((masteredCount / totalMemorized) * 100) : 0

  // ── État de la session ───────────────────────────────────
  const [phase, setPhase] = useState<Phase>('idle')
  const [queue, setQueue] = useState<VerseProgress[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionCount, setSessionCount] = useState(0)

  // Map numéro de sourate → nom arabe / français (chargé une fois)
  const [surahMap, setSurahMap] = useState<Record<number, SurahInfo>>({})

  // Nombre de versets dus (recalculé à chaque rendu hors session)
  const dueCount = useMemo(
    () => (phase === 'idle' ? getDueVersesList().length : queue.length),
    [phase, getDueVersesList, queue.length, memorizedVerses],
  )

  // ── Chargement de la liste des sourates (pour les noms) ──
  useEffect(() => {
    getSurahList()
      .then((list) => {
        const map: Record<number, SurahInfo> = {}
        for (const s of list) map[s.number] = s
        setSurahMap(map)
      })
      .catch(() => {
        /* noms non critiques — on retombe sur le numéro de sourate */
      })
  }, [])

  const current = queue[index]

  // ── Chargement du texte arabe du verset courant ──────────
  useEffect(() => {
    if (phase !== 'reviewing' || !current) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setVerse(null)
    setRevealed(false)

    getVerse(current.surahNumber, current.verseNumber)
      .then((v) => {
        if (!cancelled) setVerse(v)
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger le verset. Vérifiez votre connexion.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [phase, current])

  // ── Actions ──────────────────────────────────────────────
  const startReview = useCallback(() => {
    const due = getDueVersesList()
    if (due.length === 0) return
    setQueue(due)
    setIndex(0)
    setSessionCount(0)
    setRevealed(false)
    setPhase('reviewing')
  }, [getDueVersesList])

  const handleEval = useCallback(
    (quality: SM2Quality) => {
      if (!current) return
      updateVerseProgress(current.surahNumber, current.verseNumber, quality)
      setSessionCount((c) => c + 1)

      if (index + 1 < queue.length) {
        setIndex((i) => i + 1)
        setRevealed(false)
      } else {
        setPhase('done')
      }
    },
    [current, index, queue.length, updateVerseProgress],
  )

  const resetToIdle = useCallback(() => {
    setPhase('idle')
    setQueue([])
    setIndex(0)
    setSessionCount(0)
    setRevealed(false)
    setVerse(null)
  }, [])

  const surahLabel = (surahNumber: number): string => {
    const info = surahMap[surahNumber]
    return info ? `${info.englishName}` : `Sourate ${surahNumber}`
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-dark pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* ── En-tête ── */}
        <div className="text-center mb-5">
          <p lang="ar" dir="rtl" className="font-amiri text-gold text-4xl mb-1">
            المراجعة
          </p>
          <p className="text-text-secondary text-sm tracking-widest uppercase">
            Révision du jour
          </p>
        </div>

        {/* ── Épigraphe (hadith) ── */}
        <p className="text-text-secondary/70 text-xs italic text-center leading-relaxed mb-6 px-2">
          « Maintenez votre connaissance du Coran, car il s'échappe plus vite que
          les chameaux de leurs liens. »
          <span className="block text-gold/50 not-italic mt-1">— Sahih al-Bukhari 5033</span>
        </p>

        {/* ═════════════ MODE IDLE ═════════════ */}
        {phase === 'idle' && (
          <>
            <div className="card-dark text-center py-8 mb-6">
              {dueCount === 0 ? (
                <>
                  <div className="text-3xl mb-3" aria-hidden>✦</div>
                  <p className="text-text-primary font-semibold mb-1">
                    Aucune révision aujourd'hui
                  </p>
                  <p className="text-text-secondary text-sm mb-5">
                    Vos versets sont consolidés. Qu'Allah préserve votre mémoire.
                  </p>
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gold/15" />
                    <span className="text-gold/40 text-xs">✦</span>
                    <div className="flex-1 h-px bg-gold/15" />
                  </div>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="text-gray-100 leading-loose mb-2"
                    style={{ fontFamily: 'Amiri, serif', fontSize: '1.3rem', lineHeight: '2.2' }}
                  >
                    رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا
                  </p>
                  <p className="text-text-secondary text-xs italic">
                    « Seigneur, ne nous tiens pas rigueur si nous oublions ou
                    commettons des erreurs. » — Al-Baqara 2:286
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-3" aria-hidden>📖</div>
                  <p className="text-gold text-3xl font-bold mb-1">{dueCount}</p>
                  <p className="text-text-secondary text-sm mb-6">
                    {dueCount > 1 ? 'versets à réviser aujourd\'hui' : 'verset à réviser aujourd\'hui'}
                  </p>
                  <button
                    onClick={startReview}
                    className="btn-gold w-full py-3 rounded-xl text-base font-semibold"
                  >
                    Commencer la révision
                  </button>
                </>
              )}
            </div>

            {/* ── Stats rapides ── */}
            <p className="section-title">Aperçu</p>
            <div className="grid grid-cols-3 gap-3">
              <StatsCard icon="🔥" label="Jours consécutifs" value={streak} />
              <StatsCard icon="📚" label="Versets mémorisés" value={totalMemorized} />
              <StatsCard icon="✓" label="Taux de rétention" value={retentionRate} unit="%" />
            </div>
          </>
        )}

        {/* ═════════════ MODE REVIEWING ═════════════ */}
        {phase === 'reviewing' && current && (
          <div>
            {/* Progression de la session */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-xs uppercase tracking-widest">
                  {surahLabel(current.surahNumber)} — {current.surahNumber}:{current.verseNumber}
                </span>
                <span className="text-gold font-semibold text-sm">
                  {index + 1} / {queue.length}
                </span>
              </div>
              <div className="h-1.5 bg-[#0F1419] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${((index + 1) / queue.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Carte du verset */}
            <div className="card-dark min-h-[180px] flex flex-col justify-center py-8 mb-5">
              {loading && (
                <p className="text-text-secondary text-sm text-center">Chargement…</p>
              )}

              {error && (
                <p className="text-red-400 text-sm text-center px-4">{error}</p>
              )}

              {!loading && !error && verse && (
                <>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="text-gray-100 text-center leading-loose"
                    style={{ fontFamily: 'Amiri, serif', fontSize: '1.7rem', lineHeight: '2.6' }}
                  >
                    {verse.text}
                  </p>

                  {revealed && (
                    <p className="text-text-secondary text-sm text-center italic mt-5 px-2 leading-relaxed animate-fadeIn">
                      {verse.translationFr ?? 'Traduction indisponible'}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Boutons d'action */}
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                disabled={loading || !!error}
                className="btn-outline w-full py-3 rounded-xl text-base font-semibold disabled:opacity-40"
              >
                Révéler la traduction
              </button>
            ) : (
              <div>
                <p className="text-text-secondary text-xs text-center mb-3">
                  Comment avez-vous récité ce verset ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {EVAL_BUTTONS.map((b) => (
                    <button
                      key={b.quality}
                      onClick={() => handleEval(b.quality)}
                      className={`py-3 rounded-xl text-sm font-semibold transition-colors ${b.classes}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quitter la session */}
            <button
              onClick={resetToIdle}
              className="block mx-auto mt-6 text-text-secondary/60 text-xs hover:text-text-secondary transition-colors"
            >
              Interrompre la révision
            </button>
          </div>
        )}

        {/* ═════════════ MODE DONE ═════════════ */}
        {phase === 'done' && (
          <div className="card-dark text-center py-8">
            <div className="text-3xl mb-3" aria-hidden>✦</div>
            <p className="text-text-primary font-semibold mb-1">Révision terminée</p>
            <p className="text-text-secondary text-sm mb-6">
              {sessionCount} {sessionCount > 1 ? 'versets révisés' : 'verset révisé'} —
              qu'Allah accepte votre effort.
            </p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gold/15" />
              <span className="text-gold/40 text-xs">✦</span>
              <div className="flex-1 h-px bg-gold/15" />
            </div>

            {/* Dua de fin (Sahih al-Bukhari — invocation pour la mémoire) */}
            <p
              lang="ar"
              dir="rtl"
              className="text-gray-100 leading-loose mb-2"
              style={{ fontFamily: 'Amiri, serif', fontSize: '1.3rem', lineHeight: '2.2' }}
            >
              اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نُسِّيتُ
            </p>
            <p className="text-text-secondary text-xs italic mb-6">
              « Ô Allah, rappelle-moi ce que j'ai oublié [du Coran]. » — Sahih al-Bukhari 5038
            </p>

            <button
              onClick={resetToIdle}
              className="btn-gold w-full py-3 rounded-xl text-base font-semibold"
            >
              Retour
            </button>
          </div>
        )}
      </div>

      {/* Lien discret vers le Hifz si rien à réviser */}
      {phase === 'idle' && dueCount === 0 && (
        <div className="max-w-lg mx-auto px-4 mt-6 text-center">
          <Link to="/hifz" className="text-gold/70 text-sm hover:text-gold transition-colors">
            Mémoriser de nouveaux versets →
          </Link>
        </div>
      )}
    </div>
  )
}
