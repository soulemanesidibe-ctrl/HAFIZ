/**
 * MethodCard — Affiche un conseil de méthode reconnue (apprentissage /
 * mémorisation). Visuellement DISTINCT de l'EncouragementCard : l'or est
 * réservé à la parole d'Allah et du Prophète ﷺ ; les méthodes utilisent un
 * accent sobre (bleu ardoise) pour bien séparer le conseil humain du texte sacré.
 */

import type { LearningMethod } from '../data/methods'

interface MethodCardProps {
  method: LearningMethod
  className?: string
}

export function MethodCard({ method, className = '' }: MethodCardProps) {
  const { title, body, origin } = method

  return (
    <div
      className={
        'rounded-xl border border-[#2A3A4F] bg-[#1A2332] px-4 py-4 ' + className
      }
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sky-300/80 text-[10px] uppercase tracking-[0.2em]">
          Méthode reconnue
        </span>
        <span className="h-px flex-1 bg-[#2A3A4F]" />
      </div>

      <p className="text-text-primary font-semibold text-sm mb-1.5">{title}</p>
      <p className="text-text-secondary text-[13px] leading-relaxed">{body}</p>

      <p className="text-sky-300/50 text-[11px] mt-2.5">{origin}</p>
    </div>
  )
}
