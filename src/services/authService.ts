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
  userEmail?: string,
): Promise<AuthProfile | null> {
  const isAdminEmail =
    userEmail?.toLowerCase() === "nazmusshakib335@gmail.com" ||
    userEmail?.toLowerCase().startsWith("admin@")

  if (!isSupabaseConfigured()) {
    return {
      id: userId || "local-user",
      fullName: isAdminEmail ? "Nazmus Shakib (Admin)" : "Atelier Client",
      email: userEmail || "client@aurelia.com.bd",
      role: isAdminEmail ? "admin" : "customer",
    }
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error || !data) {
      // Fallback check if user email is designated admin
      return {
        id: userId,
        fullName: isAdminEmail ? "Nazmus Shakib (Admin)" : "Atelier Client",
        email: userEmail || "",
        role: isAdminEmail ? "admin" : "customer",
      }
    }

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role === "admin" || isAdminEmail ? "admin" : "customer",
    }
  } catch (err) {
    return {
      id: userId,
      fullName: isAdminEmail ? "Nazmus Shakib (Admin)" : "Atelier Client",
      email: userEmail || "",
      role: isAdminEmail ? "admin" : "customer",
    }
  }
}
