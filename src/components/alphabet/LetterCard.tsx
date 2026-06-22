/**
 * LetterCard — Affiche le détail complet d'une lettre arabe.
 * Formes (isolée/initiale/médiane/finale), phonétique, badge ALA-LC,
 * statut appris, bouton marquer comme apprise.
 */

import { useState } from 'react'
import type { ArabicLetter } from '../../types'
import { speakArabic } from '../../utils/speech'

interface LetterCardProps {
  letter: ArabicLetter
  isLearned: boolean
  onMarkLearned: () => void
}

type FormKey = 'isolated' | 'initial' | 'medial' | 'final'

const FORM_LABELS: Record<FormKey, string> = {
  isolated: 'Isolée',
  initial: 'Initiale',
  medial: 'Médiane',
  final: 'Finale',
}

export function LetterCard({ letter, isLearned, onMarkLearned }: LetterCardProps) {
  const [activeForm, setActiveForm] = useState<FormKey>('isolated')
  const [audioNote, setAudioNote] = useState<string | null>(null)

  const currentGlyph = letter[activeForm]

  const handleListen = async () => {
    setAudioNote(null)
    // On prononce le NOM de la lettre (ex. « بَاء ») : c'est la prononciation
    // de référence pour l'apprentissage de l'alphabet.
    const result = await speakArabic(letter.name)
    if (result === 'unsupported') {
      setAudioNote("La synthèse vocale n'est pas disponible sur ce navigateur.")
    } else if (result === 'no-arabic-voice') {
      setAudioNote(
        'Aucune voix arabe installée sur cet appareil. Ajoute « Arabe » dans les réglages voix/synthèse vocale du téléphone pour entendre la lettre.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Lettre principale */}
      <div className="bg-[#0F1419] rounded-xl border border-[#2A3140] p-6 text-center">
        <p
          lang="ar"
          dir="rtl"
          className="font-amiri text-gold select-none leading-none mb-2"
          style={{ fontSize: '4rem' }}
        >
          {currentGlyph}
        </p>

        {/* Tabs formes */}
        <div className="flex justify-center gap-1 mt-4">
          {(Object.keys(FORM_LABELS) as FormKey[]).map((form) => (
            <button
              key={form}
              onClick={() => setActiveForm(form)}
              className={
                'px-3 py-1 rounded-full text-xs font-medium transition-colors ' +
                (activeForm === form
                  ? 'bg-gold text-[#0F1419]'
                  : 'bg-[#1A2332] text-text-secondary hover:text-text-primary')
              }
            >
              {FORM_LABELS[form]}
            </button>
          ))}
        </div>
      </div>

      {/* Infos de la lettre */}
      <div className="bg-[#1A2332] rounded-xl border border-[#2A3140] p-4 flex flex-col gap-3">
        {/* Nom */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Nom</p>
            <p className="text-text-primary font-semibold">
              {letter.nameFr}{' '}
              <span className="text-text-secondary font-normal">· {letter.nameTranslit}</span>
            </p>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="font-amiri text-gold-light text-2xl"
          >
            {letter.name}
          </p>
        </div>

        {/* Phonétique */}
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Phonétique</p>
          <p className="text-text-primary text-sm">{letter.phonetic}</p>
        </div>

        {/* Badge ALA-LC */}
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-xs uppercase tracking-widest">ALA-LC</span>
          <span className="inline-block bg-[#0F1419] border border-gold/30 text-gold text-xs font-mono px-2 py-0.5 rounded">
            {letter.phoneticAcademic}
          </span>
          <span
            className={
              'ml-auto inline-block text-xs px-2 py-0.5 rounded border ' +
              (letter.group === 'solaire'
                ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                : 'border-sky-500/40 text-sky-400 bg-sky-500/10')
            }
          >
            {letter.group === 'solaire' ? '☀ Solaire' : '☽ Lunaire'}
          </span>
        </div>
      </div>

      {/* Note audio éventuelle (voix arabe absente, etc.) */}
      {audioNote && (
        <p className="text-amber-400/90 text-xs bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
          {audioNote}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {/* Bouton écouter la prononciation de la lettre */}
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#1A2332] border border-[#2A3140] rounded-xl py-3 text-text-secondary hover:text-text-primary transition-colors text-sm"
          onClick={() => void handleListen()}
        >
          <span className="text-lg">🔊</span>
          <span>Écouter</span>
        </button>

        {/* Bouton marquer apprise */}
        {isLearned ? (
          <div className="flex-1 flex items-center justify-center gap-2 bg-islamic-green/20 border border-islamic-green/40 rounded-xl py-3 text-islamic-green-light text-sm font-medium">
            <span>✓</span>
            <span>Apprise</span>
          </div>
        ) : (
          <button
            onClick={onMarkLearned}
            className="flex-1 flex items-center justify-center gap-2 bg-gold/10 border border-gold/40 rounded-xl py-3 text-gold hover:bg-gold/20 transition-colors text-sm font-medium"
          >
            <span>＋</span>
            <span>Marquer apprise</span>
          </button>
        )}
      </div>
    </div>
  )
}
