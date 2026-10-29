import React, { createContext, useContext, useState, useEffect } from "react"
import {
  Product,
  CartItem,
  Currency,
  ProductCategory,
  ToastMessage,
  UserOrder,
  AppointmentData,
} from "../types"
import { currencies } from "../data/currencies"
import { products } from "../data/products"

interface ShopContextType {
  // Cart
  cart: CartItem[]
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
  ) => void
  updateQuantity: (productId: number, delta: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  cartCount: number
  cartSubtotal: number

  // Wishlist
  wishlist: number[]
  toggleWishlist: (productId: number) => void
  isWishlisted: (productId: number) => boolean

  // Currency
  currency: Currency
  setCurrency: (c: Currency) => void
  formatPrice: (priceUSD: number) => string

  // Category Filtering
  activeCategory: ProductCategory
  setActiveCategory: (cat: ProductCategory) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Modals & Drawers
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isWishlistOpen: boolean
  setIsWishlistOpen: (open: boolean) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isAccountOpen: boolean
  setIsAccountOpen: (open: boolean) => void
  isAppointmentOpen: boolean
  setIsAppointmentOpen: (open: boolean) => void
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  isCurrencyModalOpen: boolean
  setIsCurrencyModalOpen: (open: boolean) => void
  quickViewProduct: Product | null
  setQuickViewProduct: (p: Product | null) => void

  // Toasts
  toasts: ToastMessage[]
  showToast: (text: string, type?: "success" | "info" | "error") => void
  removeToast: (id: string) => void

  // Orders & Appointment Logic
  orders: UserOrder[]
  createOrder: (shippingDetails: any) => UserOrder
  appointments: AppointmentData[]
  bookAppointment: (data: AppointmentData) => void
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize cart from localStorage if present
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Initialize wishlist from localStorage if present
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_wishlist")
      return saved ? JSON.parse(saved) : [1]
    } catch {
      return [1]
    }
  })

  const [currency, setCurrency] = useState<Currency>(currencies[0])
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Orders
  const [orders, setOrders] = useState<UserOrder[]>([
    {
      id: "AUR-892410",
      date: "October 14, 2026",
      status: "Delivered",
      items: [
        {
          productName: "Élan Sculpted Tote",
          quantity: 1,
          price: 1280,
          image: products[0].image,
        },
      ],
      total: 1280,
      trackingNumber: "PAR-DHL-994821",
    },
  ])

  // Appointments
  const [appointments, setAppointments] = useState<AppointmentData[]>([])

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_cart", JSON.stringify(cart))
    } catch (e) {
      console.warn("Could not save cart", e)
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_wishlist", JSON.stringify(wishlist))
    } catch (e) {
      console.warn("Could not save wishlist", e)
    }
  }, [wishlist])

  const showToast = (
    text: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && item.selectedSize === selectedSize,
      )
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { product, quantity, selectedSize }]
    })
    showToast(`Added "${product.name}" to bag`)
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId) {
              const newQty = item.quantity + delta
              return newQty > 0 ? { ...item, quantity: newQty } : null
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const removeFromCart = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId)
    setCart((prev) => prev.filter((i) => i.product.id !== productId))
    if (item) {
      showToast(`Removed "${item.product.name}" from bag`, "info")
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (productId: number) => {
    const exists = wishlist.includes(productId)
    const product = products.find((p) => p.id === productId)
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId))
      if (product) showToast(`Removed "${product.name}" from wishlist`, "info")
    } else {
      setWishlist((prev) => [...prev, productId])
      if (product) showToast(`Saved "${product.name}" to wishlist`)
    }
  }

  const isWishlisted = (productId: number) => wishlist.includes(productId)

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currency.rate
    if (currency.code === "JPY") {
      return `${currency.symbol}${Math.round(converted).toLocaleString()}`
    }
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`
  }

  const createOrder = (shippingDetails: any): UserOrder => {
    const newOrder: UserOrder = {
      id: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      status: "In Atelier",
      items: cart.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      })),
      total: cartSubtotal,
      trackingNumber: `PAR-VIP-${Math.floor(100000 + Math.random() * 900000)}`,
    }

    setOrders((prev) => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  const bookAppointment = (data: AppointmentData) => {
    setAppointments((prev) => [data, ...prev])
    showToast(
      `Appointment confirmed for ${data.date} in ${data.city}. We look forward to welcoming you.`,
    )
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currency,
        setCurrency,
        formatPrice,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAppointmentOpen,
        setIsAppointmentOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isCurrencyModalOpen,
        setIsCurrencyModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        showToast,
        removeToast,
        orders,
        createOrder,
        appointments,
        bookAppointment,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
