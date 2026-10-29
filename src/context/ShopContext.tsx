import React, { createContext, useContext, useState, useEffect } from "react"
import {
  Product,
  Category,
  CartItem,
  Currency,
  ProductCategory,
  ToastMessage,
  UserOrder,
  AppointmentData,
  StoreSettings,
} from "../types"
import { DEFAULT_STORE_SETTINGS } from "../admin/services/adminService"
import { currencies } from "../data/currencies"
import { products as initialProducts } from "../data/products"
import { categories as initialCategories } from "../data/categories"
import { isSupabaseConfigured, supabase } from "../lib/supabase"
import {
  getProducts,
  getCategories,
  createProduct,
  updateProductInDb,
  deleteProductFromDb,
} from "../services/productService"
import {
  saveOrderToDatabase,
  fetchAllOrdersForAdmin,
  updateOrderStatusInDb,
} from "../services/orderService"
import {
  saveAppointmentToDatabase,
  fetchAllAppointmentsForAdmin,
  updateAppointmentStatusInDb,
} from "../services/appointmentService"
import {
  signInUser,
  signUpUser,
  signOutUser,
  getUserProfile,
  AuthProfile,
} from "../services/authService"

interface ShopContextType {
  // Products & Categories (Supabase + Local fallback)
  products: Product[]
  categories: Category[]
  isDbConnected: boolean
  isLoadingProducts: boolean

  // Admin & Products Management
  isAdminOpen: boolean
  setIsAdminOpen: (open: boolean) => void
  userProfile: AuthProfile | null
  isAdmin: boolean
  loginUser: (
    email: string,
    password?: string,
  ) => Promise<{ success: boolean error?: string isAdmin?: boolean }>
  registerUser: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ success: boolean error?: string }>
  logoutUser: () => Promise<void>
  addNewProduct: (productData: Omit<Product, "id">) => Promise<boolean>
  editProduct: (id: number, updates: Partial<Product>) => Promise<boolean>
  removeProduct: (id: number) => Promise<boolean>
  updateOrderStatus: (
    orderId: string,
    newStatus: UserOrder["status"],
  ) => Promise<boolean>
  updateAppointmentStatus: (id: string, status: string) => Promise<boolean>
  allAdminOrders: UserOrder[]
  allAdminAppointments: AppointmentData[]

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
  cartFinalTotal: number
  promoCode: string
  discountPercent: number
  discountAmount: number
  applyPromoCode: (code: string) => boolean

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
  closeAllModals: () => void

  // Toasts
  toasts: ToastMessage[]
  showToast: (text: string, type?: "success" | "info" | "error") => void
  removeToast: (id: string) => void

  // Orders & Appointment Logic
  orders: UserOrder[]
  createOrder: (shippingDetails: any) => UserOrder
  appointments: AppointmentData[]
  bookAppointment: (data: AppointmentData) => void

  // Auth User State
  authUser: any | null

  // Store Settings & Payment Gateways
  storeSettings: StoreSettings
  updateStoreSettings: (newSettings: StoreSettings) => Promise<boolean>
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

