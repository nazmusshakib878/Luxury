import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { Product, Category } from "../types"
import { products as fallbackProducts } from "../data/products"
import { categories as fallbackCategories } from "../data/categories"

/**
 * Fetches all available products from Supabase PostgreSQL database.
 * If Supabase is not configured or unreachable, falls back seamlessly to local curated products.
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProducts
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true })

    if (error || !data || data.length === 0) {
      if (error)
        console.warn(
          "[productService] Supabase error, using fallback:",
          error.message,
        )
      return fallbackProducts
    }

    // Map database snake_case columns to TypeScript camelCase model
    return data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      subtitle: item.subtitle,
      category: item.category,
      categoryType: item.category_type,
      price: Number(item.price),
      rating: Number(item.rating),
      reviewsCount: Number(item.reviews_count),
      badge: item.badge || undefined,
      image: item.image,
      additionalImages: item.additional_images || [],
      description: item.description,
      details: item.details || [],
      dimensions: item.dimensions || undefined,
      materials: item.materials,
      inStock: Boolean(item.in_stock),
    }))
  } catch (err) {
    console.warn("[productService] Network exception, using fallback:", err)
    return fallbackProducts
  }
}

/**
 * Fetches curated categories from Supabase.
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return fallbackCategories
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true })

    if (error || !data || data.length === 0) {
      if (error)
        console.warn(
          "[productService] Categories fetch error, using fallback:",
          error.message,
        )
      return fallbackCategories
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      note: item.note || "",
      image: item.image,
      categoryType: item.id as any,
    }))
  } catch (err) {
    return fallbackCategories
  }
}
