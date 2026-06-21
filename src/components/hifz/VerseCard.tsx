import { useState } from 'react'
import type { Verse, VerseProgress } from '../../types'

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  progress?: VerseProgress
  showTransliteration?: boolean
}

export function VerseCard({ verse, progress, showTransliteration = false }: VerseCardProps) {
  const [showTranslit, setShowTranslit] = useState(showTransliteration)

  const isMemorized = progress?.status === 'maitrise' || progress?.status === 'revue'

  return (
    <div
      className="card-dark relative"
      style={{
        borderColor: isMemorized ? 'rgba(34,139,78,0.4)' : undefined,
      }}
    >
      {/* Verse number badge + memorized indicator */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ background: '#C9A84C22', border: '1.5px solid #C9A84C', color: '#C9A84C' }}
        >
          {verse.numberInSurah}
        </div>
        <div className="flex items-center gap-2">
          {verse.transliteration && (
            <button
              onClick={() => setShowTranslit((v) => !v)}
              className="text-xs px-2 py-1 rounded-md border border-[#2A3A4F] text-gray-400 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors"
            >
              {showTranslit ? 'Masquer translit.' : 'Translit.'}
            </button>
          )}
          {isMemorized && (
            <span
              className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(34,139,78,0.15)', color: '#228B4E' }}
            >
              ✓ Mémorisé
            </span>
          )}
        </div>
      </div>

      {/* Arabic text */}
      <p
        lang="ar"
        dir="rtl"
        className="arabic-text text-gray-100 mb-4 leading-loose text-right"
        style={{ fontFamily: 'Amiri, serif', fontSize: '1.75rem', lineHeight: '3' }}
      >
        {verse.text}
      </p>

      {/* Transliteration (toggle) */}
      {showTranslit && verse.transliteration && (
        <p className="text-[#C9A84C]/70 text-sm italic text-right mb-3 leading-relaxed">
          {verse.transliteration}
        </p>
      )}

      {/* French translation */}
      {verse.translationFr && (
        <p className="text-gray-400 text-sm leading-relaxed border-t border-[#2A3A4F] pt-3 mt-3">
          {verse.translationFr}
        </p>
      )}
    </div>
  )
}
