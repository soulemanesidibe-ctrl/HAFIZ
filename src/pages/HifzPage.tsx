import { useEffect, useState } from 'react'
import { getSurahList } from '../services/quranApi'
import { useProgressStore } from '../store/progressStore'
import { SurahCard } from '../components/hifz/SurahCard'
import type { SurahInfo } from '../types'

/** Bornes du Juz Amma : sourates 78 (An-Naba) à 114 (An-Nas) */
const JUZ_AMMA_FIRST = 78
const JUZ_AMMA_LAST = 114

export function HifzPage() {
  const [surahs, setSurahs] = useState<SurahInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memorizedVerses = useProgressStore((s) => s.memorizedVerses)

  useEffect(() => {
    let active = true
    setLoading(true)
    getSurahList()
      .then((list) => {
        if (!active) return
        // Juz Amma : sourates 78 → 114, affichées en ordre décroissant (114 → 78)
        const juzAmma = list
          .filter((s) => s.number >= JUZ_AMMA_FIRST && s.number <= JUZ_AMMA_LAST)
          .sort((a, b) => b.number - a.number)
        setSurahs(juzAmma)
        setError(null)
      })
      .catch(() => {
        if (active) setError('Impossible de charger la liste des sourates.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  /** Nombre de versets mémorisés pour une sourate donnée */
  function countMemorized(surahNumber: number): number {
    return Object.values(memorizedVerses).filter(
      (v) => v.surahNumber === surahNumber,
    ).length
  }

  return (
    <div className="min-h-screen bg-bg-dark pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Titre */}
        <div className="text-center mb-5">
          <p lang="ar" dir="rtl" className="font-amiri text-gold text-4xl mb-1">
            الجزء الثلاثون
          </p>
          <p className="text-text-secondary text-sm tracking-widest uppercase">
            Juz Amma (30ème partie)
          </p>
        </div>

        {/* Note pédagogique */}
        <div className="bg-[#1A2332] rounded-xl border border-[#2A3140] p-4 mb-6">
          <p className="text-text-secondary text-sm leading-relaxed text-center">
            Les savants recommandent de commencer par le Juz Amma.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="card-dark animate-pulse h-24"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Erreur */}
        {!loading && error && (
          <div className="card-dark text-center py-8">
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        )}

        {/* Liste des sourates */}
        {!loading && !error && (
          <div className="space-y-3">
            {surahs.map((surah) => (
              <SurahCard
                key={surah.number}
                surah={surah}
                memorizedCount={countMemorized(surah.number)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
