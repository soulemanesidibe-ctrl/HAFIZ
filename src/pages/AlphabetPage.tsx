/**
 * AlphabetPage — Module Alphabet complet.
 *
 * Onglets : Leçon | Quiz
 *
 * Leçon :
 *   - Titre arabe + titre français
 *   - Progress bar X/28 lettres apprises
 *   - LetterGrid avec filtre solaires/lunaires
 *   - Modal slide-in avec LetterCard au clic
 *
 * Quiz :
 *   - AlphabetQuiz (si >= 3 lettres apprises)
 *   - Message d'encouragement sinon
 */

import { useState, useEffect, useCallback } from 'react'
import { ARABIC_ALPHABET } from '../data/alphabet'
import { useProgressStore } from '../store/progressStore'
import { LetterGrid } from '../components/alphabet/LetterGrid'
import { LetterCard } from '../components/alphabet/LetterCard'
import { AlphabetQuiz } from '../components/alphabet/AlphabetQuiz'
import { EncouragementCard } from '../components/EncouragementCard'
import { ENCOURAGEMENTS } from '../data/encouragements'
import type { ArabicLetter } from '../types'

const IQRA = ENCOURAGEMENTS.find((e) => e.id === 'iqra')

type Tab = 'lesson' | 'quiz'
type GroupFilter = 'toutes' | 'solaire' | 'lunaire'

export function AlphabetPage() {
  const [activeTab, setActiveTab] = useState<Tab>('lesson')
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('toutes')
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter | null>(null)

  const learnedLetters = useProgressStore((s) => s.learnedLetters)
  const markLetterLearned = useProgressStore((s) => s.markLetterLearned)

  const learnedCount = learnedLetters.length
  const progressPct = Math.round((learnedCount / 28) * 100)

  const learnedLetterObjects = ARABIC_ALPHABET.filter((l) =>
    learnedLetters.includes(l.id),
  )

  // Ferme le modal avec Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedLetter(null)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen bg-bg-dark pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* ── Onglets ── */}
        <div className="flex gap-1 bg-[#1A2332] rounded-xl p-1 mb-6 border border-[#2A3140]">
          {([
            { key: 'lesson', label: 'Leçon' },
            { key: 'quiz', label: 'Quiz' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors ' +
                (activeTab === key
                  ? 'bg-gold text-[#0F1419] shadow-sm'
                  : 'text-text-secondary hover:text-text-primary')
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* ═════════════ MODE LEÇON ═════════════ */}
        {activeTab === 'lesson' && (
          <div>
            {/* Titre */}
            <div className="text-center mb-6">
              <p
                lang="ar"
                dir="rtl"
                className="font-amiri text-gold text-4xl mb-1"
              >
                الحروف العربية
              </p>
              <p className="text-text-secondary text-sm tracking-widest uppercase">
                L'Alphabet Arabe
              </p>
            </div>

            {/* Le tout premier enseignement : Jibril ﷺ dit « Lis » au Prophète ﷺ */}
            {IQRA && <EncouragementCard encouragement={IQRA} className="mb-5" />}

            {/* Progress bar */}
            <div className="bg-[#1A2332] rounded-xl border border-[#2A3140] p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-xs uppercase tracking-widest">
                  Progression
                </span>
                <span className="text-gold font-semibold text-sm">
                  {learnedCount} / 28
                </span>
              </div>
              <div className="h-2 bg-[#0F1419] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-text-secondary/60 text-xs mt-1.5 text-right">
                {progressPct}% des lettres apprises
              </p>
            </div>

            {/* Grille */}
            <LetterGrid
              letters={ARABIC_ALPHABET}
              learnedLetterIds={learnedLetters}
              onSelect={setSelectedLetter}
              selectedLetterId={selectedLetter?.id}
              filter={groupFilter}
              onFilterChange={setGroupFilter}
            />
          </div>
        )}

        {/* ═════════════ MODE QUIZ ═════════════ */}
        {activeTab === 'quiz' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-text-primary font-semibold text-lg mb-1">Quiz — Alphabet</p>
              <p className="text-text-secondary text-sm">
                Reconnaissez les lettres dans leurs différentes formes
              </p>
            </div>
            <AlphabetQuiz
              allLetters={ARABIC_ALPHABET}
              learnedLetters={learnedLetterObjects}
            />
          </div>
        )}
      </div>

      {/* ═════════════ MODAL LETTER CARD ═════════════ */}
      {selectedLetter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setSelectedLetter(null)}
          />

          {/* Panneau slide-in depuis le bas */}
          <div className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto">
            <div className="bg-[#1A2332] rounded-t-2xl border-t border-x border-[#2A3140] p-5 pb-28 max-h-[90vh] overflow-y-auto">
              {/* Handle + close */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-1 rounded-full bg-[#2A3140] mx-auto" />
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="ml-auto text-text-secondary hover:text-text-primary transition-colors text-lg leading-none p-1"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>

              <LetterCard
                letter={selectedLetter}
                isLearned={learnedLetters.includes(selectedLetter.id)}
                onMarkLearned={() => {
                  markLetterLearned(selectedLetter.id)
                }}
              />

              {/* Navigation entre lettres */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const idx = ARABIC_ALPHABET.findIndex((l) => l.id === selectedLetter.id)
                    if (idx > 0) setSelectedLetter(ARABIC_ALPHABET[idx - 1])
                  }}
                  disabled={selectedLetter.id === 1}
                  className="flex-1 py-2.5 bg-[#0F1419] border border-[#2A3140] rounded-xl text-text-secondary text-sm hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  ← Précédente
                </button>
                <button
                  onClick={() => {
                    const idx = ARABIC_ALPHABET.findIndex((l) => l.id === selectedLetter.id)
                    if (idx < ARABIC_ALPHABET.length - 1) setSelectedLetter(ARABIC_ALPHABET[idx + 1])
                  }}
                  disabled={selectedLetter.id === 28}
                  className="flex-1 py-2.5 bg-[#0F1419] border border-[#2A3140] rounded-xl text-text-secondary text-sm hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  Suivante →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
