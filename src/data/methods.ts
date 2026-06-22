/**
 * methods.ts — Méthodes reconnues d'apprentissage et de mémorisation.
 *
 * On s'appuie sur deux traditions qui se rejoignent :
 *  1. La méthodologie classique des écoles de hifz (Sabaq–Sabqi–Manzil,
 *     talaqqi/musafaha) — transmise depuis le Prophète ﷺ, qui l'a reçue de Jibril.
 *  2. La science de la mémoire (courbe de l'oubli d'Ebbinghaus, rappel actif,
 *     pratique distribuée) — qui explique POURQUOI ces méthodes marchent.
 *
 * Ce sont des CONSEILS pratiques, distincts des versets/hadiths (voir
 * encouragements.ts). Chaque méthode indique sa source/tradition.
 */

export type MethodContext =
  | 'home'
  | 'alphabet'
  | 'hifz'
  | 'memorize'
  | 'listen'
  | 'revision'

export interface LearningMethod {
  id: string
  /** Titre court de la technique. */
  title: string
  /** Explication concrète et actionnable. */
  body: string
  /** Tradition ou discipline d'origine (ex. « Écoles de hifz », « Ebbinghaus, 1885 »). */
  origin: string
  contexts: MethodContext[]
}

export const METHODS: LearningMethod[] = [
  {
    id: 'sabaq-sabqi-manzil',
    title: 'Sabaq · Sabqi · Manzil',
    body: "Le système des écoles de hifz tient en trois temps : le sabaq (la nouvelle leçon du jour, 3 à 5 lignes pour un débutant), le sabqi (les leçons des derniers jours, qu'on consolide) et le manzil (tout ce qui est plus ancien). Règle d'or : on révise AVANT d'ajouter du nouveau, jamais l'inverse.",
    origin: 'Écoles de hifz · méthode classique',
    contexts: ['hifz', 'revision'],
  },
  {
    id: 'talaqqi',
    title: 'Récitez à un professeur (talaqqi)',
    body: "Le Coran s'apprend de bouche à oreille, face à un maître qui corrige votre prononciation : c'est le talaqqi, hérité du Prophète ﷺ via Jibril. Cette app vous prépare, mais ne remplace pas une oreille humaine. Faites-vous écouter régulièrement par un hafiz pour corriger vos makharij.",
    origin: 'Méthode prophétique · talaqqi & musafaha',
    contexts: ['hifz', 'listen'],
  },
  {
    id: 'forgetting-curve',
    title: "La courbe de l'oubli",
    body: "On oublie très vite ce qu'on vient d'apprendre, puis de moins en moins à chaque rappel. En révisant à intervalles qui s'allongent (aujourd'hui, demain, dans 3 jours, dans une semaine…), on aplatit cette courbe. C'est exactement ce que calcule la répétition espacée de l'app.",
    origin: "Science de la mémoire · Ebbinghaus, 1885",
    contexts: ['revision'],
  },
  {
    id: 'active-recall',
    title: 'Le rappel actif',
    body: "Récitez de mémoire AVANT de regarder le texte. Se forcer à retrouver l'information ancre bien plus durablement que relire passivement. C'est pour ça que la révision masque la traduction et vous demande de réciter d'abord.",
    origin: 'Sciences cognitives · retrieval practice',
    contexts: ['revision', 'memorize'],
  },
  {
    id: 'small-daily',
    title: 'Peu, mais chaque jour',
    body: "Cinq lignes par jour, tous les jours, battent une longue session une fois par semaine. La régularité espace naturellement vos rappels et installe l'habitude. Mieux vaut un petit pas quotidien que de grands élans qui s'éteignent.",
    origin: 'Sciences cognitives · pratique distribuée',
    contexts: ['hifz', 'home'],
  },
  {
    id: 'recite-in-salah',
    title: 'Récitez-le dans vos prières',
    body: "Les versets fraîchement mémorisés se gravent quand vous les récitez dans la prière, surtout les prières surérogatoires et celles de la nuit. C'est la révision la plus naturelle : elle ne vous coûte aucun temps supplémentaire.",
    origin: 'Pratique des huffaz',
    contexts: ['memorize'],
  },
  {
    id: 'aloud-and-listen',
    title: 'À voix haute, puis écoutez',
    body: "Voir le verset, l'entendre du récitateur, puis le prononcer vous-même : vous activez trois canaux de mémoire au lieu d'un. Répétez à voix haute en imitant exactement le rythme et les sons du récitateur.",
    origin: 'Sciences cognitives · double encodage',
    contexts: ['memorize', 'alphabet'],
  },
]

/** Jour de l'année (1–366), pour une rotation stable sur 24 h. */
function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000)
}

/** Méthodes disponibles pour un contexte donné. */
export function methodsFor(context: MethodContext): LearningMethod[] {
  return METHODS.filter((m) => m.contexts.includes(context))
}

/** Une méthode pour un contexte, stable sur la journée. `null` si aucune. */
export function methodOfDay(context: MethodContext): LearningMethod | null {
  const pool = methodsFor(context)
  if (pool.length === 0) return null
  return pool[dayOfYear() % pool.length]
}

/** Récupère une méthode précise par son id. */
export function methodById(id: string): LearningMethod | undefined {
  return METHODS.find((m) => m.id === id)
}
