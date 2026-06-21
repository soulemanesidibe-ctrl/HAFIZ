/**
 * Service API Quran
 *
 * Utilise l'API Al-Quran Cloud (gratuite, sans clé API) :
 * https://alquran.cloud
 * Documentation : https://alquran.cloud/api
 *
 * Audio CDN : https://cdn.islamic.network/quran/audio/128/ar.alafasy/{globalVerseNumber}.mp3
 * (Récitateur par défaut : Sheikh Mishary Rashid Al-Afasy)
 *
 * Note islamique : Toute récitation du Coran commence par :
 * أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
 * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
 */

import type { Surah, SurahInfo, Verse } from '../types'

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.alquran.cloud/v1'
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio/128'

/** Récitateurs disponibles sur le CDN islamic.network */
export const RECITERS = {
  ALAFASY: 'ar.alafasy',             // Mishary Rashid Al-Afasy (défaut)
  ABDURRAHMAN_SUDAIS: 'ar.abdurrahmanassudais',
  SAAD_ALGHAMDI: 'ar.saoodashuraiym',
  HUSARY: 'ar.husary',
} as const

export type ReciterId = typeof RECITERS[keyof typeof RECITERS]

// ─────────────────────────────────────────────────────────────
// Offset cumulatif des versets par sourate
// Permet de calculer le numéro global (1–6236)
// Source : comptage Hafs 'an 'Asim
// ─────────────────────────────────────────────────────────────

/**
 * Nombre de versets par sourate (index 0 = sourate 1).
 * Total : 6236 versets.
 */
const VERSE_COUNTS_PER_SURAH: readonly number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 4, 1, 1, 3, 6, 3, 6,
  3, 6, 3, 5, 6, 5, 5, 4, 5, 5,
  6, 3, 5, 1, 4, 6, 3, 5, 2, 5,
]

/**
 * Offset cumulatif : offsets[i] = nombre total de versets avant la sourate i+1.
 * Permet de calculer le numéro global d'un verset.
 */
const CUMULATIVE_OFFSETS: readonly number[] = VERSE_COUNTS_PER_SURAH.reduce(
  (acc, count) => {
    acc.push((acc[acc.length - 1] ?? 0) + count)
    return acc
  },
  [0] as number[],
)

// ─────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────

/**
 * Calcule le numéro global d'un verset dans le Coran (1–6236).
 *
 * @param surahNumber - Numéro de sourate (1–114)
 * @param verseNumber - Numéro du verset dans la sourate (commence à 1)
 * @returns Numéro global du verset
 */
export function getGlobalVerseNumber(surahNumber: number, verseNumber: number): number {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new RangeError(`Numéro de sourate invalide : ${surahNumber} (doit être entre 1 et 114)`)
  }
  const offset = CUMULATIVE_OFFSETS[surahNumber - 1]
  return offset + verseNumber
}

/**
 * Retourne l'URL du fichier audio d'un verset.
 *
 * @param surahNumber - Numéro de sourate
 * @param verseNumber - Numéro du verset dans la sourate
 * @param reciterId - Identifiant du récitateur (défaut: Al-Afasy)
 */
export function getAudioUrl(
  surahNumber: number,
  verseNumber: number,
  reciterId: ReciterId = RECITERS.ALAFASY,
): string {
  const globalNumber = getGlobalVerseNumber(surahNumber, verseNumber)
  return `${AUDIO_CDN}/${reciterId}/${globalNumber}.mp3`
}

/**
 * Retourne le nombre de versets d'une sourate.
 */
export function getVerseCount(surahNumber: number): number {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new RangeError(`Numéro de sourate invalide : ${surahNumber}`)
  }
  return VERSE_COUNTS_PER_SURAH[surahNumber - 1]
}

