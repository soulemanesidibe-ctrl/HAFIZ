/**
 * Synchronisation de la progression avec la table Supabase `user_progress`.
 *
 * Colonnes : user_id (uuid, PK) · data (jsonb) · updated_at (timestamptz).
 *
 * Toutes les fonctions sont des no-op gracieux si Supabase n'est pas configuré
 * (`supabase === null`) — l'app reste pleinement fonctionnelle en mode local.
 */

import { supabase } from './supabase'
import type { ProgressSnapshot } from '../store/progressStore'

export type { ProgressSnapshot }

interface RemoteProgress {
  data: ProgressSnapshot
  updated_at: string
}

const TABLE = 'user_progress'

/**
 * Récupère la progression distante d'un utilisateur.
 * Retourne `null` si Supabase n'est pas configuré ou si aucune ligne n'existe.
 */
export async function fetchRemoteProgress(
  userId: string,
): Promise<RemoteProgress | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from(TABLE)
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) return null

  return {
    data: data.data as ProgressSnapshot,
    updated_at: data.updated_at as string,
  }
}

/**
 * Pousse (upsert) la progression locale vers Supabase.
 * No-op si Supabase n'est pas configuré.
 */
export async function pushProgress(
  userId: string,
  snapshot: ProgressSnapshot,
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      data: snapshot,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) throw new Error(error.message)
}
