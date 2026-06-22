/**
 * AccountMenu — Bouton compte discret pour l'en-tête de la page d'accueil.
 *
 * - Mode local (Supabase non configuré) : petite mention "Mode local".
 * - Configuré, non connecté : bouton "Se connecter" → ouvre AuthModal.
 * - Connecté : email + indicateur de synchro + bouton "Déconnexion".
 *
 * RÈGLE Zustand v5 : sélection de primitives uniquement.
 */

import { useState } from 'react'
import { isSupabaseConfigured } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { useSyncStatusStore } from '../hooks/useProgressSync'
import { AuthModal } from './AuthModal'

function SyncIndicator() {
  const syncStatus = useSyncStatusStore((s) => s.syncStatus)

  const map: Record<string, { label: string; className: string }> = {
    idle: { label: '', className: '' },
    syncing: { label: 'Synchronisation…', className: 'text-text-secondary' },
    synced: { label: 'Synchronisé', className: 'text-islamic-green-light' },
    error: { label: 'Erreur de synchro', className: 'text-red-400' },
  }
  const { label, className } = map[syncStatus] ?? map.idle
  if (!label) return null
  return <span className={`text-[10px] ${className}`}>{label}</span>
}

export function AccountMenu() {
  const [modalOpen, setModalOpen] = useState(false)

  const status = useAuthStore((s) => s.status)
  const email = useAuthStore((s) => s.user?.email ?? null)
  const signOut = useAuthStore((s) => s.signOut)

  // Mode local : Supabase non configuré → mention discrète, pas de bouton intrusif.
  if (!isSupabaseConfigured) {
    return <span className="text-[10px] text-gray-600">Mode local</span>
  }

  // Connecté
  if (status === 'authenticated' && email) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-text-secondary text-[11px] max-w-[120px] truncate" title={email}>
            {email}
          </span>
          <SyncIndicator />
        </div>
        {/* Vraie cible tactile : ≥44px de haut, marge confortable, pas collée au bord. */}
        <button
          type="button"
          onClick={() => void signOut()}
          aria-label="Se déconnecter"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs font-medium text-gold transition-colors hover:bg-gold/20 active:scale-95"
        >
          <span aria-hidden>⏻</span>
          <span>Déconnexion</span>
        </button>
      </div>
    )
  }

  // Configuré mais non connecté (ou en cours de chargement)
  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="btn-outline text-xs px-3 py-1.5"
      >
        Se connecter
      </button>
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