// ─────────────────────────────────────────────────────────────
// Parsers de réponse API
// ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAyah(raw: any, surahNumber: number): Verse {
  return {
    numberInQuran: raw.number,
    numberInSurah: raw.numberInSurah,
    text: raw.text,
    audioUrl: getAudioUrl(surahNumber, raw.numberInSurah),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSurahInfo(raw: any): SurahInfo {
  return {
    number: raw.number,
    name: raw.name,
    englishName: raw.englishName,
    nameFr: raw.englishNameTranslation ?? raw.englishName,
    numberOfAyahs: raw.numberOfAyahs,
    revelationType: raw.revelationType as 'Meccan' | 'Medinan',
  }
}

// ─────────────────────────────────────────────────────────────
// Cache en mémoire (session)
// ─────────────────────────────────────────────────────────────

const cache = new Map<string, unknown>()

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Erreur API Quran (${response.status}): ${url}`)
  }

  const json = await response.json()

  if (json.code !== 200 && json.status !== 'OK') {
    throw new Error(`Réponse API invalide : ${json.status ?? 'Unknown error'}`)
  }

  const data = json.data as T
  cache.set(url, data)
  return data
}

// ─────────────────────────────────────────────────────────────
// Fonctions publiques
// ─────────────────────────────────────────────────────────────

/**
 * Récupère la liste complète des 114 sourates.
 */
export async function getSurahList(): Promise<SurahInfo[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchWithCache<any[]>(`${BASE_URL}/surah`)
  return data.map(parseSurahInfo)
}

/**
 * Récupère le texte arabe (Mushaf Uthmani) d'une sourate.
 *
 * @param surahNumber - Numéro de sourate (1–114)
 */
export async function getSurah(surahNumber: number): Promise<Surah> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchWithCache<any>(`${BASE_URL}/surah/${surahNumber}/ar.uthmani`)

  return {
    number: data.number,
    name: data.name,
    englishName: data.englishName,
    nameFr: data.englishNameTranslation ?? data.englishName,
    numberOfAyahs: data.numberOfAyahs,
    revelationType: data.revelationType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ayahs: data.ayahs.map((a: any) => parseAyah(a, surahNumber)),
  }
}

/**
 * Récupère un verset spécifique (texte arabe + traduction + translittération).
 *
 * @param surahNumber - Numéro de sourate
 * @param verseNumber - Numéro du verset dans la sourate
 */
export async function getVerse(surahNumber: number, verseNumber: number): Promise<Verse> {
  const [arabicData, frData, translitData] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/ayah/${surahNumber}:${verseNumber}/ar.uthmani`),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/ayah/${surahNumber}:${verseNumber}/fr.hamidullah`).catch(() => null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/ayah/${surahNumber}:${verseNumber}/en.transliteration`).catch(() => null),
  ])

  return {
    numberInQuran: arabicData.number,
    numberInSurah: arabicData.numberInSurah,
    text: arabicData.text,
    translationFr: frData?.text ?? undefined,
    transliteration: translitData?.text ?? undefined,
    audioUrl: getAudioUrl(surahNumber, verseNumber),
  }
}

/**
 * Récupère tous les versets d'une sourate avec texte arabe, traduction française
 * et translittération en parallèle.
 *
 * @param surahNumber - Numéro de sourate (1–114)
 */
export async function getSurahVerses(surahNumber: number): Promise<Verse[]> {
  const [arabicSurah, frSurah, translitSurah] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/surah/${surahNumber}/ar.uthmani`),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/surah/${surahNumber}/fr.hamidullah`).catch(() => null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchWithCache<any>(`${BASE_URL}/surah/${surahNumber}/en.transliteration`).catch(() => null),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arabicSurah.ayahs.map((ayah: any, index: number) => ({
    numberInQuran: ayah.number,
    numberInSurah: ayah.numberInSurah,
    text: ayah.text,
    translationFr: frSurah?.ayahs?.[index]?.text ?? undefined,
    transliteration: translitSurah?.ayahs?.[index]?.text ?? undefined,
    audioUrl: getAudioUrl(surahNumber, ayah.numberInSurah),
  }))
}

/**
 * Récupère uniquement la traduction française d'une sourate (Hamidullah).
 */
export async function getSurahTranslationFr(surahNumber: number): Promise<Verse[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchWithCache<any>(`${BASE_URL}/surah/${surahNumber}/fr.hamidullah`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.ayahs.map((a: any) => ({
    numberInQuran: a.number,
    numberInSurah: a.numberInSurah,
    text: '',
    translationFr: a.text,
    audioUrl: getAudioUrl(surahNumber, a.numberInSurah),
  }))
}

/**
 * Vide le cache en mémoire (utile pour les tests).
 */
export function clearCache(): void {
  cache.clear()
}
