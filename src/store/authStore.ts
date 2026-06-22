/**
 * Store Zustand — Authentification (Supabase).
 *
 * Si Supabase n'est pas configuré, le store reste en `status: 'anonymous'`
 * et toutes les actions sont des no-op gracieux : l'app continue en mode local.
 *
 * RÈGLE Zustand v5 : dans les hooks dérivés on ne sélectionne que des primitives
 * (jamais un objet/tableau frais) pour éviter la boucle infinie de getSnapshot.
 */

import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../services/supabase'

export interface AuthUser {
  id: string
  email: string
}

export type AuthStatus = 'loading' | 'anonymous' | 'authenticated'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
  init: () => Promise<void>
  signUp: (email: string, password: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  clearError: () => void
}

/** Traduit un message d'erreur Supabase en français lisible. */
function translateError(message: string | undefined): string {
  if (!message) return 'Une erreur est survenue. Réessaie.'
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.'
  if (m.includes('user already registered')) return 'Un compte existe déjà avec cet email.'
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Adresse email invalide.'
  if (m.includes('email not confirmed')) return 'Confirme ton email avant de te connecter.'
  if (m.includes('network')) return 'Problème de connexion réseau. Réessaie.'
  return message
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'loading',
  error: null,

  init: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ status: 'anonymous', user: null })
      return
    }

    try {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email ?? '' },
          status: 'authenticated',
        })
      } else {
        set({ status: 'anonymous', user: null })
      }
    } catch {
      set({ status: 'anonymous', user: null })
    }

    // Écoute des changements d'état d'auth (login/logout/refresh).
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email ?? '' },
          status: 'authenticated',
          error: null,
        })
      } else {
        set({ user: null, status: 'anonymous' })
      }
    })
  },

  signUp: async (email, password) => {
    if (!supabase) {
      set({ error: 'La synchronisation cloud n\'est pas configurée.' })
      return false
    }
    set({ error: null })
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: translateError(error.message) })
      return false
    }
    return true
  },

  signIn: async (email, password) => {
    if (!supabase) {
      set({ error: 'La synchronisation cloud n\'est pas configurée.' })
      return false
    }
    set({ error: null })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: translateError(error.message) })
      return false
    }
    return true
  },

  signOut: async () => {
    // On réinitialise toujours l'état local, quoi qu'il arrive côté réseau :
    // si supabase.auth.signOut() échoue (réseau, session déjà expirée,
    // AuthSessionMissingError…), l'utilisateur doit malgré tout être déconnecté
    // dans l'interface. Sans ce try/catch, une erreur laissait le bouton inactif.
    try {
      if (supabase) {
        // 'local' : invalide la session de cet appareil sans appel réseau
        // bloquant qui pourrait échouer hors-ligne.
        await supabase.auth.signOut({ scope: 'local' })
      }
    } catch {
      // Ignoré volontairement : on force la déconnexion locale ci-dessous.
    } finally {
      set({ user: null, status: 'anonymous', error: null })
    }
  },

  clearError: () => set({ error: null }),
}))
