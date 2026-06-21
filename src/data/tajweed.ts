/**
 * Règles fondamentales de Tajweed (تَجْوِيد)
 *
 * Le tajweed est la science de la récitation du Coran telle qu'elle a été
 * transmise du Prophète ﷺ par une chaîne ininterrompue (tawatur).
 * Son apprentissage est fard kifaya (obligation collective) et fard ayn
 * (obligation individuelle) pour une récitation correcte.
 *
 * Les couleurs de mise en évidence suivent le code couleur utilisé dans
 * les Corans color-coded (mushaf mujawwad) populaires dans le monde islamique.
 */

import type { TajweedRule } from '../types'

export const TAJWEED_RULES: TajweedRule[] = [
  // ─────────────────────────────────────────────────────────────
  // MADD (مَدّ) — Allongement
  // ─────────────────────────────────────────────────────────────
  {
    id: 'madd-tabi3i',
    name: 'مَدّ طَبِيعِي',
    nameFr: 'Madd Naturel',
    nameTranslit: 'Madd Ṭabīʿī',
    description:
      "Allongement naturel de deux comptes (harakatayn). Présent quand une lettre de madd (ا و ي) suit une voyelle de même nature sans hamza ni sukun après elle. C'est la base de tous les madds.",
    color: '#22c55e', // vert
    examples: [
      {
        arabic: 'نَسْتَعِينُ',
        transliteration: 'nastaʿīnu',
        reference: '1:5',
      },
      {
        arabic: 'قَالُوا',
        transliteration: 'qālū',
        reference: '2:14',
      },
    ],
  },

  {
    id: 'madd-muttasil',
    name: 'مَدّ وَاجِب مُتَّصِل',
    nameFr: 'Madd Continu Obligatoire',
    nameTranslit: 'Madd Wājib Muttaṣil',
    description:
      "Allongement de 4 ou 5 comptes, obligatoire selon la majorité des récitateurs. Se produit quand une lettre de madd est suivie d'une hamza dans le même mot.",
    color: '#f59e0b', // orange
    examples: [
      {
        arabic: 'جَاءَ',
        transliteration: 'jāʾa',
        reference: '2:87',
      },
      {
        arabic: 'السَّمَاءِ',
        transliteration: 'al-samāʾi',
        reference: '2:19',
      },
    ],
  },

  {
    id: 'madd-munfasil',
    name: 'مَدّ جَائِز مُنْفَصِل',
    nameFr: 'Madd Séparé Permis',
    nameTranslit: 'Madd Jāʾiz Munfaṣil',
    description:
      "Allongement de 2 à 5 comptes. Se produit quand la lettre de madd est en fin de mot et la hamza au début du mot suivant. L'allongement est permis (non obligatoire).",
    color: '#3b82f6', // bleu
    examples: [
      {
        arabic: 'إِنَّا أَعْطَيْنَاكَ',
        transliteration: 'innā aʿṭaynāka',
        reference: '108:1',
      },
    ],
  },

  {
    id: 'madd-lazim',
    name: 'مَدّ لَازِم',
    nameFr: 'Madd Nécessaire',
    nameTranslit: 'Madd Lāzim',
    description:
      "Allongement de 6 comptes, le plus long, nécessaire et permanent. Se produit quand une lettre de madd est suivie d'un sukun original (non causé par pause) ou d'une shadda.",
    color: '#8b5cf6', // violet
    examples: [
      {
        arabic: 'الضَّالِّين',
        transliteration: 'al-ḍāllīn',
        reference: '1:7',
      },
      {
        arabic: 'الم',
        transliteration: 'Alif-Lām-Mīm',
        reference: '2:1',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SUKUN (سُكُون) — Repos / Absence de voyelle
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sukun',
    name: 'سُكُون',
    nameFr: 'Sukun',
    nameTranslit: 'Sukūn',
    description:
      "Signe diacritique (°) indiquant qu'une consonne n'est suivie d'aucune voyelle — elle est au repos. La consonne est prononcée sans voyelle après elle. Fondamental pour comprendre les règles du nun sakin et tanwin.",
    color: '#6b7280', // gris
    examples: [
      {
        arabic: 'أَنْعَمْتَ',
        transliteration: 'anʿamta',
        reference: '1:7',
      },
      {
        arabic: 'مِن',
        transliteration: 'min',
        reference: '1:1',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SHADDA (شَدَّة) — Redoublement
  // ─────────────────────────────────────────────────────────────
  {
    id: 'shadda',
    name: 'شَدَّة',
    nameFr: 'Shadda',
    nameTranslit: 'Shadda',
    description:
      "Signe de redoublement (ّ) — la consonne est prononcée deux fois : une fois sâkiné (au repos) puis une fois avec sa voyelle. Équivaut à deux consonnes identiques fusionnées. Fondamental en tajweed : le ghunna du nun et mim shaddés dure 2 comptes.",
    color: '#ef4444', // rouge
    examples: [
      {
        arabic: 'الرَّحِيم',
        transliteration: 'al-Raḥīm',
        reference: '1:3',
      },
      {
        arabic: 'إِيَّاكَ',
        transliteration: 'iyyāka',
        reference: '1:5',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TANWIN (تَنْوِين) — Nunation
  // ─────────────────────────────────────────────────────────────
  {
    id: 'tanwin-fath',
    name: 'تَنْوِين الفَتْح',
    nameFr: 'Tanwin Fath (an)',
    nameTranslit: 'Tanwīn al-Fatḥ',
    description:
      "Double fatha (ً) sur un nom indéfini — se prononce 'an' (ex : كِتَابًا = kitāban). Suit les mêmes règles que le nun sakin devant les 28 lettres. À la pause : on prononce le alif long.",
    color: '#f97316', // orange clair
    examples: [
      {
        arabic: 'عَلِيمًا حَكِيمًا',
        transliteration: 'ʿalīman ḥakīman',
        reference: '4:11',
      },
    ],
  },

  {
    id: 'tanwin-kasr',
    name: 'تَنْوِين الكَسْر',
    nameFr: 'Tanwin Kasr (in)',
    nameTranslit: 'Tanwīn al-Kasr',
    description:
      "Double kasra (ٍ) sous un nom indéfini — se prononce 'in' (ex : كِتَابٍ = kitābin). Même règles tajweed que le nun sakin.",
    color: '#f97316',
    examples: [
      {
        arabic: 'بِسْمِ اللَّهِ رَحْمَٰنٍ رَّحِيمٍ',
        transliteration: 'bismillāhi raḥmānin raḥīm',
        reference: '1:1',
      },
    ],
  },

  {
    id: 'tanwin-damm',
    name: 'تَنْوِين الضَّم',
    nameFr: 'Tanwin Damm (un)',
    nameTranslit: 'Tanwīn al-Ḍamm',
    description:
      "Double damma (ٌ) sur un nom indéfini — se prononce 'un' (ex : كِتَابٌ = kitābun). Même règles tajweed que le nun sakin.",
    color: '#f97316',
    examples: [
      {
        arabic: 'صِرَاطٌ مُّسْتَقِيمٌ',
        transliteration: 'ṣirāṭun mustaqīm',
        reference: '6:153',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // NUN SAKIN / TANWIN — Les 4 règles fondamentales
  // ─────────────────────────────────────────────────────────────
  {
    id: 'idhar',
    name: 'إِظْهَار حَلْقِي',
    nameFr: 'Idhar (Prononciation claire)',
    nameTranslit: 'Iẓhār Ḥalqī',
    description:
      "Prononciation claire du nun sakin ou tanwin devant les 6 lettres gutturales (حلقية) : ء ه ع ح غ خ. La nun est prononcée nettement, sans nasalisation ni assimilation. C'est comme si elle avait une voyelle.",
    color: '#10b981', // vert émeraude
    examples: [
      {
        arabic: 'مَنْ آمَنَ',
        transliteration: 'man āmana',
        reference: '2:62',
      },
      {
        arabic: 'عَلِيمٌ خَبِيرٌ',
        transliteration: 'ʿalīmun khabīr',
        reference: '6:18',
      },
    ],
  },

  {
    id: 'idgham',
    name: 'إِدْغَام',
    nameFr: 'Idgham (Assimilation)',
    nameTranslit: 'Idghām',
    description:
      "Fusion du nun sakin ou tanwin avec la lettre suivante. Deux types : \n• Idgham avec ghunna (يَرْمَلُون : ي ر م ل و ن) : nasalisation 2 comptes.\n• Idgham sans ghunna (devant ر et ل) : fusion sans nasalisation.\nNe s'applique que si le nun et la lettre suivante sont dans deux mots différents.",
    color: '#06b6d4', // cyan
    examples: [
      {
        arabic: 'مَن يَقُولُ',
        transliteration: 'may-yaqūlu',
        reference: '2:8',
      },
      {
        arabic: 'مِن رَّبِّهِم',
        transliteration: 'mir-rabbihim',
        reference: '2:5',
      },
    ],
  },

  {
    id: 'iqlab',
    name: 'إِقْلَاب',
    nameFr: 'Iqlab (Substitution)',
    nameTranslit: 'Iqlab',
    description:
      "Transformation du nun sakin ou tanwin en mim (م) nasale devant la lettre ب uniquement, avec ghunna de 2 comptes. Dans le mushaf, un petit مْ est écrit sur le nun ou sous le tanwin pour l'indiquer.",
    color: '#ec4899', // rose
    examples: [
      {
        arabic: 'أَنبِئُونِي',
        transliteration: 'ambīʾūnī',
        reference: '2:31',
      },
      {
        arabic: 'سَمِيعٌ بَصِيرٌ',
        transliteration: 'samīʾum baṣīr',
        reference: '2:137',
      },
    ],
  },

  {
    id: 'ikhfa',
    name: 'إِخْفَاء',
    nameFr: 'Ikhfa (Dissimulation)',
    nameTranslit: 'Ikhfāʾ',
    description:
      "Prononciation intermédiaire entre idhar et idgham devant les 15 lettres restantes (ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ). Le nun n'est ni clair ni totalement assimilé — nasalisation de 2 comptes avec légère anticipation du point d'articulation de la lettre suivante.",
    color: '#a855f7', // violet
    examples: [
      {
        arabic: 'مَن كَفَرَ',
        transliteration: 'mang-kafara',
        reference: '2:126',
      },
      {
        arabic: 'جَنَّاتٍ تَجْرِي',
        transliteration: 'jannātint-tajrī',
        reference: '2:25',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // QALQALA (قَلْقَلَة) — Sons rebondissants
  // ─────────────────────────────────────────────────────────────
  {
    id: 'qalqala',
    name: 'قَلْقَلَة',
    nameFr: 'Qalqala (Écho / Rebond)',
    nameTranslit: 'Qalqala',
    description:
      "Léger rebond sonore produit avec les 5 lettres de qalqala quand elles portent un sukun (au repos) : ق ط ب ج د (regroupées dans قُطْبُ جَد). Ce son permet d'éviter que la consonne soit confondue avec une autre. Plus prononcé en fin de verset (qalqala kubra) que dans le corps du texte (qalqala sughra).",
    color: '#dc2626', // rouge vif
    examples: [
      {
        arabic: 'أَحَدٌ',
        transliteration: 'aḥad',
        reference: '112:1',
      },
      {
        arabic: 'يَطْمَعُ',
        transliteration: 'yaṭmaʿu',
        reference: '68:33',
      },
      {
        arabic: 'قُلْ',
        transliteration: 'qul',
        reference: '112:1',
      },
    ],
  },
]

/**
 * Retourne une règle tajweed par son id.
 */
export function getTajweedRuleById(id: string): TajweedRule | undefined {
  return TAJWEED_RULES.find((r) => r.id === id)
}

/**
 * Lettres de qalqala — elles produisent un écho quand elles portent un sukun.
 * Moyen mnémotechnique : قُطْبُ جَد (qutbu jad)
 */
export const QALQALA_LETTERS = ['ق', 'ط', 'ب', 'ج', 'د'] as const

/**
 * Lettres d'idhar halqi — devant elles, le nun/tanwin se prononce clairement.
 */
export const IDHAR_LETTERS = ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'] as const

/**
 * Lettres d'ikhfa — devant elles, le nun/tanwin est dissimulé avec ghunna.
 */
export const IKHFA_LETTERS = ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'] as const

/**
 * Lettres de madd — elles servent à allonger les voyelles.
 */
export const MADD_LETTERS = ['ا', 'و', 'ي'] as const
