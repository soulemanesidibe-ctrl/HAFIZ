/**
 * AuthModal — Modal de connexion / inscription (Supabase).
 *
 * Toggle entre "Se connecter" et "Créer un compte".
 * L'utilisateur saisit son propre email + mot de passe (normal et attendu).
 */

import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'signin' | 'signup'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  // Réinitialise les champs à l'ouverture/fermeture.
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setNotice(null)
      setSubmitting(false)
      clearError()
    }
  }, [isOpen, clearError])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setNotice(null)
    clearError()

    if (mode === 'signin') {
      const ok = await signIn(email.trim(), password)
      if (ok) onClose()
    } else {
      const ok = await signUp(email.trim(), password)
      if (ok) {
        // Selon la config Supabase, une confirmation par email peut être requise.
        setNotice(
          'Compte créé. Si une confirmation par email est requise, vérifie ta boîte de réception.',
        )
      }
    }
    setSubmitting(false)
  }

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    setNotice(null)
    clearError()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="card-dark w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 text-text-secondary hover:text-text-primary text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-gold font-amiri text-2xl text-center mb-1">
          {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
        </h2>
        <p className="text-text-secondary text-xs text-center mb-5">
          Synchronise ta progression sur tous tes appareils
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-text-secondary text-xs mb-1" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#0F1419] border border-[#2A3A4F] px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold"
              placeholder="toi@exemple.com"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1" htmlFor="auth-password">
              Mot de passe
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-[#0F1419] border border-[#2A3A4F] px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {notice && <p className="text-islamic-green text-xs">{notice}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Patiente…'
              : mode === 'signin'
                ? 'Se connecter'
                : 'Créer mon compte'}
          </button>
        </form>

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 w-full text-center text-text-secondary text-xs hover:text-gold transition-colors"
        >
          {mode === 'signin'
            ? "Pas encore de compte ? S'inscrire"
            : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  )
}
