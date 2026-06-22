/**
 * EncouragementCard — Affiche un verset ou un hadith authentique pour
 * accompagner l'apprenant, avec son texte arabe, sa traduction, sa source et
 * une phrase qui le relie au moment de l'apprentissage.
 *
 * RÈGLE islamique : le texte arabe (RTL, Amiri) et la source attribuée sont
 * toujours affichés. On n'affiche jamais un hadith sans sa référence.
 */

import type { Encouragement } from '../data/encouragements'

interface EncouragementCardProps {
  encouragement: Encouragement
  /** `compact` : sans la phrase d'accompagnement (pour les espaces réduits). */
  variant?: 'full' | 'compact'
  className?: string
}

export function EncouragementCard({
  encouragement,
  variant = 'full',
  className = '',
}: EncouragementCardProps) {
  const { kind, arabic, translit, french, source, note } = encouragement

  return (
    <div
      className={
        'rounded-xl border border-gold/25 bg-gradient-to-b from-gold/[0.07] to-transparent px-4 py-4 ' +
        className
      }
    >
      {/* Étiquette : verset ou hadith */}
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px flex-1 bg-gold/20" />
        <span className="text-gold/70 text-[10px] uppercase tracking-[0.2em]">
          {kind === 'verset' ? "Parole d'Allah" : 'Parole du Prophète ﷺ'}
        </span>
        <span className="h-px flex-1 bg-gold/20" />
      </div>

      {/* Texte arabe */}
      <p
        lang="ar"
        dir="rtl"
        className="font-amiri text-gold text-center leading-loose"
        style={{ fontSize: '1.5rem', lineHeight: '2.4' }}
      >
        {arabic}
      </p>

      {/* Translittération (aide le débutant à lire à voix haute) */}
      {translit && (
        <p className="text-gold/60 text-xs italic text-center mt-2">{translit}</p>
      )}

      {/* Traduction française */}
      <p className="text-text-primary/90 text-sm text-center leading-relaxed mt-3">
        {french}
      </p>

      {/* Source attribuée */}
      <p className="text-text-secondary/70 text-xs text-center mt-1.5">— {source}</p>

      {/* Accompagnement de l'apprenant */}
      {variant === 'full' && note && (
        <>
          <div className="my-3 h-px bg-gold/10" />
          <p className="text-text-secondary text-[13px] leading-relaxed text-center">
            {note}
          </p>
        </>
      )}
    </div>
  )
}
