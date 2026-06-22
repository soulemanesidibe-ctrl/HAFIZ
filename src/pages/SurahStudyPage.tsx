import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSurahList, getSurahVerses } from '../services/quranApi'
import { useProgressStore } from '../store/progressStore'
import { AudioPlayer } from '../components/AudioPlayer'
import { RepetitionCounter } from '../components/RepetitionCounter'
import { DuaSession } from '../components/DuaSession'
import { VerseCard } from '../components/hifz/VerseCard'
import { EncouragementCard } from '../components/EncouragementCard'
import { ENCOURAGEMENTS } from '../data/encouragements'
import { MethodCard } from '../components/MethodCard'
import { methodOfDay } from '../data/methods'
import type { SM2Quality, SurahInfo, Verse } from '../types'

const LISTEN_VERSE = ENCOURAGEMENTS.find((e) => e.id === 'follow-recitation')
const MEMORIZE_METHOD = methodOfDay('memorize')

type Mode = 'listen' | 'memorize' | 'review'

const RECITER_NAME = 'Sheikh Mishary Rashid Al-Afasy'
const MEMORIZE_TARGET = 20

const MODES: { key: Mode; label: string; arabic: string }[] = [
  { key: 'listen', label: 'Écoute', arabic: 'سماع' },
  { key: 'memorize', label: 'Mémorisation', arabic: 'حفظ' },
  { key: 'review', label: 'Révision', arabic: 'مراجعة' },
]

const REVIEW_RATINGS: { label: string; quality: SM2Quality; color: string }[] = [
  { label: 'Oublié', quality: 0, color: '#B91C1C' },
  { label: 'Difficile', quality: 2, color: '#A07830' },
  { label: 'Bien', quality: 3, color: '#1A6B3C' },
  { label: 'Parfait', quality: 5, color: '#228B4E' },
]

