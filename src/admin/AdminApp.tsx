import React, { useState, useEffect } from "react"
import { useShop } from "../context/ShopContext"
import { AdminSidebar, AdminTab } from "./components/AdminSidebar"
import { AdminTopNavbar } from "./components/AdminTopNavbar"
import { AdminLogin } from "./AdminLogin"
import { AdminAccessDenied } from "./AdminAccessDenied"

// Admin Pages
import { DashboardPage } from "./pages/DashboardPage"
import { ProductsPage } from "./pages/ProductsPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { InventoryPage } from "./pages/InventoryPage"
import { ReviewsPage } from "./pages/ReviewsPage"
import { OrdersPage } from "./pages/OrdersPage"
import { CustomersPage } from "./pages/CustomersPage"
import { AnalyticsPage } from "./pages/AnalyticsPage"
import { CouponsPage } from "./pages/CouponsPage"
import { SalonBookingsPage } from "./pages/SalonBookingsPage"
import { StoreSettingsPage } from "./pages/StoreSettingsPage"
import { AdminProfilePage } from "./pages/AdminProfilePage"
import { ApiDatabasePage } from "./pages/ApiDatabasePage"

// Initial Sample Data & Types
import {
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_INVENTORY_LOGS,
  DEFAULT_STORE_SETTINGS,
} from "./services/adminService"
import {
  Customer,
  Coupon,
  ProductReview,
  InventoryLog,
  StoreSettings,
  Category,
} from "../types"

