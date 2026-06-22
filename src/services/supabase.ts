/**
 * Client Supabase — initialisation conditionnelle.
 *
 * L'app DOIT fonctionner sans Supabase configuré (mode local / localStorage).
 * On ne crée le client que si les deux variables d'environnement sont présentes
 * et non vides. Sinon `supabase` vaut `null` et `isSupabaseConfigured` est `false`.
 *
 * Aucune exception n'est levée si la config est absente.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

/** `true` si Supabase est correctement configuré (URL + clé anon non vides). */
export const isSupabaseConfigured: boolean = url.length > 0 && anonKey.length > 0

/** Client Supabase, ou `null` si non configuré. */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
