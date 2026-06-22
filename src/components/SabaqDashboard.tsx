/**
 * SabaqDashboard — Tableau Sabaq · Sabqi · Manzil.
 *
 * Répartit automatiquement les versets mémorisés selon la méthode des écoles
 * de hifz et indique, pour chaque niveau, combien sont à réviser aujourd'hui.
 * Une carte avec des versets dus est cliquable pour lancer la révision de ce
 * seul niveau (on révise Sabqi/Manzil avant d'avancer le Sabaq).
 */

import type { SabaqGroup, SabaqBucket } from '../utils/sabaq'

interface SabaqDashboardProps {
  groups: SabaqGroup[]
  /** Lance la révision d'un niveau (appelé seulement si des versets sont dus). */
  onReview?: (bucket: SabaqBucket) => void
}

export function SabaqDashboard({ groups, onReview }: SabaqDashboardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="section-title mb-0">Sabaq · Sabqi · Manzil</p>
        <span lang="ar" dir="rtl" className="font-amiri text-gold/60 text-lg leading-none">
          المراجعة
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {groups.map((g) => {
          const dueCount = g.due.length
          const actionable = dueCount > 0 && !!onReview
          const Tag = actionable ? 'button' : 'div'

          return (
            <Tag
              key={g.key}
              {...(actionable
                ? { type: 'button' as const, onClick: () => onReview?.(g.key) }
                : {})}
              className={
                'text-left rounded-xl border p-3 flex flex-col gap-1 transition-colors ' +
                (actionable
                  ? 'border-gold/40 bg-gold/[0.06] hover:bg-gold/[0.12] active:scale-[0.98] cursor-pointer'
                  : 'border-[#2A3140] bg-[#1A2332]')
              }
            >
              <div className="flex items-baseline justify-between">
                <span className="text-text-primary text-sm font-semibold">{g.title}</span>
                <span lang="ar" dir="rtl" className="font-amiri text-gold/70 text-base leading-none">
                  {g.arabic}
                </span>
              </div>

              <span className="text-gold text-2xl font-bold leading-none mt-1">
                {g.verses.length}
              </span>
              <span className="text-text-secondary/70 text-[11px] leading-none">versets</span>

              {dueCount > 0 ? (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-gold">
                  {dueCount} à réviser →
                </span>
              ) : (
                <span className="mt-1.5 text-[11px] text-islamic-green-light/80">à jour</span>
              )}
            </Tag>
          )
        })}
      </div>

      {/* Légende : le rôle de chaque niveau + la règle d'ordre */}
      <div className="mt-3 space-y-1">
        {groups.map((g) => (
          <p key={g.key} className="text-text-secondary/70 text-[11px] leading-snug">
            <span className="text-text-secondary font-medium">{g.title} :</span> {g.description}
          </p>
        ))}
        <p className="text-sky-300/60 text-[11px] leading-snug pt-1">
          Méthode des écoles de hifz : on révise Sabqi et Manzil avant d'avancer le Sabaq.
        </p>
      </div>
    </div>
  )
}
