import { supabase, isSupabaseConfigured } from "../lib/supabase"
import { UserOrder, CartItem } from "../types"

interface OrderCustomerDetails {
  fullName: string
  email: string
  phone?: string
  address: string
  city: string
  postalCode?: string
  country?: string
  promoCode?: string
  discountAmount?: number
  currencyCode?: string
  currencyRate?: number
}

/**
 * Persists a new order and its line items into Supabase.
 */
export async function saveOrderToDatabase(
  order: UserOrder,
  customerDetails: OrderCustomerDetails,
  items: CartItem[],
  userId?: string | null,
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    // 1. Insert into orders table
    const { error: orderError } = await supabase.from("orders").insert([
      {
        id: order.id,
        user_id: userId || null,
        full_name: customerDetails.fullName,
        email: customerDetails.email,
        phone: customerDetails.phone || null,
        address: customerDetails.address,
        city: customerDetails.city,
        postal_code: customerDetails.postalCode || null,
        country: customerDetails.country || "Bangladesh",
        subtotal: items.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0,
        ),
        discount_amount: customerDetails.discountAmount || 0,
        promo_code: customerDetails.promoCode || null,
        total: order.total,
        currency_code: customerDetails.currencyCode || "BDT",
        currency_rate: customerDetails.currencyRate || 120.0,
        status: order.status || "In Atelier",
        payment_method: "card",
        payment_status: "paid",
        tracking_number: order.trackingNumber,
      },
    ])

    if (orderError) {
      console.warn("[orderService] Failed to insert order:", orderError.message)
      return false
    }

    // 2. Insert line items
    const lineItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
      image: item.product.image,
      selected_size: item.selectedSize || null,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(lineItems)

    if (itemsError) {
      console.warn(
        "[orderService] Failed to insert order items:",
        itemsError.message,
      )
    }

    return true
  } catch (err) {
    console.warn("[orderService] Exception saving order:", err)
    return false
  }
}

/**
 * Fetches order history for a given user from Supabase.
 */
export async function fetchUserOrdersFromDatabase(
  userId: string,
): Promise<UserOrder[] | null> {
  if (!isSupabaseConfigured() || !userId) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        status,
        total,
        tracking_number,
        order_items (
          product_name,
          quantity,
          unit_price,
          image
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error || !data) {
      return null
    }

    return data.map((item: any) => ({
      id: item.id,
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      status: item.status,
      items: (item.order_items || []).map((oi: any) => ({
        productName: oi.product_name,
        quantity: oi.quantity,
        price: Number(oi.unit_price),
        image: oi.image,
      })),
      total: Number(item.total),
      trackingNumber: item.tracking_number,
    }))
  } catch (err) {
    return null
  }
}

/**
 * Admin: Fetches all orders across all customers from Supabase.
 */
export async function fetchAllOrdersForAdmin(): Promise<UserOrder[] | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        status,
        total,
        tracking_number,
        full_name,
        email,
        phone,
        city,
        address,
        order_items (
          product_name,
          quantity,
          unit_price,
          image
        )
      `)
      .order("created_at", { ascending: false })

    if (error || !data) {
      console.warn("[orderService] Failed to fetch all orders:", error?.message)
      return null
    }

    return data.map((item: any) => ({
      id: item.id,
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: item.status,
      customerName: item.full_name,
      customerEmail: item.email,
      customerPhone: item.phone,
      shippingCity: item.city,
      items: (item.order_items || []).map((oi: any) => ({
        productName: oi.product_name,
        quantity: oi.quantity,
        price: Number(oi.unit_price),
        image: oi.image,
      })),
      total: Number(item.total),
      trackingNumber: item.tracking_number,
    }))
  } catch (err) {
    console.warn("[orderService] Exception fetching admin orders:", err)
    return null
  }
}

/**
 * Admin: Updates the fulfillment status of an order.
 */
export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)

    if (error) {
      console.warn("[orderService] Update status error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.warn("[orderService] Exception updating order status:", err)
    return false
  }
}
