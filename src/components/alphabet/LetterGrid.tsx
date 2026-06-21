/**
 * LetterGrid — Grille des 28 lettres arabes avec filtre solaires/lunaires.
 * Clic sur une cellule → sélectionne la lettre (callback onSelect).
 */

import type { ArabicLetter } from '../../types'

type GroupFilter = 'toutes' | 'solaire' | 'lunaire'

interface LetterGridProps {
  letters: ArabicLetter[]
  learnedLetterIds: number[]
  onSelect: (letter: ArabicLetter) => void
  selectedLetterId?: number
  filter: GroupFilter
  onFilterChange: (f: GroupFilter) => void
}

const FILTER_LABELS: { value: GroupFilter; label: string }[] = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'solaire', label: '☀ Solaires' },
  { value: 'lunaire', label: '☽ Lunaires' },
]

export function LetterGrid({
  letters,
  learnedLetterIds,
  onSelect,
  selectedLetterId,
  filter,
  onFilterChange,
}: LetterGridProps) {
  const visible =
    filter === 'toutes' ? letters : letters.filter((l) => l.group === filter)

  return (
    <div>
      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        {FILTER_LABELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors ' +
              (filter === value
                ? 'bg-gold text-[#0F1419]'
                : 'bg-[#1A2332] text-text-secondary border border-[#2A3140] hover:text-text-primary')
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {visible.map((letter) => {
          const learned = learnedLetterIds.includes(letter.id)
          const selected = selectedLetterId === letter.id

          return (
            <button
              key={letter.id}
              onClick={() => onSelect(letter)}
              className={
                'relative flex flex-col items-center justify-center rounded-xl border py-3 px-1 transition-all ' +
                (selected
                  ? 'border-gold bg-gold/10 shadow-[0_0_0_1px_#C9A84C]'
                  : learned
                  ? 'border-islamic-green/40 bg-islamic-green/10 hover:border-islamic-green/60'
                  : 'border-[#2A3140] bg-[#1A2332] hover:border-gold/40 hover:bg-[#1E2A3A]')
              }
            >
              {/* Badge apprise */}
              {learned && (
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-islamic-green-light flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">✓</span>
                </span>
              )}

              {/* Lettre */}
              <span
                lang="ar"
                dir="rtl"
                className="font-amiri text-2xl leading-none mb-1"
                style={{
                  color: selected ? '#C9A84C' : learned ? '#228B4E' : '#F0EDE6',
                }}
              >
                {letter.isolated}
              </span>

              {/* Translittération */}
              <span className="text-text-secondary text-[10px] truncate max-w-full px-0.5">
                {letter.nameTranslit}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
