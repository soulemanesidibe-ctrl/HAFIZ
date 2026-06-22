/**
 * speech.ts — Prononciation des lettres / mots arabes via la Web Speech API.
 *
 * Note islamique : il s'agit de prononcer une LETTRE isolée à des fins
 * d'apprentissage (makhraj), pas de réciter le Coran. Une voix de synthèse
 * arabe est donc licite ici. La récitation des versets, elle, utilise
 * toujours l'audio authentique du récitateur (Sheikh Al-Afasy) via l'API.
 *
 * La Web Speech API charge ses voix de façon asynchrone : on attend donc
 * que les voix soient disponibles avant de choisir une voix arabe.
 */

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null

/** Indique si la synthèse vocale est supportée par le navigateur. */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Charge (une seule fois) la liste des voix, en attendant l'événement async. */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSupported()) return Promise.resolve([])
  if (voicesPromise) return voicesPromise

  voicesPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis
    const existing = synth.getVoices()
    if (existing.length > 0) {
      resolve(existing)
      return
    }
    // Les voix arrivent de façon asynchrone sur la plupart des navigateurs.
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve(synth.getVoices())
    }
    synth.onvoiceschanged = finish
    // Filet de sécurité si l'événement ne se déclenche jamais.
    setTimeout(finish, 1500)
  })

  return voicesPromise
}

/** Sélectionne la meilleure voix arabe disponible (ou null si aucune). */
function pickArabicVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null
  // Priorité aux voix arabes (ar, ar-SA, ar-EG, etc.).
  const arabic = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'))
  if (arabic.length === 0) return null
  // Préférence pour l'arabe standard (ar-SA) si présent.
  return (
    arabic.find((v) => v.lang.toLowerCase() === 'ar-sa') ??
    arabic[0]
  )
}

export type SpeakResult = 'ok' | 'unsupported' | 'no-arabic-voice'

/**
 * Prononce un texte arabe. Annule toute lecture en cours d'abord.
 * Retourne 'no-arabic-voice' si aucune voix arabe n'est installée sur
 * l'appareil (l'utilisateur peut alors en ajouter une dans ses réglages).
 */
export async function speakArabic(text: string): Promise<SpeakResult> {
  if (!isSpeechSupported()) return 'unsupported'

  const synth = window.speechSynthesis
  const voices = await loadVoices()
  const voice = pickArabicVoice(voices)

  // Annule toute lecture précédente pour éviter la file d'attente.
  synth.cancel()

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'ar-SA'
  utt.rate = 0.75 // plus lent : aide l'apprentissage du makhraj
  utt.pitch = 1
  if (voice) utt.voice = voice

  synth.speak(utt)

  return voice ? 'ok' : 'no-arabic-voice'
}