const DEFAULT_ORDERS: UserOrder[] = [
  {
    id: "AUR-892410",
    date: "October 14, 2026",
    status: "Delivered",
    items: [
      {
        productName: "Élan Sculpted Tote",
        quantity: 1,
        price: 1280,
        image: initialProducts[0].image,
      },
    ],
    total: 1280,
    trackingNumber: "DAC-EXP-994821",
  },
]

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Products & Categories loaded from Supabase or Fallback
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isDbConnected, setIsDbConnected] = useState<boolean>(
    isSupabaseConfigured(),
  )
  const [authUser, setAuthUser] = useState<any | null>(null)

  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Initialize wishlist from localStorage
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_wishlist")
      return saved ? JSON.parse(saved) : [1]
    } catch {
      return [1]
    }
  })

  // Initialize orders from localStorage
  const [orders, setOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_orders")
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS
    } catch {
      return DEFAULT_ORDERS
    }
  })

  // Initialize appointments from localStorage
  const [appointments, setAppointments] = useState<AppointmentData[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_appointments")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Promo code & discount state
  const [promoCode, setPromoCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState(0)

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
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // User Profile & Authentication State
  const [userProfile, setUserProfile] = useState<AuthProfile | null>(() => {
    try {
      const saved = localStorage.getItem("aurelia_user_profile")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Automatically treat nazmusshakib335@gmail.com or profiles with role='admin' as Master Admin
  const isAdmin = Boolean(
    userProfile?.role === "admin" ||
      authUser?.email?.toLowerCase() === "nazmusshakib335@gmail.com" ||
      userProfile?.email?.toLowerCase() === "nazmusshakib335@gmail.com" ||
      userProfile?.email?.toLowerCase().startsWith("admin@"),
  )

  // Synchronize store settings with Supabase if configured
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem("aurelia_store_settings")
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS
    } catch {
      return DEFAULT_STORE_SETTINGS
    }
  })

  useEffect(() => {
    const fetchSettings = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from("store_settings")
            .select("settings")
            .limit(1)
            .maybeSingle()
          if (data?.settings) {
            setStoreSettings(data.settings)
            localStorage.setItem(
              "aurelia_store_settings",
              JSON.stringify(data.settings),
            )
          }
        } catch (err) {
          console.warn(
            "[ShopContext] Failed to fetch store settings from Supabase:",
            err,
          )
        }
      }
    }
    fetchSettings()
  }, [])

  const updateStoreSettings = async (
    newSettings: StoreSettings,
  ): Promise<boolean> => {
    setStoreSettings(newSettings)
    try {
      localStorage.setItem(
        "aurelia_store_settings",
        JSON.stringify(newSettings),
      )
      if (isSupabaseConfigured()) {
        await supabase
          .from("store_settings")
          .upsert({ id: "default_store", settings: newSettings })
      }
      showToast(
        "Store configuration and payment gateways updated successfully",
        "success",
      )
      return true
    } catch (err) {
      console.warn("[ShopContext] Error updating store settings:", err)
      showToast("Settings updated locally", "info")
      return true
    }
  }

  // Admin Data Collections
  const [allAdminOrders, setAllAdminOrders] = useState<UserOrder[]>(orders)
  const [allAdminAppointments, setAllAdminAppointments] =
    useState<AppointmentData[]>(appointments)

  // Keep admin lists synchronized with customer state
  useEffect(() => {
    setAllAdminOrders(orders)
  }, [orders])

  useEffect(() => {
    setAllAdminAppointments(appointments)
  }, [appointments])

  // Refresh admin data from Supabase if connected
  const refreshAdminData = async () => {
    if (isSupabaseConfigured()) {
      const [adminOrders, adminApts] = await Promise.all([
        fetchAllOrdersForAdmin(),
        fetchAllAppointmentsForAdmin(),
      ])
      if (adminOrders && adminOrders.length > 0) setAllAdminOrders(adminOrders)
      if (adminApts && adminApts.length > 0) setAllAdminAppointments(adminApts)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      refreshAdminData()
    }
  }, [isAdmin])

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Load products & categories from Supabase on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (isSupabaseConfigured()) {
        setIsLoadingProducts(true)
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        if (isMounted) {
          if (fetchedProducts && fetchedProducts.length > 0) {
            setProducts(fetchedProducts)
          }
          if (fetchedCategories && fetchedCategories.length > 0) {
            setCategories(fetchedCategories)
          }
          setIsLoadingProducts(false)
          setIsDbConnected(true)
        }
      }
    }

    loadData()

    // Listen to Supabase auth state if configured
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) setAuthUser(session?.user ?? null)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) setAuthUser(session?.user ?? null)
      })

      return () => {
        isMounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  // Persistence effects
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

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_orders", JSON.stringify(orders))
    } catch (e) {
      console.warn("Could not save orders", e)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_appointments", JSON.stringify(appointments))
    } catch (e) {
      console.warn("Could not save appointments", e)
    }
  }, [appointments])

  // Body scroll lock & Escape key handler
  const isAnyModalOpen =
    isCartOpen ||
    isWishlistOpen ||
    isSearchOpen ||
    isAccountOpen ||
    isAppointmentOpen ||
    isCheckoutOpen ||
    isCurrencyModalOpen ||
    isAdminOpen ||
    Boolean(quickViewProduct)

  const closeAllModals = () => {
    setIsCartOpen(false)
    setIsWishlistOpen(false)
    setIsSearchOpen(false)
    setIsAccountOpen(false)
    setIsAppointmentOpen(false)
    setIsCheckoutOpen(false)
    setIsCurrencyModalOpen(false)
    setIsAdminOpen(false)
    setQuickViewProduct(null)
  }

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isAnyModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAnyModalOpen) {
        closeAllModals()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAnyModalOpen])

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
    const safeQty = Math.max(1, quantity)
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && item.selectedSize === selectedSize,
      )
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + safeQty }
            : item,
        )
      }
      return [...prev, { product, quantity: safeQty, selectedSize }]
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

  const discountAmount =
    discountPercent > 0 ? (cartSubtotal * discountPercent) / 100 : 0
  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount)

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase()
    if (clean === "MAISON10") {
      setPromoCode("MAISON10")
      setDiscountPercent(10)
      showToast("Promo 'MAISON10' applied: 10% privilege discount!")
      return true
    } else if (clean === "AURELIA20") {
      setPromoCode("AURELIA20")
      setDiscountPercent(20)
      showToast("VIP Promo 'AURELIA20' applied: 20% discount!")
      return true
    } else {
      showToast("Invalid promotion code. Try 'MAISON10'", "error")
      return false
    }
  }

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * currency.rate
    if (currency.code === "BDT") {
      return `${currency.symbol}${Math.round(converted).toLocaleString("en-IN")}`
    }
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`
  }

  const createOrder = (shippingDetails: any): UserOrder => {
    const paymentMethod = shippingDetails.paymentMethod || "bKash"
    const paymentStatus =
      shippingDetails.paymentStatus ||
      (paymentMethod === "Cash on Delivery" ? "pending" : "paid")

    const isDhaka = (shippingDetails.city || "").toLowerCase().includes("dhaka")
    const standardFee = isDhaka
      ? storeSettings.deliveryChargeDhaka
      : storeSettings.deliveryChargeOutside
    const deliveryFee =
      cartSubtotal >= storeSettings.freeShippingThreshold
        ? 0
        : shippingDetails.deliveryCharge !== undefined
          ? shippingDetails.deliveryCharge
          : standardFee

    const finalGrandTotal = cartFinalTotal + deliveryFee

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
        selectedSize: item.selectedSize,
      })),
      total: finalGrandTotal,
      subtotal: cartSubtotal,
      discountAmount,
      deliveryCharge: deliveryFee,
      promoCode: promoCode || undefined,
      paymentMethod,
      paymentStatus,
      paymentDetails: shippingDetails.paymentDetails,
      customerName: shippingDetails.fullName,
      customerEmail: shippingDetails.email,
      customerPhone: shippingDetails.phone,
      shippingCity: shippingDetails.city,
      shippingAddress: shippingDetails.address,
      trackingNumber: `DAC-VIP-${Math.floor(100000 + Math.random() * 900000)}`,
    }

    // 1. Update local state & localStorage immediately for instant UI feedback
    setOrders((prev) => [newOrder, ...prev])

    // 2. Persist to Supabase PostgreSQL in background
    if (isSupabaseConfigured()) {
      saveOrderToDatabase(
        newOrder,
        {
          fullName: shippingDetails.fullName,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
          promoCode: promoCode || undefined,
          discountAmount,
          currencyCode: currency.code,
          currencyRate: currency.rate,
        },
        cart,
        authUser?.id,
      )
    }

    clearCart()
    return newOrder
  }

  const bookAppointment = (data: AppointmentData) => {
    setAppointments((prev) => [data, ...prev])

    // Persist to Supabase PostgreSQL in background if connected
    if (isSupabaseConfigured()) {
      saveAppointmentToDatabase(data, authUser?.id)
    }

    showToast(
      `Appointment confirmed for ${data.date} in ${data.city}. We look forward to welcoming you.`,
    )
  }

  // Authentication & Profile Actions
  const loginUser = async (email: string, password = "") => {
    const isMasterAdminEmail =
      email.toLowerCase() === "nazmusshakib335@gmail.com" ||
      email.toLowerCase().startsWith("admin@")

    try {
      if (isSupabaseConfigured()) {
        const { user, error } = await signInUser(email, password)
        if (error) {
          return { success: false, error: error.message }
        }

        const profile = await getUserProfile(user?.id || "", email)
        if (profile) {
          setUserProfile(profile)
          localStorage.setItem("aurelia_user_profile", JSON.stringify(profile))
        }
      } else {
        // Fallback local mock login
        const mockProfile: AuthProfile = {
          id: isMasterAdminEmail ? "admin-master" : "user-client",
          fullName: isMasterAdminEmail
            ? "Nazmus Shakib (Master Admin)"
            : "VIP Client",
          email,
          role: isMasterAdminEmail ? "admin" : "customer",
        }
        setUserProfile(mockProfile)
        localStorage.setItem(
          "aurelia_user_profile",
          JSON.stringify(mockProfile),
        )
      }

      if (isMasterAdminEmail) {
        showToast(
          "Welcome Master Administrator. Atelier Admin Portal unlocked.",
          "success",
        )
        setIsAdminOpen(true)
        return { success: true, isAdmin: true }
      } else {
        showToast("Welcome back to your Aurélia Client Account.", "success")
        return { success: true, isAdmin: false }
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to sign in" }
    }
  }

  const registerUser = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await signUpUser(email, password, fullName)
        if (error) {
          return { success: false, error: error.message }
        }
      }

      const isMasterAdminEmail =
        email.toLowerCase() === "nazmusshakib335@gmail.com"

      const newProfile: AuthProfile = {
        id: "new-user-" + Date.now(),
        fullName,
        email,
        role: isMasterAdminEmail ? "admin" : "customer",
      }

      setUserProfile(newProfile)
      localStorage.setItem("aurelia_user_profile", JSON.stringify(newProfile))
      showToast("Your Aurélia Client Account has been created.", "success")
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" }
    }
  }

  const logoutUser = async () => {
    if (isSupabaseConfigured()) {
      await signOutUser()
    }
    setAuthUser(null)
    setUserProfile(null)
    localStorage.removeItem("aurelia_user_profile")
    setIsAdminOpen(false)
    showToast("You have been signed out.", "info")
  }

  // Admin Catalog & Product Actions
  const addNewProduct = async (productData: Omit<Product, "id">) => {
    const created = await createProduct(productData)
    if (created) {
      setProducts((prev) => [created, ...prev])
      showToast(`'${created.name}' added to Maison collection.`, "success")
      return true
    }
    showToast("Failed to create product.", "error")
    return false
  }

  const editProduct = async (id: number, updates: Partial<Product>) => {
    const success = await updateProductInDb(id, updates)
    if (success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      )
      showToast("Product updated successfully.", "success")
      return true
    }
    showToast("Failed to update product.", "error")
    return false
  }

  const removeProduct = async (id: number) => {
    const success = await deleteProductFromDb(id)
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showToast("Product deleted from collection.", "info")
      return true
    }
    showToast("Failed to delete product.", "error")
    return false
  }

  // Admin Order & Fulfillment Actions
  const updateOrderStatus = async (
    orderId: string,
    newStatus: UserOrder["status"],
  ) => {
    const success = await updateOrderStatusInDb(orderId, newStatus)
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      )
      setAllAdminOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      )
      showToast(`Order ${orderId} marked as ${newStatus}.`, "success")
      return true
    }
    showToast("Failed to update order status.", "error")
    return false
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    const success = await updateAppointmentStatusInDb(id, status)
    if (success) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.advisor === id || a.email === id ? { ...a, status } : a,
        ),
      )
      setAllAdminAppointments((prev) =>
        prev.map((a) =>
          a.advisor === id || a.email === id ? { ...a, status } : a,
        ),
      )
      showToast(`Appointment status updated to ${status}.`, "success")
      return true
    }
    return false
  }

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        isDbConnected,
        isLoadingProducts,
        isAdminOpen,
        setIsAdminOpen,
        userProfile,
        isAdmin,
        loginUser,
        registerUser,
        logoutUser,
        addNewProduct,
        editProduct,
        removeProduct,
        updateOrderStatus,
        updateAppointmentStatus,
        allAdminOrders,
        allAdminAppointments,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartFinalTotal,
        promoCode,
        discountPercent,
        discountAmount,
        applyPromoCode,
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
        closeAllModals,
        toasts,
        showToast,
        removeToast,
        orders,
        createOrder,
        appointments,
        bookAppointment,
        authUser,
        storeSettings,
        updateStoreSettings,
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
