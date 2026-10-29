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
  } = useShop()

  return (
    <header className="navbar">
      <button
        className="mobile-menu icon-button"
        aria-label="Toggle menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Icon name={mobileMenuOpen ? "x" : "menu"} />
      </button>

      <nav
        className={mobileMenuOpen ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        <a href="#new" onClick={() => setMobileMenuOpen(false)}>
          New arrivals
        </a>
        <a href="#shop" onClick={() => setMobileMenuOpen(false)}>
          Shop
        </a>
        <a href="#collections" onClick={() => setMobileMenuOpen(false)}>
          Collections
        </a>
        <a href="#story" onClick={() => setMobileMenuOpen(false)}>
          Our world
        </a>
      </nav>

      <Brand />

      <div className="nav-actions">
        {/* Search */}
        <button
          className="icon-button nav-label"
          aria-label="Search collection"
          onClick={() => setIsSearchOpen(true)}
        >
          <Icon name="search" />
          <span>Search</span>
        </button>

        {/* Wishlist */}
        <button
          className="icon-button relative"
          aria-label={`Wishlist with ${wishlist.length} saved pieces`}
          onClick={() => setIsWishlistOpen(true)}
        >
          <Icon name="heart" size={19} filled={wishlist.length > 0} />
          {wishlist.length > 0 && (
            <span
              className="cart-count"
              style={{
                position: "absolute",
                top: "1px",
                right: "0",
                minWidth: "16px",
                height: "16px",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                background: "var(--gold)",
                color: "white",
                fontSize: "8px",
              }}
            >
              {wishlist.length}
            </span>
          )}
        </button>

        {/* User Account */}
        <button
          className="icon-button"
          aria-label="My Account"
          onClick={() => setIsAccountOpen(true)}
        >
          <Icon name="user" />
        </button>

        {/* Cart */}
        <button
          className="icon-button cart-button"
          aria-label={`Cart with ${cartCount} items`}
          onClick={() => setIsCartOpen(true)}
        >
          <Icon name="bag" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
