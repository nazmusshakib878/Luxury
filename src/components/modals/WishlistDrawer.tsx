import React from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
export const WishlistDrawer: React.FC = () => {
  const {
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickViewProduct,
  } = useShop()

  if (!isWishlistOpen) return null

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id))

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1)
    toggleWishlist(product.id)
  }

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />
      <aside className="drawer-panel" aria-label="Saved pieces">
        <div className="drawer-header">
          <h2>Saved Pieces ({wishlistedProducts.length})</h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="icon-button"
            aria-label="Close wishlist"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {wishlistedProducts.length === 0 ? (
            <div className="empty-state">
              <span>
                <Icon name="heart" size={32} />
              </span>
              <h3>Your wishlist is empty</h3>
              <p>
                Save your favorite objects of desire to review later or order
                upon request.
              </p>
              <button
                className="button button-dark w-full"
                onClick={() => setIsWishlistOpen(false)}
              >
                Discover the collection
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div className="cart-row" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-row-img cursor-pointer"
                  onClick={() => {
                    setIsWishlistOpen(false)
                    setQuickViewProduct(product)
                  }}
                />
                <div className="cart-row-info">
                  <h4
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      setIsWishlistOpen(false)
                      setQuickViewProduct(product)
                    }}
                  >
                    {product.name}
                  </h4>
                  <p>{product.subtitle}</p>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
                <div className="cart-row-price">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="button button-dark !min-h-[34px] !px-3 !text-[8px] !gap-1"
                    title="Move to bag"
                  >
                    <span>Add to Bag</span>
                    <Icon name="bag" size={13} />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="cart-remove-btn"
                    title="Remove from saved pieces"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="drawer-footer">
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => addToCart(p, 1))
                setIsWishlistOpen(false)
              }}
              className="button button-dark w-full"
            >
              Add all pieces to bag
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
