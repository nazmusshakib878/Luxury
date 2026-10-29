import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

/**
 * Checks whether valid Supabase credentials have been configured.
 * Returns true only if actual values (not placeholders) are provided.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (
    supabaseUrl.includes("your-project-id") ||
    supabaseAnonKey.includes("your-supabase-anon-key")
  ) {
    return false
  }
  return true
}

// Fallback dummy URL and key for initialization when credentials aren't provided yet
const fallbackUrl = "https://placeholder-project.supabase.co"
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key_for_offline_mode"

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured() ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

if (import.meta.env.DEV) {
  if (isSupabaseConfigured()) {
    console.info("[Supabase] Connected with live credentials.")
  } else {
    console.info(
      "[Supabase] Live credentials not set in .env.local. Running seamlessly in offline/fallback mode with local data.",
    )
  }
}
