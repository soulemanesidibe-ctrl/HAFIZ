/**
 * AlphabetQuiz — Quiz de reconnaissance des lettres arabes.
 * Affiche une lettre (forme aléatoire parmi les 4), propose 4 réponses.
 * Utilisable uniquement si >= 3 lettres apprises.
 * Score de session X/10.
 */

import { useState, useCallback, useEffect } from 'react'
import type { ArabicLetter } from '../../types'

interface AlphabetQuizProps {
  /** Toutes les lettres de l'alphabet (pour piocher les distracteurs) */
  allLetters: ArabicLetter[]
  /** Lettres apprises par l'utilisateur (uniquement celles-là passent au quiz) */
  learnedLetters: ArabicLetter[]
}

type FormKey = 'isolated' | 'initial' | 'medial' | 'final'
const FORMS: FormKey[] = ['isolated', 'initial', 'medial', 'final']

const TOTAL_QUESTIONS = 10

function pickRandom<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildQuestion(
  learnedLetters: ArabicLetter[],
  allLetters: ArabicLetter[],
) {
  const correct = pickRandom(learnedLetters)
  const form = pickRandom(FORMS)
  const glyph = correct[form]

  // 3 distracteurs parmi toutes les lettres (pas la bonne)
  const pool = allLetters.filter((l) => l.id !== correct.id)
  const distractors: ArabicLetter[] = []
  const used = new Set<number>()
  while (distractors.length < 3 && distractors.length < pool.length) {
    const d = pickRandom(pool)
    if (!used.has(d.id)) {
      distractors.push(d)
      used.add(d.id)
    }
  }

  // Mélanger les 4 options
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5)

  return { correct, glyph, form, options }
}

type QuizState = 'answering' | 'correct' | 'incorrect' | 'finished'

