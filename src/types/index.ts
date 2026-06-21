// ============================================================
// Navigation
// ============================================================
export type NavTab = 'home' | 'alphabet' | 'tajweed' | 'hifz' | 'revision'

// ============================================================
// Alphabet arabe — les 28 lettres
// ============================================================
export interface ArabicLetter {
  /** Identifiant numérique de la lettre (1–28) */
  id: number
  /** Nom de la lettre en arabe (ex: أَلِف) */
  name: string
  /** Translittération académique du nom (ex: Alif) */
  nameTranslit: string
  /** Nom en français (ex: Alif) */
  nameFr: string
  /** Forme isolée (ex: ا) */
  isolated: string
  /** Forme initiale — identique à isolated pour les non-connectantes */
  initial: string
  /** Forme médiane — avec connecteurs Unicode (U+0640) si applicable */
  medial: string
  /** Forme finale — avec connecteur à gauche si applicable */
  final: string
  /** Description phonétique en français */
  phonetic: string
  /** Translittération académique ALA-LC */
  phoneticAcademic: string
  /** Groupe phonétique solaire ou lunaire */
  group: 'solaire' | 'lunaire'
  /** URL audio CDN — vide par défaut, à remplir */
  audioUrl: string
}

// ============================================================
// Tajweed — règles de récitation
// ============================================================
export interface TajweedRule {
  id: string
  /** Nom de la règle en arabe */
  name: string
  /** Nom en français */
  nameFr: string
  /** Translittération du nom */
  nameTranslit: string
  /** Description complète en français */
  description: string
  /** Exemples de versets illustrant la règle */
  examples: TajweedExample[]
  /** Couleur hexadécimale pour la mise en évidence syntaxique */
  color: string
}

export interface TajweedExample {
  /** Texte arabe de l'exemple */
  arabic: string
  /** Translittération de l'exemple */
  transliteration: string
  /** Référence de la sourate (numéro:verset) */
  reference?: string
}

// ============================================================
// API Quran — Sourates et Versets
// ============================================================

/** Informations légères sur une sourate (liste) */
export interface SurahInfo {
  number: number
  /** Nom arabe de la sourate */
  name: string
  /** Translittération du nom arabe */
  englishName: string
  /** Traduction du nom en français */
  nameFr: string
  /** Nombre de versets */
  numberOfAyahs: number
  /** Type de révélation */
  revelationType: 'Meccan' | 'Medinan'
}

/** Sourate complète avec versets */
export interface Surah {
  number: number
  name: string
  englishName: string
  nameFr: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  ayahs: Verse[]
}

/** Un verset (ayah) */
export interface Verse {
  /** Numéro global du verset dans le Coran (1–6236) */
  numberInQuran: number
  /** Numéro dans la sourate */
  numberInSurah: number
  /** Texte arabe (écriture Uthmani) */
  text: string
  /** Traduction française (Hamidullah) */
  translationFr?: string
  /** Translittération phonétique */
  transliteration?: string
  /** URL du fichier audio */
  audioUrl?: string
}

// ============================================================
// Progression — Mémorisation (Hifz)
// ============================================================

/** Progression d'un verset dans la mémorisation */
export interface VerseProgress {
  /** Clé composite "surah:verse" */
  id: string
  surahNumber: number
  verseNumber: number
  /** Nombre de répétitions réussies */
  repetitions: number
  /** Date de la dernière révision */
  lastReview: Date | null
  /** Date de la prochaine révision calculée par SM-2 */
  nextReview: Date
  /** Facteur de facilité SM-2 (minimum 1.3) */
  easeFactor: number
  /** Intervalle en jours avant la prochaine révision */
  interval: number
  /** Statut de mémorisation */
  status: 'nouveau' | 'apprentissage' | 'revue' | 'maitrise'
}

// ============================================================
// Révision espacée — Algorithme SM-2
// ============================================================

/** Un élément dans la file de révision */
export interface ReviewItem {
  /** Identifiant unique (ex: "verse:2:255") */
  id: string
  /** Type d'élément à réviser */
  type: 'verse' | 'letter'
  /** Référence (numéro sourate ou id lettre) */
  ref: string
  /** Date d'échéance pour la révision */
  dueDate: Date
  /** Facteur de facilité SM-2 */
  easeFactor: number
  /** Intervalle courant en jours */
  interval: number
  /** Nombre de répétitions consécutives réussies */
  repetitions: number
  /** Date de la dernière révision */
  lastReviewed: Date | null
}

/** Qualité de réponse SM-2 (0 = oubli total, 5 = parfait) */
export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5

// ============================================================
// Statistiques quotidiennes
// ============================================================

export interface DailyStats {
  date: string // format "YYYY-MM-DD"
  versesStudied: number
  lettersReviewed: number
  sessionDurationMinutes: number
  reviewsCompleted: number
}

// ============================================================
// Session d'étude
// ============================================================

export interface HifzSession {
  id: string
  startedAt: Date
  endedAt: Date | null
  /** Durée en secondes */
  durationSeconds: number
  versesStudied: number
  reviewsCompleted: number
  averageQuality: number
}

// ============================================================
// Anciens types conservés pour compatibilité
// ============================================================

/** @deprecated Utiliser VerseProgress à la place */
export interface HifzProgress {
  surahNumber: number
  memorizedAyahs: number[]
  lastReviewed?: Date
  strength: 'new' | 'weak' | 'medium' | 'strong' | 'mastered'
}

/** @deprecated Utiliser ReviewItem à la place */
export interface RevisionItem {
  id: string
  surahNumber: number
  ayahStart: number
  ayahEnd: number
  dueDate: Date
  interval: number
  easeFactor: number
  repetitions: number
}

export type RevisionRating = 1 | 2 | 3 | 4 | 5
