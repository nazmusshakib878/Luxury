import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const Brand: React.FC = () => (
  <a className="brand" href="#top" aria-label="Aurélia home">
    AURÉLIA
    <span>MAISON PARIS</span>
  </a>
)

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setIsAppointmentOpen,
    isAdmin,
  } = useShop()

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="navbar">
        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu icon-button"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
        </button>

        {/* Desktop & Mobile Navigation Links */}
        <nav
          className={mobileMenuOpen ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          <a href="#new" onClick={closeMobile}>
            New arrivals
          </a>
          <a href="#shop" onClick={closeMobile}>
            Shop
          </a>
          <a href="#collections" onClick={closeMobile}>
            Collections
          </a>
          <a href="#story" onClick={closeMobile}>
            Our world
          </a>

          {/* Mobile-Only Quick Luxury Actions inside Drawer */}
          <div className="mobile-drawer-extras pt-4 border-t border-[var(--line)] w-full flex flex-col gap-3 md:hidden">
            <button
              onClick={() => {
                closeMobile()
                setIsSearchOpen(true)
              }}
              className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-left border-0 bg-transparent text-[var(--ink)] cursor-pointer"
            >
              <Icon name="search" size={16} /> Search Catalog
            </button>

            <button
              onClick={() => {
                closeMobile()
                setIsWishlistOpen(true)
              }}
              className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-left border-0 bg-transparent text-[var(--ink)] cursor-pointer"
            >
              <Icon name="heart" size={16} filled={wishlist.length > 0} />
              Wishlist ({wishlist.length})
            </button>

            <button
              onClick={() => {
                closeMobile()
                setIsAppointmentOpen(true)
              }}
              className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-left border-0 bg-transparent text-[#aa8b5f] cursor-pointer"
            >
              <Icon name="calendar" size={16} /> Private Salon Appointment
            </button>

            {isAdmin && (
              <a
                href="/atelier-admin"
                onClick={closeMobile}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#aa8b5f] bg-[#aa8b5f]/15 p-2 rounded-xs border border-[#aa8b5f]/40"
              >
                <span>👑</span> Open Admin Suite
              </a>
            )}
          </div>
        </nav>

        {/* Central Brand */}
        <Brand />

        {/* Action Buttons Right */}
        <div className="nav-actions">
          {/* Search */}
          <button
            className="icon-button nav-label"
            aria-label="Search collection"
            onClick={() => setIsSearchOpen(true)}
          >
            <Icon name="search" size={18} />
            <span className="hidden lg:inline">Search</span>
          </button>

          {/* Wishlist */}
          <button
            className="icon-button relative"
            aria-label={`Wishlist with ${wishlist.length} saved pieces`}
            onClick={() => setIsWishlistOpen(true)}
          >
            <Icon name="heart" size={19} filled={wishlist.length > 0} />
            {wishlist.length > 0 && (
              <span className="cart-count !bg-[var(--gold)]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Admin Portal Shortcut (Header Pill) */}
          {isAdmin && (
            <a
              href="/atelier-admin"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-[#aa8b5f]/15 border border-[#aa8b5f] text-[#aa8b5f] hover:bg-[#aa8b5f] hover:text-[#171713] transition-all rounded-xs cursor-pointer shrink-0"
              title="Open Atelier Administrator Dashboard"
            >
              <span>👑</span>
              <span className="hidden sm:inline">Admin</span>
              <span className="hidden md:inline">Portal</span>
            </a>
          )}

          {/* User Account */}
          <button
            className="icon-button"
            aria-label="My Account"
            onClick={() => setIsAccountOpen(true)}
          >
            <Icon name="user" size={19} />
          </button>

          {/* Cart */}
          <button
            className="icon-button cart-button"
            aria-label={`Cart with ${cartCount} items`}
            onClick={() => setIsCartOpen(true)}
          >
            <Icon name="bag" size={19} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
          onClick={closeMobile}
        />
      )}
    </>
  )
}
