import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { AppointmentData } from "../types"

/**
 * Saves a luxury salon reservation into Supabase PostgreSQL.
 */
export async function saveAppointmentToDatabase(
  data: AppointmentData,
  userId?: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase.from("appointments").insert([
      {
        user_id: userId || null,
        client_name: data.clientName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        preferred_date: data.date,
        preferred_time: data.time,
        advisor: data.advisor,
        notes: data.notes || null,
        status: "Confirmed",
      },
    ])

    if (error) {
      console.warn("[appointmentService] Supabase insert error:", error.message)
      return false
    }

    return true
  } catch (err) {
    console.warn("[appointmentService] Network exception:", err)
    return false
  }
}

/**
 * Fetches appointments for a user by email or user_id.
 */
export async function fetchUserAppointmentsFromDatabase(
  userId?: string,
  email?: string,
): Promise<AppointmentData[] | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    let query = supabase
      .from("appointments")
      .select("*")
      .order("preferred_date", { ascending: true })

    if (userId) {
      query = query.eq("user_id", userId)
    } else if (email) {
      query = query.eq("email", email)
    } else {
      return null
    }

    const { data, error } = await query

    if (error || !data) return null

    return data.map((item: any) => ({
      city: item.city,
      date: item.preferred_date,
      time: item.preferred_time,
      advisor: item.advisor,
      clientName: item.client_name,
      email: item.email,
      phone: item.phone,
      notes: item.notes || undefined,
    }))
  } catch (err) {
    return null
  }
}
