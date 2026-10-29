import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    cartFinalTotal,
    discountPercent,
    discountAmount,
    applyPromoCode,
    formatPrice,
    setIsCheckoutOpen,
  } = useShop()

  const [inputCode, setInputCode] = useState("")

  if (!isCartOpen) return null

  const freeDeliveryThreshold = 500
  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeDeliveryThreshold) * 100),
  )

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputCode.trim()) {
      applyPromoCode(inputCode)
    }
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
      <aside className="drawer-panel" aria-label="Shopping bag">
        <div className="drawer-header">
          <h2>Your Bag ({cartCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="icon-button"
            aria-label="Close bag"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-meter">
          {cartSubtotal >= freeDeliveryThreshold ? (
            <p className="m-0 font-medium">
              ✨ You qualify for complimentary White Glove delivery & returns.
            </p>
          ) : (
            <p className="m-0 font-medium">
              Add {formatPrice(freeDeliveryThreshold - cartSubtotal)} more for
              complimentary White Glove delivery.
            </p>
          )}
          <div className="shipping-bar-bg">
            <div
              className="shipping-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart items */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-state">
              <span>
                <Icon name="bag" size={32} />
              </span>
              <h3>Your bag is empty</h3>
              <p>
                Discover the latest arrivals from our Parisian ateliers and add
                treasured pieces to your collection.
              </p>
              <button
                className="button button-dark w-full"
                onClick={() => setIsCartOpen(false)}
              >
                Explore the collection
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity, selectedSize }) => (
              <div className="cart-row" key={`${product.id}-${selectedSize}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-row-img"
                />
                <div className="cart-row-info">
                  <h4>{product.name}</h4>
                  <p>
                    {product.subtitle}
                    {selectedSize ? ` · ${selectedSize}` : ""}
                  </p>
                  <div className="cart-qty-ctrl">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Icon name="minus" size={12} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Icon name="plus" size={12} />
                    </button>
                  </div>
                </div>
                <div className="cart-row-price">
                  <strong>{formatPrice(product.price * quantity)}</strong>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="cart-remove-btn"
                    aria-label={`Remove ${product.name} from bag`}
                    title="Remove item"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (try MAISON10)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 border border-[var(--line)] px-3 py-2 text-xs bg-white uppercase tracking-wider"
              />
              <button
                type="submit"
                className="button button-dark !min-h-[38px] !px-4 !text-[8px] !gap-1"
              >
                Apply
              </button>
            </form>

            <div className="flex flex-col gap-2 pt-2 text-xs border-t border-[var(--line)]">
              <div className="flex justify-between text-[#7c7468]">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#8c6e49] font-medium">
                  <span>Privilege savings ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7c7468]">
                <span>Delivery</span>
                <span className="text-[var(--ink)] font-semibold">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-[var(--line)] text-[var(--ink)]">
                <span>Estimated Total</span>
                <span>{formatPrice(cartFinalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="button button-dark w-full !min-h-[50px] !gap-4 justify-between"
            >
              <span>Proceed to Atelier Checkout</span>
              <Icon name="lock" size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
