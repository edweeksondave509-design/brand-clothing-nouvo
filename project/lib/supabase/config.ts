// This store uses its own Supabase project, separate from the integration
// connected to v0, so it reads BC_-prefixed variables.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_BC_SUPABASE_URL || 'https://rolzdqtwerwbyowyezri.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_BC_SUPABASE_ANON_KEY ?? ''
export const isSupabaseConfigured = SUPABASE_ANON_KEY.length > 0
