import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "../../components/common/Icon"
import { IconName } from "../../types"

export type AdminTab = "dashboard" | "products" | "categories" | "inventory" | "reviews" | "orders-all" | "orders-pending" | "orders-processing" | "orders-shipped" | "orders-delivered" | "orders-cancelled" | "orders-refunded" | "customers" | "customers-profiles" | "customers-orders" | "analytics" | "reports" | "coupons" | "salon" | "settings" | "payments" | "profile" | "api"

interface AdminSidebarProps {
  currentTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  onLogout: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  pendingOrdersCount: number
  lowStockCount: number
}

interface NavItem {
  id: AdminTab
  label: string
  icon: IconName
  badge?: number | string
  badgeColor?: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  pendingOrdersCount,
  lowStockCount,
}) => {
  const navGroups: NavGroup[] = [
    {
      group: "OVERVIEW",
      items: [{ id: "dashboard", label: "Executive Dashboard", icon: "chart" }],
    },
    {
      group: "CATALOG",
      items: [
        { id: "products", label: "Product Catalog", icon: "box" },
        { id: "categories", label: "Categories", icon: "tag" },
        {
          id: "inventory",
          label: "Inventory & Stocks",
          icon: "box",
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeColor: "bg-[#e53935]/20 text-[#e57373] border-[#e53935]/40",
        },
        { id: "reviews", label: "Product Reviews", icon: "star" },
      ],
    },
    {
      group: "SALES & ORDERS",
      items: [
        { id: "orders-all", label: "All Orders", icon: "bag" },
        {
          id: "orders-pending",
          label: "Pending Orders",
          icon: "clock",
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: "bg-[#ff9800]/20 text-[#ffb74d] border-[#ff9800]/40",
        },
        {
          id: "orders-processing",
          label: "Processing (In Atelier)",
          icon: "sparkle",
        },
        { id: "orders-shipped", label: "Dispatched & Courier", icon: "arrow" },
        { id: "orders-delivered", label: "Delivered", icon: "check" },
        { id: "orders-cancelled", label: "Cancelled Orders", icon: "x" },
        { id: "orders-refunded", label: "Returns & Refunds", icon: "refresh" },
      ],
    },
    {
      group: "CUSTOMERS",
      items: [
        { id: "customers", label: "Customer Directory", icon: "users" },
        { id: "customers-profiles", label: "Customer Profiles", icon: "user" },
        {
          id: "customers-orders",
          label: "Verified Order History",
          icon: "bag",
        },
      ],
    },
    {
      group: "BUSINESS INTELLIGENCE",
      items: [
        { id: "analytics", label: "Sales Analytics", icon: "chart" },
        { id: "reports", label: "Revenue & CSV Reports", icon: "download" },
        { id: "coupons", label: "Coupons & Discounts", icon: "tag" },
        { id: "salon", label: "Salon Reservations", icon: "calendar" },
      ],
    },
    {
      group: "SYSTEM CONFIGURATION",
      items: [
        { id: "settings", label: "Store Settings", icon: "settings" },
        {
          id: "payments",
          label: "Payment Gateways (bKash/Cards)",
          icon: "dollar",
        },
        { id: "profile", label: "Administrator Profile", icon: "shield" },
        { id: "api", label: "Database & API Config", icon: "sparkle" },
      ],
    },
  ]

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id)
    onCloseMobile()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[49] lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#12110e] border-r border-[#2d2a24] z-[50] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2d2a24] bg-[#0c0b09] flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#aa8b5f] text-xs font-bold tracking-widest uppercase">
                AURÉLIA
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-[#aa8b5f]/20 text-[#d4af37] border border-[#aa8b5f]/40 font-semibold tracking-wider">
                ATELIER
              </span>
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0 tracking-wide">
              Management Portal
            </h2>
            <p className="text-[10px] text-[#70695c] m-0 mt-0.5">
              Luxury E-Commerce Operations
            </p>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-[#8c8273] hover:text-white p-1"
            aria-label="Close menu"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar text-xs">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#665e52] px-3 mb-2">
                {group.group}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = currentTab === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xs transition-all cursor-pointer text-left ${
                          isActive
                            ? "bg-[#aa8b5f] text-[#171713] font-semibold shadow-xs"
                            : "text-[#a19a8d] hover:bg-[#1a1813] hover:text-[#f7f5f0]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              isActive ? "text-[#171713]" : "text-[#aa8b5f]"
                            }
                          >
                            <Icon name={item.icon} size={16} />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                              item.badgeColor ||
                              "bg-[#aa8b5f]/20 text-[#aa8b5f] border-[#aa8b5f]/40"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Admin User Footer Card */}
        <div className="p-4 border-t border-[#2d2a24] bg-[#0c0b09] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#aa8b5f]/20 border border-[#aa8b5f] flex items-center justify-center text-[#aa8b5f] shrink-0 font-['Cormorant_Garamond',serif] font-bold text-base">
              NS
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-[#f7f5f0] m-0 truncate">
                Nazmus Shakib
              </h4>
              <p className="text-[10px] text-[#aa8b5f] m-0 truncate">
                Master Administrator
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#22201b]">
            <Link
              to="/"
              className="text-[11px] text-[#a19a8d] hover:text-[#aa8b5f] flex items-center gap-1 transition-colors"
            >
              <Icon name="external-link" size={12} /> View Store
            </Link>

            <button
              onClick={onLogout}
              className="text-[11px] text-[#e57373] hover:text-[#ef5350] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Icon name="lock" size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