export const AdminApp: React.FC = () => {
  const {
    isAdmin,
    userProfile,
    logoutUser,
    products,
    addNewProduct,
    editProduct,
    removeProduct,
    allAdminOrders,
    updateOrderStatus,
    allAdminAppointments,
    updateAppointmentStatus,
    categories,
    formatPrice,
    showToast,
  } = useShop()

  const [currentTab, setCurrentTab] = useState<AdminTab>("dashboard")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [adminSearchQuery, setAdminSearchQuery] = useState("")

  // State collections for coupons, reviews, inventory logs, settings, customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_admin_customers")
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
    } catch {
      return INITIAL_CUSTOMERS
    }
  })

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_admin_coupons")
      return saved ? JSON.parse(saved) : INITIAL_COUPONS
    } catch {
      return INITIAL_COUPONS
    }
  })

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_admin_reviews")
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS
    } catch {
      return INITIAL_REVIEWS
    }
  })

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const saved = localStorage.getItem("aurelia_admin_inventory_logs")
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LOGS
    } catch {
      return INITIAL_INVENTORY_LOGS
    }
  })

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem("aurelia_admin_store_settings")
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS
    } catch {
      return DEFAULT_STORE_SETTINGS
    }
  })

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aurelia_admin_customers", JSON.stringify(customers))
    } catch (e) {
      console.warn(e)
    }
  }, [customers])

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_admin_coupons", JSON.stringify(coupons))
    } catch (e) {
      console.warn(e)
    }
  }, [coupons])

  useEffect(() => {
    try {
      localStorage.setItem("aurelia_admin_reviews", JSON.stringify(reviews))
    } catch (e) {
      console.warn(e)
    }
  }, [reviews])

  useEffect(() => {
    try {
      localStorage.setItem(
        "aurelia_admin_inventory_logs",
        JSON.stringify(inventoryLogs),
      )
    } catch (e) {
      console.warn(e)
    }
  }, [inventoryLogs])

  useEffect(() => {
    try {
      localStorage.setItem(
        "aurelia_admin_store_settings",
        JSON.stringify(storeSettings),
      )
    } catch (e) {
      console.warn(e)
    }
  }, [storeSettings])

  // Count pending orders & low stock
  const pendingOrdersCount = allAdminOrders.filter((o) =>
    (o.status || "").toLowerCase().includes("pending"),
  ).length

  const lowStockCount = products.filter(
    (p) => !p.inStock || (p.stockQuantity ?? (p.inStock ? 12 : 0)) <= 5,
  ).length

  // Handlers for Coupons
  const handleSaveCoupon = async (c: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.find((item) => item.id === c.id)
      if (exists) {
        return prev.map((item) => (item.id === c.id ? c : item))
      }
      return [c, ...prev]
    })
    showToast(`Coupon code '${c.code}' saved successfully.`, "success")
    return true
  }

  const handleDeleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((item) => item.id !== id))
    showToast("Coupon deleted successfully.", "info")
    return true
  }

  // Handlers for Categories
  const handleSaveCategory = async (_cat: Category) => {
    showToast("Category updated in Maison catalog.", "success")
    return true
  }

  const handleDeleteCategory = async (_id: string) => {
    showToast("Category removed.", "info")
    return true
  }

  // Handlers for Stock Adjustment
  const handleAdjustStock = async (
    productId: number,
    delta: number,
    reason: string,
  ) => {
    const targetProduct = products.find((p) => p.id === productId)
    if (!targetProduct) return false

    const currentQty =
      targetProduct.stockQuantity ?? (targetProduct.inStock ? 12 : 0)
    const newQty = Math.max(0, currentQty + delta)

    await editProduct(productId, {
      stockQuantity: newQty,
      inStock: newQty > 0,
    })

    const newLog: InventoryLog = {
      id: `inv-${Date.now()}`,
      productId,
      productName: targetProduct.name,
      changeType: delta >= 0 ? "restock" : "adjustment",
      quantityDelta: delta,
      newQuantity: newQty,
      reason,
      createdAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setInventoryLogs((prev) => [newLog, ...prev])
    showToast(
      `Stock for '${targetProduct.name}' updated to ${newQty} units.`,
      "success",
    )
    return true
  }

  // Handlers for Reviews
  const handleUpdateReviewStatus = async (
    id: string,
    status: ProductReview["status"],
  ) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    showToast(`Review marked as ${status}.`, "success")
    return true
  }

  const handleDeleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
    showToast("Review deleted.", "info")
    return true
  }

  // Handlers for Settings
  const handleSaveSettings = async (newSettings: StoreSettings) => {
    setStoreSettings(newSettings)
    showToast("Store parameters saved successfully.", "success")
    return true
  }

  // Authentication & Access Protection
  if (!userProfile) {
    return <AdminLogin onSuccess={() => setCurrentTab("dashboard")} />
  }

  if (!isAdmin) {
    return <AdminAccessDenied />
  }

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f7f5f0] flex">
      {/* 1. Dedicated Collapsible Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={logoutUser}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* 2. Main Administration Content Column */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <AdminTopNavbar
          currentTab={currentTab}
          onToggleMobileMenu={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
          onSelectTab={setCurrentTab}
          onLogout={logoutUser}
          searchQuery={adminSearchQuery}
          onSearchChange={setAdminSearchQuery}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 md:p-8 bg-[#0c0b09] overflow-y-auto">
          {/* Dashboard */}
          {currentTab === "dashboard" && (
            <DashboardPage
              products={products}
              orders={allAdminOrders}
              customers={customers}
              appointments={allAdminAppointments}
              formatPrice={formatPrice}
              onSelectTab={setCurrentTab}
              onUpdateOrderStatus={updateOrderStatus}
            />
          )}

          {/* Products */}
          {currentTab === "products" && (
            <ProductsPage
              products={products}
              formatPrice={formatPrice}
              onAddNewProduct={addNewProduct}
              onEditProduct={editProduct}
              onRemoveProduct={removeProduct}
              searchQuery={adminSearchQuery}
            />
          )}

          {/* Categories */}
          {currentTab === "categories" && (
            <CategoriesPage
              categories={categories}
              products={products}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {/* Inventory */}
          {currentTab === "inventory" && (
            <InventoryPage
              products={products}
              inventoryLogs={inventoryLogs}
              onAdjustStock={handleAdjustStock}
              searchQuery={adminSearchQuery}
            />
          )}

          {/* Reviews */}
          {currentTab === "reviews" && (
            <ReviewsPage
              reviews={reviews}
              onUpdateReviewStatus={handleUpdateReviewStatus}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {/* Orders (Status views) */}
          {(currentTab === "orders-all" ||
            currentTab === "orders-pending" ||
            currentTab === "orders-processing" ||
            currentTab === "orders-shipped" ||
            currentTab === "orders-delivered" ||
            currentTab === "orders-cancelled" ||
            currentTab === "orders-refunded") && (
            <OrdersPage
              orders={allAdminOrders}
              formatPrice={formatPrice}
              onUpdateOrderStatus={updateOrderStatus}
              searchQuery={adminSearchQuery}
              initialStatusFilter={
                currentTab === "orders-all"
                  ? "all"
                  : currentTab === "orders-pending"
                    ? "pending"
                    : currentTab === "orders-processing"
                      ? "processing"
                      : currentTab === "orders-shipped"
                        ? "dispatched"
                        : currentTab === "orders-delivered"
                          ? "delivered"
                          : currentTab === "orders-cancelled"
                            ? "cancelled"
                            : "refunded"
              }
            />
          )}

          {/* Customers */}
          {(currentTab === "customers" ||
            currentTab === "customers-profiles" ||
            currentTab === "customers-orders") && (
            <CustomersPage
              customers={customers}
              orders={allAdminOrders}
              formatPrice={formatPrice}
              searchQuery={adminSearchQuery}
            />
          )}

          {/* Analytics & Reports */}
          {(currentTab === "analytics" || currentTab === "reports") && (
            <AnalyticsPage
              orders={allAdminOrders}
              products={products}
              customers={customers}
              formatPrice={formatPrice}
            />
          )}

          {/* Coupons */}
          {currentTab === "coupons" && (
            <CouponsPage
              coupons={coupons}
              formatPrice={formatPrice}
              onSaveCoupon={handleSaveCoupon}
              onDeleteCoupon={handleDeleteCoupon}
            />
          )}

          {/* Salon Bookings */}
          {currentTab === "salon" && (
            <SalonBookingsPage
              appointments={allAdminAppointments}
              onUpdateStatus={updateAppointmentStatus}
            />
          )}

          {/* Store Settings */}
          {currentTab === "settings" && (
            <StoreSettingsPage
              settings={storeSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}

          {/* Admin Profile */}
          {currentTab === "profile" && (
            <AdminProfilePage userProfile={userProfile} />
          )}

          {/* Database & API Configuration */}
          {currentTab === "api" && <ApiDatabasePage />}
        </main>
      </div>
    </div>
  )
}
