import { supabase, isSupabaseConfigured } from "../lib/supabase"

export interface AuthProfile {
  id: string
  fullName: string
  email: string
  phone?: string
  role: "customer" | "admin"
}

export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
) {
  if (!isSupabaseConfigured()) {
    return { user: { id: "local-user", email }, error: null }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { user: data.user, session: data.session, error }
}

export async function signInUser(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return { user: { id: "local-user", email }, error: null }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { user: data.user, session: data.session, error }
}

export async function signOutUser() {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getUserProfile(
  userId: string,
): Promise<AuthProfile | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    role: data.role,
  }
}
