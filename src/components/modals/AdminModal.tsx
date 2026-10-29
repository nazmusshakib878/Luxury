import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
import { Product, ProductCategory, UserOrder } from "../../types"
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  isSupabaseConfigured,
  setSupabaseCredentials,
  testSupabaseConnection,
} from "../../lib/supabase"

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addNewProduct,
    editProduct,
    removeProduct,
    allAdminOrders,
    updateOrderStatus,
    allAdminAppointments,
    updateAppointmentStatus,
    formatPrice,
    userProfile,
    showToast,
  } = useShop()

  const [activeTab, setActiveTab] =
    useState<"overview" | "orders" | "products" | "appointments" | "api">(
      "overview",
    )

  // API Config State
  const [apiUrl, setApiUrl] = useState(getSupabaseUrl())
  const [apiKey, setApiKey] = useState(getSupabaseAnonKey())
  const [testResult, setTestResult] = useState<{
    tested: boolean
    success?: boolean
    message?: string
  }>({ tested: false })
  const [isTesting, setIsTesting] = useState(false)

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSubtitle, setNewSubtitle] = useState("")
  const [newCategory, setNewCategory] = useState<ProductCategory>("leather")
  const [newPrice, setNewPrice] = useState<number>(1200)
  const [newImage, setNewImage] = useState(
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
  )
  const [newBadge, setNewBadge] = useState("Atelier Exclusive")
  const [newDescription, setNewDescription] = useState("")
  const [newMaterials, setNewMaterials] = useState(
    "French Box Calfskin, Hand-stitched with 24K gold-plated accents",
  )
  const [newDimensions, setNewDimensions] = useState("32 × 24 × 14 cm")
  const [newInStock, setNewInStock] = useState(true)

  // Quick edit price state
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null)
  const [tempPrice, setTempPrice] = useState<number>(0)

  if (!isAdminOpen) return null

  // Calculate metrics
  const totalRevenue = allAdminOrders.reduce(
    (acc, o) => acc + (o.total || 0),
    0,
  )
  const totalOrders = allAdminOrders.length
  const totalProducts = products.length
  const totalAppointments = allAdminAppointments.length

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      showToast("Please provide a product title.", "error")
      return
    }

    const categoryNames: Record<ProductCategory, string> = {
      all: "Curated Luxury",
      leather: "Leather Goods",
      fragrance: "Fine Fragrance",
      silk: "Artisanal Silk",
    }

    const success = await addNewProduct({
      name: newTitle,
      subtitle: newSubtitle || "Handcrafted Parisian Masterpiece",
      category: categoryNames[newCategory],
      categoryType: newCategory,
      price: Number(newPrice) || 100,
      rating: 5.0,
      reviewsCount: 1,
      badge: newBadge || undefined,
      image: newImage,
      additionalImages: [newImage],
      description:
        newDescription ||
        "An embodiment of Parisian heritage, individually finished in our French atelier for discerning connoisseurs in Bangladesh.",
      details: [
        "Hand-finished in Aurélia Paris Atelier",
        "Accompanied by Certificate of Authenticity",
        "Complimentary white-glove courier delivery across Bangladesh",
      ],
      dimensions: newDimensions,
      materials: newMaterials,
      inStock: newInStock,
    })

    if (success) {
      setShowAddForm(false)
      setNewTitle("")
      setNewSubtitle("")
      setNewDescription("")
    }
  }

  const handleSavePrice = async (id: number) => {
    if (tempPrice > 0) {
      await editProduct(id, { price: tempPrice })
      setEditingPriceId(null)
    }
  }

  const handleTestApi = async () => {
    setIsTesting(true)
    setTestResult({ tested: false })
    const res = await testSupabaseConnection(apiUrl, apiKey)
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message,
    })
    setIsTesting(false)
    if (res.success) {
      showToast("Supabase API connected successfully!", "success")
    } else {
      showToast("API connection failed. Please verify credentials.", "error")
    }
  }

  const handleSaveApi = () => {
    if (!apiUrl.trim() || !apiKey.trim()) {
      showToast(
        "Please provide both Supabase Project URL and Anon Key.",
        "error",
      )
      return
    }
    const success = setSupabaseCredentials(apiUrl, apiKey)
    if (success) {
      showToast("API credentials saved! Reloading live store...", "success")
      setTimeout(() => {
        window.location.reload()
      }, 800)
    }
  }

  return (
    <div
      className="modal-overlay z-[9999]"
      onClick={() => setIsAdminOpen(false)}
      aria-label="Admin modal overlay"
    >
      <div
        className="luxury-modal p-6 md:p-8 max-w-[1100px] w-[95vw] max-h-[90vh] overflow-y-auto bg-[#171713] text-[#f7f5f0] border border-[#3a362f]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#2d2a24] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#aa8b5f] text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
                <Icon name="sparkle" size={14} /> Aurélia Maison Paris
              </span>
              <span className="bg-[#aa8b5f]/20 text-[#d4af37] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-[#aa8b5f]/40 rounded-sm">
                Executive Atelier Portal
              </span>
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl text-[#f7f5f0] m-0">
              Master Admin Control Center
            </h2>
            <p className="text-[#a19a8d] text-xs mt-1">
              Logged in as:{" "}
              <strong className="text-[#aa8b5f]">
                {userProfile?.email || "nazmusshakib335@gmail.com"}
              </strong>{" "}
              (Administrator Role Verified)
            </p>
          </div>

          <button
            className="text-[#a19a8d] hover:text-white p-2 border border-[#3a362f] hover:border-[#aa8b5f] transition-colors"
            onClick={() => setIsAdminOpen(false)}
            aria-label="Close admin view"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#2d2a24] my-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "overview"
                ? "border-[#aa8b5f] text-[#aa8b5f] font-semibold"
                : "border-transparent text-[#999285] hover:text-[#f7f5f0]"
            }`}
          >
            📊 Operations Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-[#aa8b5f] text-[#aa8b5f] font-semibold"
                : "border-transparent text-[#999285] hover:text-[#f7f5f0]"
            }`}
          >
            🛍️ Orders Management
            <span className="bg-[#2d2a24] text-[#aa8b5f] text-[10px] px-1.5 py-0.2 rounded-full">
              {totalOrders}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "products"
                ? "border-[#aa8b5f] text-[#aa8b5f] font-semibold"
                : "border-transparent text-[#999285] hover:text-[#f7f5f0]"
            }`}
          >
            💎 Catalog & Inventory
            <span className="bg-[#2d2a24] text-[#aa8b5f] text-[10px] px-1.5 py-0.2 rounded-full">
              {totalProducts}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "appointments"
                ? "border-[#aa8b5f] text-[#aa8b5f] font-semibold"
                : "border-transparent text-[#999285] hover:text-[#f7f5f0]"
            }`}
          >
            📅 Salon Reservations
            <span className="bg-[#2d2a24] text-[#aa8b5f] text-[10px] px-1.5 py-0.2 rounded-full">
              {totalAppointments}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "api"
                ? "border-[#aa8b5f] text-[#aa8b5f] font-semibold"
                : "border-transparent text-[#999285] hover:text-[#f7f5f0]"
            }`}
          >
            ⚡ API & Database
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                isSupabaseConfigured()
                  ? "bg-[#4caf50]/20 text-[#4caf50]"
                  : "bg-[#e53935]/20 text-[#e53935]"
              }`}
            >
              {isSupabaseConfigured() ? "LIVE" : "OFFLINE"}
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Revenue */}
              <div className="bg-[#1f1d17] p-5 border border-[#332f27]">
                <p className="text-[11px] uppercase tracking-widest text-[#8c8273] font-semibold mb-1">
                  Total Order Value
                </p>
                <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#aa8b5f]">
                  {formatPrice(totalRevenue)}
                </h3>
                <p className="text-[10px] text-[#70695c] mt-2">
                  Live orders recorded across Bangladesh
                </p>
              </div>

              {/* Card 2: Orders */}
              <div className="bg-[#1f1d17] p-5 border border-[#332f27]">
                <p className="text-[11px] uppercase tracking-widest text-[#8c8273] font-semibold mb-1">
                  Customer Orders
                </p>
                <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#f7f5f0]">
                  {totalOrders}
                </h3>
                <p className="text-[10px] text-[#70695c] mt-2">
                  {
                    allAdminOrders.filter((o) => o.status === "Delivered")
                      .length
                  }{" "}
                  fulfilled ·{" "}
                  {
                    allAdminOrders.filter(
                      (o) =>
                        o.status === "Processing" || o.status === "In Atelier",
                    ).length
                  }{" "}
                  active
                </p>
              </div>

              {/* Card 3: Products */}
              <div className="bg-[#1f1d17] p-5 border border-[#332f27]">
                <p className="text-[11px] uppercase tracking-widest text-[#8c8273] font-semibold mb-1">
                  Active Catalog
                </p>
                <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#f7f5f0]">
                  {totalProducts}
                </h3>
                <p className="text-[10px] text-[#70695c] mt-2">
                  {products.filter((p) => p.inStock).length} in stock ·{" "}
                  {products.filter((p) => !p.inStock).length} out of stock
                </p>
              </div>

              {/* Card 4: Appointments */}
              <div className="bg-[#1f1d17] p-5 border border-[#332f27]">
                <p className="text-[11px] uppercase tracking-widest text-[#8c8273] font-semibold mb-1">
                  Salon Bookings
                </p>
                <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#f7f5f0]">
                  {totalAppointments}
                </h3>
                <p className="text-[10px] text-[#70695c] mt-2">
                  Dhaka Gulshan & Banani VIP clients
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-[#1f1d17] border border-[#332f27] space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#aa8b5f] font-semibold">
                Quick Atelier Actions
              </h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab("products")
                    setShowAddForm(true)
                  }}
                  className="px-5 py-2.5 bg-[#aa8b5f] text-[#171713] text-xs font-semibold uppercase tracking-wider hover:bg-[#c2a275] transition-colors flex items-center gap-2"
                >
                  <Icon name="plus" size={16} /> Add New Luxury Product
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="px-5 py-2.5 bg-transparent border border-[#aa8b5f] text-[#aa8b5f] text-xs font-semibold uppercase tracking-wider hover:bg-[#aa8b5f]/10 transition-colors flex items-center gap-2"
                >
                  <Icon name="bag" size={16} /> Review Customer Orders
                </button>
                <button
                  onClick={() => setIsAdminOpen(false)}
                  className="px-5 py-2.5 bg-transparent border border-[#3a362f] text-[#999285] text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-2"
                >
                  <Icon name="eye" size={16} /> View Storefront as Shopper
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-[#a19a8d]">
                Viewing all customer orders recorded in system:
              </p>
            </div>

            {allAdminOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#1f1d17] border border-[#332f27]">
                <p className="text-sm text-[#8c8273]">
                  No orders received yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allAdminOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-[#1f1d17] border border-[#332f27] hover:border-[#4a4437] transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#2d2a24] gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-base text-[#f7f5f0]">
                            {order.id}
                          </span>
                          <span className="text-[#8c8273] text-xs">
                            {order.date}
                          </span>
                        </div>
                        <p className="text-xs text-[#aa8b5f] mt-1 mb-0">
                          Customer:{" "}
                          <strong>
                            {order.customerName || "Valued Patron"}
                          </strong>{" "}
                          · {order.customerPhone || "017XXXXXXXX"} ·{" "}
                          {order.shippingCity || "Dhaka, Bangladesh"}
                        </p>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#8c8273]">
                          Status:
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as UserOrder["status"],
                            )
                          }
                          className="bg-[#171713] text-[#aa8b5f] text-xs font-semibold border border-[#aa8b5f]/50 px-3 py-1.5 rounded-sm focus:outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Atelier">In Atelier</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="py-4 space-y-2 border-b border-[#2d2a24]">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-12 object-cover border border-[#2d2a24]"
                            />
                            <div>
                              <p className="m-0 font-medium text-[#f7f5f0]">
                                {item.productName}
                              </p>
                              <span className="text-[#8c8273] text-[10px]">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold text-[#f7f5f0]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 flex justify-between items-center text-xs">
                      <span className="text-[#8c8273]">
                        Tracking:{" "}
                        <strong className="text-[#f7f5f0]">
                          {order.trackingNumber}
                        </strong>
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-[#8c8273] block uppercase tracking-wider">
                          Total BDT
                        </span>
                        <strong className="text-lg text-[#aa8b5f] font-['Cormorant_Garamond',serif]">
                          {formatPrice(order.total)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-[#a19a8d]">
                Manage all catalog pieces displayed on the live homepage:
              </p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-[#aa8b5f] text-[#171713] text-xs font-semibold uppercase tracking-wider hover:bg-[#c2a275] transition-colors flex items-center gap-2"
              >
                <Icon name={showAddForm ? "minus" : "plus"} size={16} />
                {showAddForm ? "Close Form" : "Add New Product"}
              </button>
            </div>

            {/* Add New Product Form */}
            {showAddForm && (
              <form
                onSubmit={handleCreateProduct}
                className="p-6 bg-[#1f1d17] border border-[#aa8b5f]/40 space-y-4"
              >
                <h4 className="text-sm font-semibold uppercase tracking-widest text-[#aa8b5f] mb-4">
                  Add New Luxury Piece to Collection
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Monogram Silk Tote"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hand-burnished saddle leather"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as ProductCategory)
                      }
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    >
                      <option value="leather">Leather Goods (Leather)</option>
                      <option value="fragrance">Fine Fragrance</option>
                      <option value="silk">Artisanal Silk</option>
                      <option value="all">Curated Luxury</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">
                      Price in USD (Converts to BDT automatically) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                    <span className="text-[10px] text-[#aa8b5f] mt-1 block">
                      Preview in BDT: {formatPrice(newPrice)}
                    </span>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label className="text-xs text-[#8c8273]">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">
                      Luxury Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Limited Edition, Atelier Exclusive"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="form-group">
                    <label className="text-xs text-[#8c8273]">Materials</label>
                    <input
                      type="text"
                      value={newMaterials}
                      onChange={(e) => setNewMaterials(e.target.value)}
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="form-group md:col-span-2">
                    <label className="text-xs text-[#8c8273]">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe the artisan craft..."
                      className="w-full bg-[#171713] border border-[#3a362f] p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3">
                  <label className="flex items-center gap-2 text-xs text-[#f7f5f0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newInStock}
                      onChange={(e) => setNewInStock(e.target.checked)}
                      className="accent-[#aa8b5f]"
                    />
                    Mark as Available in Stock
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#2d2a24]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#aa8b5f] text-[#171713] text-xs font-semibold uppercase tracking-wider hover:bg-[#c2a275]"
                  >
                    Publish to Homepage Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2.5 border border-[#3a362f] text-[#a19a8d] text-xs font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-[#1f1d17] border border-[#332f27] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-16 object-cover border border-[#2d2a24]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="m-0 font-medium text-sm text-[#f7f5f0]">
                          {product.name}
                        </h4>
                        {product.badge && (
                          <span className="px-2 py-0.5 bg-[#aa8b5f]/20 text-[#d4af37] text-[9px] font-semibold uppercase tracking-wider border border-[#aa8b5f]/40">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8c8273] m-0">
                        {product.category} · {product.materials}
                      </p>
                      <span className="text-xs text-[#aa8b5f] font-semibold mt-1 block">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* Stock toggle */}
                    <button
                      onClick={() =>
                        editProduct(product.id, { inStock: !product.inStock })
                      }
                      className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider border ${
                        product.inStock
                          ? "border-[#4caf50]/40 text-[#4caf50] bg-[#4caf50]/10"
                          : "border-[#e53935]/40 text-[#e53935] bg-[#e53935]/10"
                      }`}
                    >
                      {product.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                    </button>

                    {/* Edit price inline */}
                    {editingPriceId === product.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="w-20 bg-[#171713] border border-[#aa8b5f] px-2 py-1 text-xs text-white"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(Number(e.target.value))}
                        />
                        <button
                          onClick={() => handleSavePrice(product.id)}
                          className="p-1 text-[#aa8b5f] hover:text-white"
                          title="Save price"
                        >
                          <Icon name="check" size={16} />
                        </button>
                        <button
                          onClick={() => setEditingPriceId(null)}
                          className="p-1 text-[#8c8273] hover:text-white"
                          title="Cancel"
                        >
                          <Icon name="x" size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPriceId(product.id)
                          setTempPrice(product.price)
                        }}
                        className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider border border-[#3a362f] text-[#a19a8d] hover:text-[#f7f5f0]"
                      >
                        Edit Price
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete '${product.name}' from collection?`,
                          )
                        ) {
                          removeProduct(product.id)
                        }
                      }}
                      className="p-2 text-[#e53935] hover:bg-[#e53935]/10 transition-colors"
                      title="Delete piece"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SALON APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <p className="text-xs text-[#a19a8d]">
              Manage VIP private styling and viewings requested by clients:
            </p>

            {allAdminAppointments.length === 0 ? (
              <div className="p-12 text-center bg-[#1f1d17] border border-[#332f27]">
                <p className="text-sm text-[#8c8273]">
                  No VIP salon bookings scheduled yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allAdminAppointments.map((apt, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#1f1d17] border border-[#332f27] flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-[#f7f5f0]">
                          {apt.clientName || "Valued Client"}
                        </span>
                        <span className="text-[#aa8b5f] text-xs">
                          {apt.city}
                        </span>
                      </div>
                      <p className="text-xs text-[#8c8273] m-0 mt-1">
                        Phone: {apt.phone} · Email: {apt.email}
                      </p>
                      <p className="text-xs text-[#aa8b5f] m-0 mt-0.5">
                        Date: {apt.date} · Time Slot: {apt.time} · Advisor:{" "}
                        {apt.advisor}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-[#2d2a24] text-[10px] font-semibold uppercase tracking-wider text-[#aa8b5f] border border-[#3a362f]">
                        {apt.status || "Confirmed"}
                      </span>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(apt.email, "Completed")
                        }
                        className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider border border-[#3a362f] text-[#8c8273] hover:text-[#4caf50]"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DATABASE & API SETTINGS */}
        {activeTab === "api" && (
          <div className="space-y-6">
            {/* Status Card */}
            <div
              className={`p-5 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                isSupabaseConfigured()
                  ? "bg-[#1b2b1b] border-[#4caf50]/40 text-[#a5d6a7]"
                  : "bg-[#2b1f17] border-[#ff9800]/40 text-[#ffcc80]"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      isSupabaseConfigured() ? "bg-[#4caf50]" : "bg-[#ff9800]"
                    }`}
                  ></span>
                  <strong className="text-sm font-semibold uppercase tracking-wider">
                    {isSupabaseConfigured()
                      ? "LIVE Supabase Database Active"
                      : "Offline Fallback Mode Active"}
                  </strong>
                </div>
                <p className="text-xs mt-1 m-0 opacity-80">
                  {isSupabaseConfigured()
                    ? `Connected to: ${getSupabaseUrl()}`
                    : "No live database credentials found. Operating safely with built-in luxury catalog & local storage."}
                </p>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 border border-current rounded-sm">
                {isSupabaseConfigured() ? "Live PostgreSQL" : "Local Fallback"}
              </span>
            </div>

            {/* Connection Credentials Form */}
            <div className="p-6 bg-[#1f1d17] border border-[#332f27] space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-[#aa8b5f] mb-1">
                Supabase API Connection Credentials
              </h4>
              <p className="text-xs text-[#8c8273]">
                Enter your Supabase Project URL and public anon key below. These
                can be found in your{" "}
                <strong className="text-[#f7f5f0]">
                  Supabase Dashboard ➔ Project Settings ➔ API
                </strong>
                .
              </p>

              <div className="space-y-4 pt-2">
                <div className="form-group">
                  <label className="text-xs text-[#8c8273] font-medium block mb-1">
                    Supabase Project URL (VITE_SUPABASE_URL) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project-id.supabase.co"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="w-full bg-[#171713] border border-[#3a362f] p-3 text-xs text-white focus:border-[#aa8b5f] outline-none"
                  />
                </div>

                <div className="form-group">
                  <label className="text-xs text-[#8c8273] font-medium block mb-1">
                    Supabase Public Anon Key (VITE_SUPABASE_ANON_KEY) *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#171713] border border-[#3a362f] p-3 text-xs text-white focus:border-[#aa8b5f] outline-none font-mono"
                  />
                </div>

                {/* Test Result Banner */}
                {testResult.tested && (
                  <div
                    className={`p-3 text-xs border ${
                      testResult.success
                        ? "bg-[#1b2b1b] border-[#4caf50]/40 text-[#81c784]"
                        : "bg-[#2b1717] border-[#e53935]/40 text-[#ef9a9a]"
                    }`}
                  >
                    <strong>
                      {testResult.success
                        ? "✓ Test Passed: "
                        : "✕ Test Failed: "}
                    </strong>
                    {testResult.message}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={handleTestApi}
                    className="px-5 py-2.5 bg-transparent border border-[#aa8b5f] text-[#aa8b5f] text-xs font-semibold uppercase tracking-wider hover:bg-[#aa8b5f]/10 cursor-pointer transition-colors"
                  >
                    {isTesting ? "Testing Ping..." : "🔍 Test Connection"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveApi}
                    className="px-6 py-2.5 bg-[#aa8b5f] text-[#171713] text-xs font-semibold uppercase tracking-wider hover:bg-[#c2a275] cursor-pointer transition-colors"
                  >
                    💾 Save Credentials & Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-6 bg-[#1f1d17] border border-[#332f27] space-y-3 text-xs text-[#a19a8d]">
              <h4 className="text-xs uppercase tracking-widest text-[#aa8b5f] font-semibold mb-2">
                Quick Setup Checklist
              </h4>
              <ol className="list-decimal pl-4 space-y-2 text-[#b0a89b]">
                <li>
                  Open your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#aa8b5f] underline"
                  >
                    Supabase Dashboard
                  </a>
                  .
                </li>
                <li>
                  Go to <strong className="text-[#f7f5f0]">SQL Editor</strong>{" "}
                  and run the schema file from{" "}
                  <code className="text-[#aa8b5f]">supabase/schema.sql</code>.
                </li>
                <li>
                  Go to{" "}
                  <strong className="text-[#f7f5f0]">
                    Project Settings ➔ API
                  </strong>
                  , copy the{" "}
                  <strong className="text-[#f7f5f0]">Project URL</strong> and{" "}
                  <strong className="text-[#f7f5f0]">anon public key</strong>,
                  and paste them above.
                </li>
                <li>
                  Click{" "}
                  <strong className="text-[#aa8b5f]">
                    "Save Credentials & Connect"
                  </strong>
                  .
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
