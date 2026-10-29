import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../../components/common/Icon"
import { AdminTab } from "./AdminSidebar"
import { isSupabaseConfigured } from "../../lib/supabase"

interface AdminTopNavbarProps {
  currentTab: AdminTab
  onToggleMobileMenu: () => void
  onSelectTab: (tab: AdminTab) => void
  onLogout: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  pendingOrdersCount: number
  lowStockCount: number
}

const TAB_TITLES: Record<AdminTab, { section: string; title: string }> = {
  dashboard: { section: "Overview", title: "Executive Operations Dashboard" },
  products: { section: "Catalog", title: "Product Catalog Management" },
  categories: { section: "Catalog", title: "Categories & Collections" },
  inventory: {
    section: "Catalog",
    title: "Inventory Levels & Stock Movements",
  },
  reviews: { section: "Catalog", title: "Product Reviews Moderation" },
  "orders-all": { section: "Sales", title: "All Customer Orders" },
  "orders-pending": {
    section: "Sales",
    title: "Pending Orders (Awaiting Confirmation)",
  },
  "orders-processing": {
    section: "Sales",
    title: "Orders in Atelier Preparation",
  },
  "orders-shipped": { section: "Sales", title: "Dispatched Courier Shipments" },
  "orders-delivered": { section: "Sales", title: "Delivered Orders" },
  "orders-cancelled": { section: "Sales", title: "Cancelled Orders" },
  "orders-refunded": { section: "Sales", title: "Returns & Refund Requests" },
  customers: { section: "Customers", title: "Customer Directory" },
  "customers-profiles": {
    section: "Customers",
    title: "Customer VIP Profiles",
  },
  "customers-orders": {
    section: "Customers",
    title: "Verified Customer Purchase History",
  },
  analytics: {
    section: "Business",
    title: "Executive Sales & Revenue Analytics",
  },
  reports: { section: "Business", title: "Financial Reports & CSV Exports" },
  coupons: { section: "Business", title: "Coupons & Promotional Discounts" },
  salon: { section: "Business", title: "Private Salon Reservations" },
  settings: { section: "System", title: "Store & Delivery Configuration" },
  payments: {
    section: "System",
    title: "Payment Gateways & Financial Settlement (bKash/Cards)",
  },
  profile: { section: "System", title: "Administrator Profile & Security" },
  api: { section: "System", title: "Database & Supabase API Configuration" },
}

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({
  currentTab,
  onToggleMobileMenu,
  onSelectTab,
  onLogout,
  searchQuery,
  onSearchChange,
  pendingOrdersCount,
  lowStockCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const meta = TAB_TITLES[currentTab] || {
    section: "Admin",
    title: "Dashboard",
  }
  const totalNotifications = pendingOrdersCount + lowStockCount

  return (
    <header className="sticky top-0 z-40 bg-[#12110e]/95 backdrop-blur-md border-b border-[#2d2a24] px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-[#a19a8d] hover:text-white border border-[#2d2a24] rounded-xs"
          aria-label="Toggle navigation"
        >
          <Icon name="menu" size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            <span>Maison Aurélia</span>
            <span>/</span>
            <span>{meta.section}</span>
          </div>
          <h1 className="font-['Cormorant_Garamond',serif] text-xl md:text-2xl text-[#f7f5f0] m-0 font-medium">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="hidden md:flex items-center bg-[#1c1a15] border border-[#332f27] px-3 py-1.5 rounded-xs w-64 focus-within:border-[#aa8b5f] transition-colors">
          <Icon
            name="search"
            size={14}
            className="text-[#8c8273] shrink-0 mr-2"
          />
          <input
            type="text"
            placeholder="Search catalog, orders, patrons..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-[#70695c] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-[#8c8273] hover:text-white"
            >
              <Icon name="x" size={12} />
            </button>
          )}
        </div>

        {/* Live Database Status Pill */}
        <button
          onClick={() => onSelectTab("api")}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-xs border cursor-pointer transition-colors"
          style={{
            borderColor: isSupabaseConfigured()
              ? "rgba(76, 175, 80, 0.4)"
              : "rgba(255, 152, 0, 0.4)",
            backgroundColor: isSupabaseConfigured()
              ? "rgba(76, 175, 80, 0.1)"
              : "rgba(255, 152, 0, 0.1)",
            color: isSupabaseConfigured() ? "#81c784" : "#ffb74d",
          }}
          title="Click to view database connection status"
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: isSupabaseConfigured() ? "#4caf50" : "#ff9800",
            }}
          />
          <span>
            {isSupabaseConfigured() ? "PostgreSQL Live" : "Offline Fallback"}
          </span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#a19a8d] hover:text-white border border-[#2d2a24] hover:border-[#aa8b5f] rounded-xs relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Icon name="bell" size={16} />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e53935] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#171713] border border-[#3a362f] shadow-2xl p-4 text-xs z-50 text-[#f7f5f0] animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-[#2d2a24] mb-3">
                <span className="font-semibold uppercase tracking-widest text-[#aa8b5f] text-[10px]">
                  Operations Alerts
                </span>
                <span className="text-[#8c8273] text-[10px]">
                  {totalNotifications} active
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pendingOrdersCount > 0 && (
                  <div
                    onClick={() => {
                      onSelectTab("orders-pending")
                      setShowNotifications(false)
                    }}
                    className="p-2.5 bg-[#1f1d17] border border-[#ff9800]/30 rounded-xs hover:border-[#ff9800] cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-[#ffb74d] m-0">
                      ⚡ {pendingOrdersCount} New Pending Orders
                    </p>
                    <span className="text-[10px] text-[#8c8273] block mt-0.5">
                      Review customer shipping and dispatch items
                    </span>
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div
                    onClick={() => {
                      onSelectTab("inventory")
                      setShowNotifications(false)
                    }}
                    className="p-2.5 bg-[#1f1d17] border border-[#e53935]/30 rounded-xs hover:border-[#e53935] cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-[#e57373] m-0">
                      ⚠️ {lowStockCount} Products Low on Stock
                    </p>
                    <span className="text-[10px] text-[#8c8273] block mt-0.5">
                      Restock pieces from French workshop
                    </span>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <p className="text-center text-[#8c8273] py-4 m-0">
                    All orders fulfilled and inventory levels optimal.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#aa8b5f] border border-[#aa8b5f]/50 hover:bg-[#aa8b5f] hover:text-[#171713] transition-all rounded-xs"
          title="Return to customer boutique view"
        >
          <Icon name="external-link" size={13} />
          <span>View Store</span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 border border-[#2d2a24] hover:border-[#aa8b5f] rounded-xs cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#aa8b5f]/20 text-[#aa8b5f] font-bold text-xs flex items-center justify-center font-['Cormorant_Garamond',serif]">
              NS
            </div>
            <Icon name="chevron" size={14} className="text-[#8c8273]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#171713] border border-[#3a362f] shadow-2xl p-2 text-xs z-50 text-[#f7f5f0] animate-fadeIn">
              <div className="p-2 border-b border-[#2d2a24] mb-1">
                <p className="font-semibold m-0 text-white">Nazmus Shakib</p>
                <p className="text-[10px] text-[#aa8b5f] m-0">
                  Master Administrator
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectTab("profile")
                  setShowUserMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-[#a19a8d] hover:text-white hover:bg-[#22201b] rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Icon name="user" size={14} /> Admin Profile
              </button>

              <button
                onClick={() => {
                  onSelectTab("settings")
                  setShowUserMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-[#a19a8d] hover:text-white hover:bg-[#22201b] rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Icon name="settings" size={14} /> Store Settings
              </button>

              <div className="pt-1 border-t border-[#2d2a24] mt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    onLogout()
                  }}
                  className="w-full text-left px-3 py-2 text-[#e57373] hover:bg-[#e53935]/10 rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="lock" size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
