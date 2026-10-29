import { createClient, SupabaseClient } from "@supabase/supabase-js"

/**
 * Retrieves environment variable or stored key from localStorage.
 */
function getEnvOrStorage(envKey: string, storageKey: string): string {
  try {
    const envVal = import.meta.env[envKey]
    if (
      envVal &&
      !envVal.includes("your-project-id") &&
      !envVal.includes("your-supabase-anon-key")
    ) {
      return envVal.trim()
    }
  } catch {
    // env not available
  }

  try {
    const stored = localStorage.getItem(storageKey)
    if (
      stored &&
      !stored.includes("your-project-id") &&
      !stored.includes("your-supabase-anon-key")
    ) {
      return stored.trim()
    }
  } catch {
    // localStorage not accessible
  }

  return ""
}

export const getSupabaseUrl = (): string =>
  getEnvOrStorage("VITE_SUPABASE_URL", "aurelia_supabase_url")

export const getSupabaseAnonKey = (): string =>
  getEnvOrStorage("VITE_SUPABASE_ANON_KEY", "aurelia_supabase_key")

/**
 * Checks whether valid Supabase credentials have been configured.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  return Boolean(
    url &&
      key &&
      url.startsWith("https://") &&
      !url.includes("placeholder-project") &&
      key.length > 30,
  )
}

// Fallback dummy URL and key for offline mode
const fallbackUrl = "https://placeholder-project.supabase.co"
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key_for_offline_mode"

export function createSupabaseClient(
  customUrl?: string,
  customKey?: string,
): SupabaseClient {
  const activeUrl = customUrl || getSupabaseUrl() || fallbackUrl
  const activeKey = customKey || getSupabaseAnonKey() || fallbackKey

  return createClient(activeUrl, activeKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export let supabase: SupabaseClient = createSupabaseClient()

/**
 * Updates credentials in localStorage and rebuilds the Supabase client instance.
 */
export function setSupabaseCredentials(url: string, key: string): boolean {
  try {
    const cleanUrl = url.trim()
    const cleanKey = key.trim()

    if (cleanUrl) localStorage.setItem("aurelia_supabase_url", cleanUrl)
    if (cleanKey) localStorage.setItem("aurelia_supabase_key", cleanKey)

    supabase = createSupabaseClient(cleanUrl, cleanKey)
    return true
  } catch (err) {
    console.error("[Supabase] Failed to update credentials:", err)
    return false
  }
}

/**
 * Tests live connection to Supabase database.
 */
export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string,
): Promise<{ success: boolean message: string details?: any }> {
  try {
    const client =
      testUrl && testKey
        ? createClient(testUrl.trim(), testKey.trim())
        : supabase

    // Query 1 row from categories or products
    const { data, error } = await client
      .from("categories")
      .select("id, name")
      .limit(1)

    if (error) {
      return {
        success: false,
        message:
          error.message || "Database connection query returned an error.",
        details: error,
      }
    }

    return {
      success: true,
      message: `Database connected successfully! Found ${data?.length || 0} category record(s).`,
      details: data,
    }
  } catch (err: any) {
    return {
      success: false,
      message:
        err.message || "Network exception while contacting Supabase API.",
      details: err,
    }
  }
}

if (import.meta.env.DEV) {
  if (isSupabaseConfigured()) {
    console.info("[Supabase] Connected with credentials:", getSupabaseUrl())
  } else {
    console.info(
      "[Supabase] Live credentials not set in .env or storage. Running seamlessly in offline/fallback mode with local data.",
    )
  }
}
