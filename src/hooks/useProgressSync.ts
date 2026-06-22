/**
 * Hook de synchronisation cloud de la progression.
 *
 * - Au login (status === 'authenticated') : fetch distant, comparaison des
 *   horodatages (le plus récent gagne), puis pull (importSnapshot) ou push.
 * - Ensuite, s'abonne aux changements du progressStore et push (debounce 2s).
 *
 * En mode anonyme (Supabase non configuré ou non connecté), le hook ne fait rien.
 *
 * RÈGLE Zustand v5 : on ne sélectionne que des primitives dans les hooks.
 */

import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import { fetchRemoteProgress, pushProgress } from '../services/progressSync'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

const DEBOUNCE_MS = 2000

/**
 * Petit store partagé pour exposer l'état de synchro à d'autres composants
 * (ex : AccountMenu) sans dupliquer la logique du hook `useProgressSync`.
 * On ne sélectionne que des primitives.
 */
interface SyncStatusState {
  syncStatus: SyncStatus
  lastSyncedAt: string | null
  setSyncStatus: (s: SyncStatus) => void
  setLastSyncedAt: (iso: string) => void
}

export const useSyncStatusStore = create<SyncStatusState>((set) => ({
  syncStatus: 'idle',
  lastSyncedAt: null,
  setSyncStatus: (s) => set({ syncStatus: s }),
  setLastSyncedAt: (iso) => set({ lastSyncedAt: iso }),
}))

export function useProgressSync() {
  // Primitives uniquement.
  const status = useAuthStore((s) => s.status)
  const userId = useAuthStore((s) => s.user?.id ?? null)

  const syncStatus = useSyncStatusStore((s) => s.syncStatus)
  const lastSyncedAt = useSyncStatusStore((s) => s.lastSyncedAt)
  const setSyncStatus = useSyncStatusStore((s) => s.setSyncStatus)
  const setLastSyncedAtRaw = useSyncStatusStore((s) => s.setLastSyncedAt)
  const setLastSyncedAt = (iso: string) => setLastSyncedAtRaw(iso)

  // Évite de relancer la réconciliation initiale plusieurs fois pour un user.
  const reconciledFor = useRef<string | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Réconciliation initiale au login ──────────────────────
  useEffect(() => {
    if (status !== 'authenticated' || !userId) {
      reconciledFor.current = null
      setSyncStatus('idle')
      return
    }
    if (reconciledFor.current === userId) return
    reconciledFor.current = userId

    let cancelled = false

    ;(async () => {
      setSyncStatus('syncing')
      try {
        const remote = await fetchRemoteProgress(userId)
        if (cancelled) return

        const local = useProgressStore.getState().exportSnapshot()

        if (remote) {
          const remoteTime = new Date(remote.updated_at).getTime()
          const localTime = new Date(local.lastModified).getTime()

          if (remoteTime > localTime) {
            // Le distant est plus récent → on adopte la version cloud.
            useProgressStore.getState().importSnapshot(remote.data)
          } else if (localTime > remoteTime) {
            // Le local est plus récent → on pousse vers le cloud.
            await pushProgress(userId, local)
          }
          // Égalité → rien à faire.
        } else {
          // Aucune progression distante → on initialise avec le local.
          await pushProgress(userId, local)
        }

        if (cancelled) return
        setSyncStatus('synced')
        setLastSyncedAt(new Date().toISOString())
      } catch {
        if (!cancelled) setSyncStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [status, userId])

  // ── Push automatique (debounce) sur changement local ──────
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return

    const unsubscribe = useProgressStore.subscribe(() => {
      // N'enclenche le push qu'après la réconciliation initiale.
      if (reconciledFor.current !== userId) return

      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        void (async () => {
          // Garde-fou : ne jamais pousser si l'utilisateur s'est déconnecté
          // entre-temps (sinon on écraserait le cloud avec une progression vidée).
          if (useAuthStore.getState().status !== 'authenticated') return
          setSyncStatus('syncing')
          try {
            const snapshot = useProgressStore.getState().exportSnapshot()
            await pushProgress(userId, snapshot)
            setSyncStatus('synced')
            setLastSyncedAt(new Date().toISOString())
          } catch {
            setSyncStatus('error')
          }
        })()
      }, DEBOUNCE_MS)
    })

    return () => {
      unsubscribe()
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [status, userId])

  return { syncStatus, lastSyncedAt }
}