export function SurahStudyPage() {
  const { surahNumber } = useParams<{ surahNumber: string }>()
  const navigate = useNavigate()
  const surahNum = Number(surahNumber)

  const [verses, setVerses] = useState<Verse[]>([])
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mode, setMode] = useState<Mode>('listen')

  // Mode Écoute
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0)

  // Mode Mémorisation
  const [memorizeIdx, setMemorizeIdx] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const [showTranslit, setShowTranslit] = useState(false)
  const [showDua, setShowDua] = useState(false)

  // Mode Révision
  const [reviewIdx, setReviewIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const addVerseToHifz = useProgressStore((s) => s.addVerseToHifz)
  const updateVerseProgress = useProgressStore((s) => s.updateVerseProgress)
  const memorizedVerses = useProgressStore((s) => s.memorizedVerses)

  // Bismillah affichée sauf pour At-Tawba (sourate 9)
  const showBismillah = surahNum !== 9

  // Charge les versets (texte arabe + traduction + translittération)
  useEffect(() => {
    if (!surahNum || surahNum < 1 || surahNum > 114) {
      setError('Sourate invalide.')
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    Promise.all([getSurahVerses(surahNum), getSurahList()])
      .then(([data, list]) => {
        if (!active) return
        setVerses(data)
        setSurahInfo(list.find((s) => s.number === surahNum) ?? null)
        setError(null)
      })
      .catch(() => {
        if (active) setError('Impossible de charger la sourate.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [surahNum])

  function handleModeChange(next: Mode) {
    setMode(next)
    if (next === 'memorize') {
      setShowDua(true)
      setRepCount(0)
    }
    if (next === 'review') {
      setRevealed(false)
    }
  }

  // ── Mode Mémorisation : navigation ────────────────────────
  function goToMemorizeVerse(idx: number) {
    setMemorizeIdx(idx)
    setRepCount(0)
  }

  function handleMarkMemorized() {
    const verse = verses[memorizeIdx]
    if (!verse) return
    addVerseToHifz(surahNum, verse.numberInSurah)
    // Passe au verset suivant s'il existe
    if (memorizeIdx < verses.length - 1) {
      goToMemorizeVerse(memorizeIdx + 1)
    }
  }

  // ── Mode Révision : auto-évaluation ───────────────────────
  function handleReviewRating(quality: SM2Quality) {
    const verse = verses[reviewIdx]
    if (!verse) return
    updateVerseProgress(surahNum, verse.numberInSurah, quality)
    setRevealed(false)
    if (reviewIdx < verses.length - 1) {
      setReviewIdx(reviewIdx + 1)
    }
  }

  // ── Rendu : header ────────────────────────────────────────
  const header = (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => navigate('/hifz')}
        className="text-text-secondary hover:text-text-primary transition-colors text-sm mb-4"
      >
        ← Retour
      </button>

      <div className="text-center">
        {surahInfo && (
          <p lang="ar" dir="rtl" className="font-amiri text-gold text-3xl mb-1">
            {surahInfo.name}
          </p>
        )}
        {surahInfo && (
          <p className="text-text-secondary text-sm mb-0.5">{surahInfo.englishName}</p>
        )}
        <p className="text-text-primary font-semibold">
          Sourate {surahNum}
          {verses.length > 0 ? ` · ${verses.length} versets` : ''}
        </p>
      </div>

      {/* Bismillah (sauf sourate 9) */}
      {showBismillah && !loading && !error && (
        <p
          lang="ar"
          dir="rtl"
          className="font-amiri text-gold/80 text-center text-2xl mt-4 leading-loose"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      )}
    </div>
  )

  // ── Rendu : tabs ──────────────────────────────────────────
  const tabs = (
    <div className="flex gap-1 bg-[#1A2332] rounded-xl p-1 mb-6 border border-[#2A3140]">
      {MODES.map(({ key, label, arabic }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleModeChange(key)}
          className={
            'flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex flex-col items-center gap-0.5 ' +
            (mode === key
              ? 'bg-gold text-[#0F1419] shadow-sm'
              : 'text-text-secondary hover:text-text-primary')
          }
        >
          <span lang="ar" dir="rtl" className="font-amiri text-base leading-none">
            {arabic}
          </span>
          <span className="text-xs leading-none">{label}</span>
        </button>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6">
          {header}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-dark animate-pulse h-32" aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-dark pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6">
          {header}
          <div className="card-dark text-center py-8">
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const memorizeVerse = verses[memorizeIdx]
  const reviewVerse = verses[reviewIdx]

  return (
    <div className="min-h-screen bg-bg-dark pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {header}
        {tabs}

        {/* ═══════════ MODE ÉCOUTE ═══════════ */}
        {mode === 'listen' && (
          <div className="space-y-4">
            {LISTEN_VERSE && <EncouragementCard encouragement={LISTEN_VERSE} />}
            {verses[currentVerseIdx]?.audioUrl && (
              <AudioPlayer
                audioUrl={verses[currentVerseIdx].audioUrl as string}
                verseRef={`Sourate ${surahNum}, verset ${verses[currentVerseIdx].numberInSurah}`}
                reciterName={RECITER_NAME}
              />
            )}
            <div className="space-y-3">
              {verses.map((verse, idx) => (
                <div
                  key={verse.numberInSurah}
                  onClick={() => setCurrentVerseIdx(idx)}
                  className={
                    'rounded-xl transition-all cursor-pointer ' +
                    (idx === currentVerseIdx ? 'ring-2 ring-gold/60' : '')
                  }
                >
                  <VerseCard
                    verse={verse}
                    surahNumber={surahNum}
                    progress={memorizedVerses[`${surahNum}:${verse.numberInSurah}`]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ MODE MÉMORISATION ═══════════ */}
        {mode === 'memorize' && memorizeVerse && (
          <div className="space-y-4">
            {/* Indicateur de progression dans la sourate */}
            <p className="text-center text-text-secondary text-xs">
              Verset {memorizeIdx + 1} / {verses.length}
            </p>

            {/* Texte arabe grand */}
            <div className="card-dark">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: '#C9A84C22', border: '1.5px solid #C9A84C', color: '#C9A84C' }}
                >
                  {memorizeVerse.numberInSurah}
                </div>
                {memorizeVerse.transliteration && (
                  <button
                    type="button"
                    onClick={() => setShowTranslit((v) => !v)}
                    className="text-xs px-2 py-1 rounded-md border border-[#2A3A4F] text-gray-400 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors"
                  >
                    {showTranslit ? 'Masquer translit.' : 'Translit.'}
                  </button>
                )}
              </div>

              <p
                lang="ar"
                dir="rtl"
                className="arabic-text text-gray-100 mb-4 leading-loose text-right"
                style={{ fontFamily: 'Amiri, serif', fontSize: '2.25rem', lineHeight: '3.2' }}
              >
                {memorizeVerse.text}
              </p>

              {showTranslit && memorizeVerse.transliteration && (
                <p className="text-[#C9A84C]/70 text-sm italic text-right mb-3 leading-relaxed">
                  {memorizeVerse.transliteration}
                </p>
              )}

              {memorizeVerse.translationFr && (
                <p className="text-gray-400 text-sm leading-relaxed border-t border-[#2A3A4F] pt-3 mt-3">
                  {memorizeVerse.translationFr}
                </p>
              )}
            </div>

            {/* Audio du verset courant */}
            {memorizeVerse.audioUrl && (
              <AudioPlayer
                audioUrl={memorizeVerse.audioUrl}
                verseRef={`Sourate ${surahNum}, verset ${memorizeVerse.numberInSurah}`}
                reciterName={RECITER_NAME}
              />
            )}

            {/* Compteur de répétitions */}
            <RepetitionCounter
              count={repCount}
              target={MEMORIZE_TARGET}
              onIncrement={() => setRepCount((c) => c + 1)}
            />

            {/* Conseil de méthode pour bien ancrer le verset */}
            {MEMORIZE_METHOD && <MethodCard method={MEMORIZE_METHOD} />}

            {/* Bouton marquer mémorisé (après objectif) */}
            {repCount >= MEMORIZE_TARGET && (
              <button
                type="button"
                onClick={handleMarkMemorized}
                className="w-full py-3 rounded-xl text-base font-semibold transition-colors"
                style={{ background: '#228B4E', color: '#0F1419' }}
              >
                ✓ Marquer comme mémorisé
              </button>
            )}

            {/* Navigation précédent / suivant */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goToMemorizeVerse(memorizeIdx - 1)}
                disabled={memorizeIdx === 0}
                className="flex-1 py-2.5 bg-[#0F1419] border border-[#2A3140] rounded-xl text-text-secondary text-sm hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                ← Précédent
              </button>
              <button
                type="button"
                onClick={() => goToMemorizeVerse(memorizeIdx + 1)}
                disabled={memorizeIdx >= verses.length - 1}
                className="flex-1 py-2.5 bg-[#0F1419] border border-[#2A3140] rounded-xl text-text-secondary text-sm hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* ═══════════ MODE RÉVISION ═══════════ */}
        {mode === 'review' && reviewVerse && (
          <div className="space-y-4">
            <p className="text-center text-text-secondary text-xs">
              Verset {reviewIdx + 1} / {verses.length}
            </p>

            {/* Verset SANS traduction */}
            <div className="card-dark">
              <div className="flex items-center mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: '#C9A84C22', border: '1.5px solid #C9A84C', color: '#C9A84C' }}
                >
                  {reviewVerse.numberInSurah}
                </div>
              </div>

              <p
                lang="ar"
                dir="rtl"
                className="arabic-text text-gray-100 mb-2 leading-loose text-right"
                style={{ fontFamily: 'Amiri, serif', fontSize: '1.875rem', lineHeight: '3' }}
              >
                {reviewVerse.text}
              </p>

              {/* Traduction révélée */}
              {revealed && reviewVerse.translationFr && (
                <p className="text-gray-400 text-sm leading-relaxed border-t border-[#2A3A4F] pt-3 mt-3">
                  {reviewVerse.translationFr}
                </p>
              )}
            </div>

            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="w-full btn-gold py-3 rounded-xl text-base font-semibold"
              >
                Révéler
              </button>
            ) : (
              <div>
                <p className="text-center text-text-secondary text-xs mb-3">
                  Comment avez-vous récité ce verset ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {REVIEW_RATINGS.map(({ label, quality, color }) => (
                    <button
                      key={quality}
                      type="button"
                      onClick={() => handleReviewRating(quality)}
                      className="py-3 rounded-xl text-sm font-semibold text-gray-100 transition-transform active:scale-95"
                      style={{ background: color }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dua obligatoire à l'ouverture du mode mémorisation */}
      <DuaSession isOpen={showDua} onClose={() => setShowDua(false)} />
    </div>
  )
}
