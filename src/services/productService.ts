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

/**
 * Inserts a new product into Supabase (or returns mapped model for local state fallback).
 */
export async function createProduct(
  productData: Omit<Product, "id">,
): Promise<Product | null> {
  const newId = Date.now()
  const newProduct: Product = {
    ...productData,
    id: newId,
  }

  if (!isSupabaseConfigured()) {
    return newProduct
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          id: newId,
          name: productData.name,
          subtitle: productData.subtitle || "",
          category: productData.category,
          category_type:
            productData.categoryType === "all"
              ? "leather"
              : productData.categoryType || "leather",
          price: productData.price,
          rating: productData.rating || 5.0,
          reviews_count: productData.reviewsCount || 0,
          badge: productData.badge || null,
          image: productData.image,
          additional_images: productData.additionalImages || [],
          description: productData.description || "",
          details: productData.details || [],
          dimensions: productData.dimensions || null,
          materials: productData.materials || "Handcrafted Luxury",
          in_stock: productData.inStock !== false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.warn(
        "[productService] Create product error in Supabase:",
        error.message,
      )
      return newProduct
    }

    return {
      id: Number(data.id),
      name: data.name,
      subtitle: data.subtitle,
      category: data.category,
      categoryType: data.category_type,
      price: Number(data.price),
      rating: Number(data.rating),
      reviewsCount: Number(data.reviews_count),
      badge: data.badge || undefined,
      image: data.image,
      additionalImages: data.additional_images || [],
      description: data.description,
      details: data.details || [],
      dimensions: data.dimensions || undefined,
      materials: data.materials,
      inStock: Boolean(data.in_stock),
    }
  } catch (err) {
    console.warn("[productService] Network exception on product creation:", err)
    return newProduct
  }
}

/**
 * Updates a product in Supabase.
 */
export async function updateProductInDb(
  id: number,
  updates: Partial<Product>,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true

  try {
    const dbPayload: any = {}
    if (updates.name !== undefined) dbPayload.name = updates.name
    if (updates.subtitle !== undefined) dbPayload.subtitle = updates.subtitle
    if (updates.price !== undefined) dbPayload.price = updates.price
    if (updates.inStock !== undefined) dbPayload.in_stock = updates.inStock
    if (updates.badge !== undefined) dbPayload.badge = updates.badge
    if (updates.image !== undefined) dbPayload.image = updates.image
    if (updates.description !== undefined)
      dbPayload.description = updates.description

    const { error } = await supabase
      .from("products")
      .update(dbPayload)
      .eq("id", id)

    if (error) {
      console.warn("[productService] Update error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn("[productService] Exception updating product:", err)
    return false
  }
}

/**
 * Deletes a product from Supabase.
 */
export async function deleteProductFromDb(id: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return true

  try {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) {
      console.warn("[productService] Delete error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn("[productService] Exception deleting product:", err)
    return false
  }
}
