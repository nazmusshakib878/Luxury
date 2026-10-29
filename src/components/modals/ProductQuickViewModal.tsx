import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
  } = useShop()

  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!quickViewProduct) return null

  const allImages = [
    quickViewProduct.image,
    ...(quickViewProduct.additionalImages || []),
  ]

  const isLiked = wishlist.includes(quickViewProduct.id)

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity)
    setQuickViewProduct(null)
  }

  return (
    <div
      className="modal-overlay"
      onClick={() => setQuickViewProduct(null)}
      aria-label="Product preview modal"
    >
      <div
        className="luxury-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close-corner"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close product view"
        >
          <Icon name="x" size={18} />
        </button>

        <div className="quickview-grid">
          {/* Gallery side */}
          <div className="quickview-gallery">
            <div className="quickview-gallery-main">
              <img
                src={allImages[activeImageIndex]}
                alt={quickViewProduct.name}
              />
              {quickViewProduct.badge && (
                <span className="product-badge">{quickViewProduct.badge}</span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="quickview-thumbs">
                {allImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className={`quickview-thumb ${
                      activeImageIndex === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="quickview-content">
            <p className="eyebrow">
              <span></span> {quickViewProduct.category}
            </p>
            <h2>{quickViewProduct.name}</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="quickview-price !mb-0">
                {formatPrice(quickViewProduct.price)}
              </div>
              <span className="rating">
                <Icon name="star" size={14} filled /> {quickViewProduct.rating}{" "}
                <i>({quickViewProduct.reviewsCount} reviews)</i>
              </span>
            </div>

            <p className="quickview-desc">{quickViewProduct.description}</p>

            <div className="quickview-specs">
              <div>
                <strong>Materials:</strong> {quickViewProduct.materials}
              </div>
              {quickViewProduct.dimensions && (
                <div>
                  <strong>Dimensions:</strong> {quickViewProduct.dimensions}
                </div>
              )}
              <div className="mt-2 text-xs text-[#716a5f]">
                <ul className="list-disc pl-4 space-y-1">
                  {quickViewProduct.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="quickview-actions">
              <div className="cart-qty-ctrl !h-[48px]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="!w-9 !h-full"
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" size={13} />
                </button>
                <span className="!w-10 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="!w-9 !h-full"
                  aria-label="Increase quantity"
                >
                  <Icon name="plus" size={13} />
                </button>
              </div>

              <button
                className="button button-dark flex-1"
                onClick={handleAddToCart}
              >
                <span>Add to Bag</span>
                <Icon name="bag" size={16} />
              </button>

              <button
                className={`wishlist !static !w-[48px] !h-[48px] ${
                  isLiked ? "liked" : ""
                }`}
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-label={
                  isLiked ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Icon name="heart" size={20} filled={isLiked} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
