import { Link } from 'react-router-dom'
import { useProgressStore, useOverallProgress, useDueCount, useStreak } from '../store/progressStore'
import { ProgressRing } from '../components/ProgressRing'
import { StatsCard } from '../components/StatsCard'
import { AccountMenu } from '../components/AccountMenu'
import { EncouragementCard } from '../components/EncouragementCard'
import { encouragementOfDay } from '../data/encouragements'
import { MethodCard } from '../components/MethodCard'
import { methodOfDay } from '../data/methods'

/** Sourates du Juz 'Amma (78 → 114) */
const JUZ_AMMA_FIRST = 78
const JUZ_AMMA_LAST = 114
const JUZ_AMMA_COUNT = JUZ_AMMA_LAST - JUZ_AMMA_FIRST + 1 // 37

const quickNav = [
  { to: '/alphabet', icon: 'أ', iconType: 'arabic', title: 'Alphabet', description: '28 lettres arabes' },
  { to: '/tajweed', icon: '🎵', iconType: 'emoji', title: 'Tajweed', description: 'Règles de récitation' },
  { to: '/hifz', icon: '📖', iconType: 'emoji', title: 'Hifz', description: 'Mémorisation guidée' },
  { to: '/revision', icon: '🔄', iconType: 'emoji', title: 'Révision', description: 'Répétition espacée' },
] as const

export function HomePage() {
  const overall = useOverallProgress()
  const dueCount = useDueCount()
  const streak = useStreak()
  const memorizedVerses = useProgressStore((s) => s.memorizedVerses)
  const sessions = useProgressStore((s) => s.sessions)

  // Sourates du Juz 'Amma comportant au moins un verset en hifz
  const juzAmmaSurahs = new Set<number>()
  for (const v of Object.values(memorizedVerses)) {
    if (v.surahNumber >= JUZ_AMMA_FIRST && v.surahNumber <= JUZ_AMMA_LAST) {
      juzAmmaSurahs.add(v.surahNumber)
    }
  }
  const juzAmmaDone = juzAmmaSurahs.size
  const juzAmmaProgress = juzAmmaDone / JUZ_AMMA_COUNT

  // Temps d'étude cumulé (minutes) à partir des sessions
  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60,
  )

  // Encouragement du jour (verset ou hadith authentique, change chaque jour)
  const daily = encouragementOfDay('home')
  // Conseil de méthode du jour (apprentissage / mémorisation)
  const tip = methodOfDay('home')

  return (
    <div className="page-container">
      {/* ── Barre compte (discrète, en haut à droite) ──
          relative z-10 : garantit que les contrôles (bouton Déconnexion) restent
          au-dessus du grand titre حافظ, dont la hauteur de ligne Amiri déborde
          vers le haut et capturait sinon le tap sur mobile. */}
      <div className="relative z-10 flex justify-end pt-2 pb-1">
        <AccountMenu />
      </div>

      {/* ── En-tête ── */}
      <div className="mb-6 text-center">
        <h1 lang="ar" dir="rtl" className="font-amiri text-gold text-5xl mb-1">
          حافظ
        </h1>
        <p className="text-text-secondary text-sm tracking-widest uppercase">Hafiz</p>
        <p className="text-gray-500 text-xs mt-1">
          Votre compagnon, pas à pas, sur le chemin du Coran
        </p>
      </div>

      {/* ── Encouragement du jour ── */}
      {daily && <EncouragementCard encouragement={daily} className="mb-6" />}

      {/* ── Bandeau révisions dues ── */}
      {dueCount > 0 && (
        <Link
          to="/revision"
          className="flex items-center justify-between gap-3 mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 active:scale-[0.99] transition-transform"
        >
          <span className="text-text-primary text-sm">
            <span className="text-gold font-bold">{dueCount}</span>{' '}
            {dueCount > 1 ? 'versets à réviser' : 'verset à réviser'} aujourd'hui
          </span>
          <span className="text-gold text-sm font-semibold whitespace-nowrap">Réviser →</span>
        </Link>
      )}

      {/* ── Anneau de progression central ── */}
      <div className="card-dark flex flex-col items-center py-7 mb-6">
        <ProgressRing
          progress={juzAmmaProgress}
          size={170}
          label={`${juzAmmaDone}/${JUZ_AMMA_COUNT}`}
          sublabel="sourates du Juz Amma"
        />
        <div className="mt-4 flex items-center gap-2">
          <span className="text-gold font-amiri text-lg">{overall.totalLettersLearned}/28</span>
          <span className="text-text-secondary text-xs">lettres arabes apprises</span>
        </div>
      </div>

      {/* ── Grille de statistiques ── */}
      <p className="section-title">Votre progression</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatsCard icon="🔥" label="Jours consécutifs" value={streak} />
        <StatsCard icon="📚" label="Versets mémorisés" value={overall.totalVersesInHifz} />
        <StatsCard
          icon="🔄"
          label="À réviser aujourd'hui"
          value={dueCount}
          badge={dueCount}
          highlight={dueCount > 0}
        />
        <StatsCard icon="⏳" label="Temps d'étude" value={totalMinutes} unit="min" />
      </div>

      {/* ── Navigation rapide ── */}
      <p className="section-title">Navigation rapide</p>
      <div className="grid grid-cols-2 gap-3">
        {quickNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card-dark flex flex-col items-center text-center py-5 hover:border-gold/40 transition-colors active:scale-95 transform"
          >
            <span
              className={item.iconType === 'arabic' ? 'text-gold text-3xl mb-2 font-amiri' : 'text-3xl mb-2'}
              lang={item.iconType === 'arabic' ? 'ar' : undefined}
            >
              {item.icon}
            </span>
            <p className="text-gray-100 text-sm font-semibold">{item.title}</p>
            <p className="text-gray-500 text-xs mt-1">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* ── Conseil de méthode du jour ── */}
      {tip && (
        <>
          <p className="section-title mt-6">Conseil du jour</p>
          <MethodCard method={tip} />
        </>
      )}
    </div>
  )
}
