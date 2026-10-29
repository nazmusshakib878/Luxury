export type IconName = "arrow" | "arrow-up" | "bag" | "check" | "chevron" | "clock" | "heart" | "instagram" | "menu" | "quote" | "search" | "shield" | "sparkle" | "star" | "user" | "x" | "plus" | "minus" | "trash" | "eye" | "calendar" | "lock" | "box" | "tag" | "users" | "chart" | "settings" | "refresh" | "download" | "filter" | "bell" | "printer" | "external-link" | "dollar" | "edit" | "credit-card" | "smartphone" | "copy"

export type ProductCategory = "all" | "leather" | "fragrance" | "silk"

export interface Product {
  id: number
  name: string
  subtitle: string
  category: string
  categoryType: ProductCategory
  price: number // base price in USD
  salePrice?: number
  sku?: string
  stockQuantity?: number
  lowStockThreshold?: number
  rating: number
  reviewsCount: number
  badge?: string
  image: string
  additionalImages?: string[]
  description: string
  details: string[]
  dimensions?: string
  materials: string
  inStock: boolean
  isPublished?: boolean
}

export interface Category {
  id: string
  name: string
  note: string
  image: string
  categoryType: ProductCategory
}

export interface Testimonial {
  id: number
  quote: string
  author: string
  role: string
  image: string
}

export interface HeroSlide {
  id: number
  eyebrow: string
  titleLine1: string
  titleEm: string
  intro: string
  image: string
  floatLabel: string
  floatTitle: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}

export interface Currency {
  code: string
  symbol: string
  rate: number // conversion rate from USD
  label: string
}

export interface UserOrder {
  id: string
  date: string
  status: "Pending" | "Confirmed" | "Processing" | "In Atelier" | "Dispatched" | "Delivered" | "Cancelled" | "Refunded"
  items: {
    productName: string
    quantity: number
    price: number
    image: string
    selectedSize?: string
  }[]
  total: number
  subtotal?: number
  discountAmount?: number
  deliveryCharge?: number
  promoCode?: string
  paymentMethod?: string
  paymentStatus?: "pending" | "paid" | "refunded" | "failed"
  paymentDetails?: {
    walletNumber?: string
    transactionId?: string
    cardLast4?: string
    cardBrand?: string
    accountType?: string
  }
  trackingNumber: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingCity?: string
  shippingAddress?: string
  notes?: string
}

export interface Coupon {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderAmount: number
  usageLimit?: number
  usageCount: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface ProductReview {
  id: string
  productId: number
  productName: string
  customerName: string
  customerEmail?: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface Customer {
  id: string
  fullName: string
  email: string
  phone?: string
  city?: string
  address?: string
  totalOrders: number
  totalSpent: number
  registeredAt: string
  lastOrderDate?: string
}

export interface InventoryLog {
  id: string
  productId: number
  productName: string
  changeType: "restock" | "sale" | "adjustment" | "return"
  quantityDelta: number
  newQuantity: number
  reason?: string
  createdAt: string
}

export interface BkashConfig {
  enabled: boolean
  accountType: "merchant" | "personal"
  accountNumber: string
  instructions: string
  sandboxMode: boolean
  appKey?: string
  appSecret?: string
  username?: string
  password?: string
}

export interface NagadConfig {
  enabled: boolean
  accountType: "merchant" | "personal"
  accountNumber: string
  instructions: string
}

export interface CardGatewayConfig {
  enabled: boolean
  provider: "sslcommerz" | "stripe" | "direct"
  storeId?: string
  storePassword?: string
  sandboxMode: boolean
}

export interface CodConfig {
  enabled: boolean
  instructions: string
  maxOrderLimit?: number
}

export interface PaymentGatewaysConfig {
  bkash: BkashConfig
  nagad: NagadConfig
  card: CardGatewayConfig
  cod: CodConfig
}

export interface StoreSettings {
  storeName: string
  supportEmail: string
  supportPhone: string
  storeAddress: string
  currencySymbol: string
  deliveryChargeDhaka: number
  deliveryChargeOutside: number
  freeShippingThreshold: number
  lowStockThreshold: number
  paymentGateways?: PaymentGatewaysConfig
}

export interface AppointmentData {
  city: string
  date: string
  time: string
  advisor: string
  clientName: string
  email: string
  phone: string
  notes?: string
  status?: string
}

export interface ToastMessage {
  id: string
  text: string
  type?: "success" | "info" | "error"
}