export function AlphabetQuiz({ allLetters, learnedLetters }: AlphabetQuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [state, setState] = useState<QuizState>('answering')
  const [chosenId, setChosenId] = useState<number | null>(null)
  const [question, setQuestion] = useState(() =>
    buildQuestion(learnedLetters, allLetters),
  )

  // Garde uniquement les lettres apprises disponibles
  const canQuiz = learnedLetters.length >= 3

  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setState('finished')
      return
    }
    setQuestionIndex((q) => q + 1)
    setState('answering')
    setChosenId(null)
    setQuestion(buildQuestion(learnedLetters, allLetters))
  }, [questionIndex, learnedLetters, allLetters])

  // Auto-avance après 1.5s
  useEffect(() => {
    if (state === 'correct' || state === 'incorrect') {
      const timer = setTimeout(nextQuestion, 1500)
      return () => clearTimeout(timer)
    }
  }, [state, nextQuestion])

  const handleAnswer = (letter: ArabicLetter) => {
    if (state !== 'answering') return
    setChosenId(letter.id)
    if (letter.id === question.correct.id) {
      setScore((s) => s + 1)
      setState('correct')
    } else {
      setState('incorrect')
    }
  }

  const restart = () => {
    setQuestionIndex(0)
    setScore(0)
    setState('answering')
    setChosenId(null)
    setQuestion(buildQuestion(learnedLetters, allLetters))
  }

  if (!canQuiz) {
    return (
      <div className="bg-[#1A2332] rounded-xl border border-[#2A3140] p-8 text-center">
        <p className="text-4xl mb-4">📚</p>
        <p className="text-text-primary font-semibold mb-2">Pas encore assez de lettres apprises</p>
        <p className="text-text-secondary text-sm">
          Apprenez au moins <span className="text-gold font-semibold">3 lettres</span> dans l'onglet
          Leçon pour déverrouiller le quiz.
        </p>
        <p className="text-text-secondary/60 text-xs mt-3">
          Actuellement : {learnedLetters.length} / 3 lettres
        </p>
      </div>
    )
  }

  if (state === 'finished') {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100)
    return (
      <div className="bg-[#1A2332] rounded-xl border border-[#2A3140] p-8 text-center">
        <p className="text-5xl mb-4">{pct >= 70 ? '🌟' : '📖'}</p>
        <p className="text-text-primary font-semibold text-lg mb-1">Quiz terminé</p>
        <p className="text-gold text-3xl font-bold mb-1">
          {score} / {TOTAL_QUESTIONS}
        </p>
        <p className="text-text-secondary text-sm mb-6">
          {pct >= 90
            ? 'Excellent ! Continuez ainsi.'
            : pct >= 70
            ? 'Très bien ! Quelques révisions et ce sera parfait.'
            : 'Continuez à vous entraîner, vous progressez.'}
        </p>
        <button
          onClick={restart}
          className="px-6 py-2.5 bg-gold/10 border border-gold/40 text-gold rounded-xl text-sm font-medium hover:bg-gold/20 transition-colors"
        >
          Recommencer
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête score */}
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">
          Question {questionIndex + 1} / {TOTAL_QUESTIONS}
        </span>
        <span className="text-gold font-semibold text-sm">
          Score : {score}
        </span>
      </div>

      {/* Barre de progression */}
      <div className="h-1 bg-[#2A3140] rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300"
          style={{ width: `${((questionIndex) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Lettre à identifier */}
      <div className="bg-[#0F1419] rounded-xl border border-[#2A3140] p-8 text-center">
        <p className="text-text-secondary text-xs uppercase tracking-widest mb-3">
          Quelle est cette lettre ?
        </p>
        <p
          lang="ar"
          dir="rtl"
          className="font-amiri text-gold select-none"
          style={{ fontSize: '5rem', lineHeight: 1.2 }}
        >
          {question.glyph}
        </p>
        <p className="text-text-secondary/60 text-xs mt-2 capitalize">
          Forme {question.form === 'isolated' ? 'isolée'
            : question.form === 'initial' ? 'initiale'
            : question.form === 'medial' ? 'médiane'
            : 'finale'}
        </p>
      </div>

      {/* Feedback */}
      {(state === 'correct' || state === 'incorrect') && (
        <div
          className={
            'rounded-xl border px-4 py-3 text-sm font-medium text-center transition-all ' +
            (state === 'correct'
              ? 'bg-islamic-green/15 border-islamic-green/40 text-islamic-green-light'
              : 'bg-red-900/20 border-red-500/40 text-red-400')
          }
        >
          {state === 'correct'
            ? `✓ Correct ! C'est bien ${question.correct.nameFr} (${question.correct.nameTranslit})`
            : `✗ C'était ${question.correct.nameFr} (${question.correct.nameTranslit})`}
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const isChosen = chosenId === opt.id
          const isCorrect = opt.id === question.correct.id

          let btnClass =
            'w-full flex flex-col items-center justify-center rounded-xl border py-4 px-2 text-sm font-medium transition-colors '

          if (state === 'answering') {
            btnClass += 'border-[#2A3140] bg-[#1A2332] text-text-primary hover:border-gold/40 hover:bg-[#1E2A3A]'
          } else if (isCorrect) {
            btnClass += 'border-islamic-green/60 bg-islamic-green/15 text-islamic-green-light'
          } else if (isChosen && !isCorrect) {
            btnClass += 'border-red-500/60 bg-red-900/20 text-red-400'
          } else {
            btnClass += 'border-[#2A3140] bg-[#1A2332] text-text-secondary opacity-50'
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              disabled={state !== 'answering'}
              className={btnClass}
            >
              <span
                lang="ar"
                dir="rtl"
                className="font-amiri text-xl mb-1"
              >
                {opt.isolated}
              </span>
              <span>{opt.nameFr}</span>
              <span className="text-xs opacity-70">{opt.nameTranslit}</span>
            </button>
          )
        })}
      </div>

      {/* Bouton suivant manuel */}
      {(state === 'correct' || state === 'incorrect') && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-[#1A2332] border border-[#2A3140] rounded-xl text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Suivant →
        </button>
      )}
    </div>
  )
}
