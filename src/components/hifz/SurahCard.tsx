import { useNavigate } from 'react-router-dom'
import type { SurahInfo } from '../../types'

interface SurahCardProps {
  surah: SurahInfo
  /** Nombre de versets de cette sourate ayant été mémorisés */
  memorizedCount: number
}

type Status = 'not-started' | 'in-progress' | 'memorized'

function getStatus(memorizedCount: number, total: number): Status {
  if (memorizedCount <= 0) return 'not-started'
  if (memorizedCount >= total) return 'memorized'
  return 'in-progress'
}

const STATUS_LABELS: Record<Status, string> = {
  'not-started': 'Non commencé',
  'in-progress': 'En cours',
  memorized: 'Mémorisé',
}

export function SurahCard({ surah, memorizedCount }: SurahCardProps) {
  const navigate = useNavigate()

  const total = surah.numberOfAyahs
  const status = getStatus(memorizedCount, total)
  const progressPct = total > 0 ? Math.round((memorizedCount / total) * 100) : 0
  const revelation = surah.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'

  const statusStyle =
    status === 'memorized'
      ? { background: 'rgba(34,139,78,0.15)', color: '#228B4E' }
      : status === 'in-progress'
        ? { background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }
        : { background: 'rgba(156,163,175,0.12)', color: '#9CA3AF' }

  return (
    <button
      type="button"
      onClick={() => navigate(`/hifz/${surah.number}`)}
      className="card-dark w-full text-left hover:border-[#C9A84C]/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Numéro sourate */}
        <div
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ background: '#C9A84C22', border: '1.5px solid #C9A84C', color: '#C9A84C' }}
        >
          {surah.number}
        </div>

        {/* Noms */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">{surah.englishName}</p>
          <p className="text-text-secondary text-xs">
            {surah.numberOfAyahs} versets · {revelation}
          </p>
        </div>

        {/* Nom arabe */}
        <p
          lang="ar"
          dir="rtl"
          className="font-amiri text-gold text-2xl shrink-0"
        >
          {surah.name}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={statusStyle}
          >
            {STATUS_LABELS[status]}
          </span>
          <span className="text-text-secondary text-xs">
            {memorizedCount} / {total} mémorisés
          </span>
        </div>
        <div className="h-1.5 bg-[#0F1419] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: status === 'memorized' ? '#228B4E' : '#C9A84C',
            }}
          />
        </div>
      </div>
    </button>
  )
}
