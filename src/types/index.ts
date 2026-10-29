export type IconName = "arrow" | "arrow-up" | "bag" | "check" | "chevron" | "clock" | "heart" | "instagram" | "menu" | "quote" | "search" | "shield" | "sparkle" | "star" | "user" | "x" | "plus" | "minus" | "trash" | "eye" | "calendar" | "lock"

export type ProductCategory = "all" | "leather" | "fragrance" | "silk"

export interface Product {
  id: number
  name: string
  subtitle: string
  category: string
  categoryType: ProductCategory
  price: number // base price in USD
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
  status: "Processing" | "In Atelier" | "Dispatched" | "Delivered" | "Cancelled"
  items: {
    productName: string
    quantity: number
    price: number
    image: string
  }[]
  total: number
  trackingNumber: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingCity?: string
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
