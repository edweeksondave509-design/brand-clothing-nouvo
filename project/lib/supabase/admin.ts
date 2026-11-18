import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from './config'

let client: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  const key = process.env.BC_SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('BC_SUPABASE_SERVICE_ROLE_KEY pa konfigire.')
  if (!client) {
    client = createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } })
  }
  return client
}
