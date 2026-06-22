/**
 * sabaq.ts — Répartition des versets selon la méthode des écoles de hifz :
 * Sabaq · Sabqi · Manzil.
 *
 * On s'appuie sur le statut SM-2 déjà calculé par la répétition espacée, qui
 * reflète la maturité de chaque verset :
 *   - Sabaq  (nouvelle leçon)        → status 'nouveau' ou 'apprentissage' (intervalle < 7 j)
 *   - Sabqi  (révision récente)      → status 'revue'    (intervalle 7–20 j, en cours de verrouillage)
 *   - Manzil (révision ancienne)     → status 'maitrise' (intervalle ≥ 21 j, ancré)
 *
 * Règle d'or de la méthode : on révise Sabqi et Manzil AVANT d'avancer le Sabaq.
 */

import type { VerseProgress } from '../types'

export type SabaqBucket = 'sabaq' | 'sabqi' | 'manzil'

export interface SabaqGroup {
  key: SabaqBucket
  /** Nom arabe (سبق / سبقي / منزل) */
  arabic: string
  /** Libellé court */
  title: string
  /** Ce que regroupe ce niveau, en une phrase. */
  description: string
  verses: VerseProgress[]
  /** Versets de ce groupe dus aujourd'hui (nextReview ≤ maintenant). */
  due: VerseProgress[]
}

const ORDER: SabaqBucket[] = ['sabaq', 'sabqi', 'manzil']

const META: Record<SabaqBucket, Pick<SabaqGroup, 'arabic' | 'title' | 'description'>> = {
  sabaq: {
    arabic: 'سبق',
    title: 'Sabaq',
    description: 'Nouvelle leçon, encore fraîche : à répéter intensément.',
  },
  sabqi: {
    arabic: 'سبقي',
    title: 'Sabqi',
    description: 'Récemment appris : on consolide pour verrouiller.',
  },
  manzil: {
    arabic: 'منزل',
    title: 'Manzil',
    description: 'Ancien et ancré : entretien régulier pour ne rien perdre.',
  },
}

function bucketOf(v: VerseProgress): SabaqBucket {
  if (v.status === 'maitrise') return 'manzil'
  if (v.status === 'revue') return 'sabqi'
  // 'nouveau' et 'apprentissage'
  return 'sabaq'
}

/**
 * Répartit tous les versets mémorisés en trois groupes Sabaq/Sabqi/Manzil,
 * dans l'ordre de révision recommandé.
 */
export function classifySabaq(
  verses: Record<string, VerseProgress>,
): SabaqGroup[] {
  const now = Date.now()
  const buckets: Record<SabaqBucket, VerseProgress[]> = {
    sabaq: [],
    sabqi: [],
    manzil: [],
  }

  for (const v of Object.values(verses)) {
    buckets[bucketOf(v)].push(v)
  }

  return ORDER.map((key) => {
    const list = buckets[key]
    return {
      key,
      ...META[key],
      verses: list,
      due: list.filter((v) => new Date(v.nextReview).getTime() <= now),
    }
  })
}
