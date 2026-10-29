import React from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
import { ProductCategory } from "../../types"

export const ProductGrid: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickViewProduct,
  } = useShop()

  const tabs: { label: string; value: ProductCategory }[] = [
    { label: "All pieces", value: "all" },
    { label: "Leather goods", value: "leather" },
    { label: "Fragrance", value: "fragrance" },
    { label: "Silk & accessories", value: "silk" },
  ]

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.categoryType === activeCategory)

  return (
    <section className="section products-section" id="shop">
      <div className="section-heading product-heading">
        <div>
          <p className="eyebrow">The icons</p>
          <h2>Most desired</h2>
        </div>
        <div
          className="product-tabs"
          role="tablist"
          aria-label="Product categories"
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeCategory === tab.value}
              className={activeCategory === tab.value ? "active" : ""}
              onClick={() => setActiveCategory(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveCategory("all")}
          className="text-link border-0 bg-transparent cursor-pointer"
        >
          View all ({products.length}) <Icon name="arrow" size={15} />
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const liked = wishlist.includes(product.id)
          return (
            <article className="product-card" key={product.id}>
              <div className="product-image group">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onClick={() => setQuickViewProduct(product)}
                  className="cursor-pointer"
                />
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}

                {/* Quick View Button on top-left next to badge */}
                <button
                  className="wishlist"
                  style={{ right: "56px" }}
                  aria-label={`Quick view ${product.name}`}
                  onClick={() => setQuickViewProduct(product)}
                  title="Quick View"
                >
                  <Icon name="eye" size={16} />
                </button>

                {/* Wishlist toggle */}
                <button
                  className={liked ? "wishlist liked" : "wishlist"}
                  aria-label={
                    liked
                      ? `Remove ${product.name} from wishlist`
                      : `Add ${product.name} to wishlist`
                  }
                  onClick={() => toggleWishlist(product.id)}
                  title={liked ? "In Wishlist" : "Save to Wishlist"}
                >
                  <Icon name="heart" size={18} filled={liked} />
                </button>

                {/* Quick Add */}
                <button
                  className="quick-add"
                  onClick={() => addToCart(product, 1)}
                  aria-label={`Add ${product.name} to bag`}
                >
                  <span>Add to bag</span>
                  <Icon name="bag" size={17} />
                </button>
              </div>

              <div className="product-info">
                <p>{product.subtitle}</p>
                <div>
                  <h3
                    onClick={() => setQuickViewProduct(product)}
                    className="cursor-pointer hover:underline"
                  >
                    {product.name}
                  </h3>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
                <span className="rating">
                  <Icon name="star" size={13} filled /> {product.rating}{" "}
                  <i>({product.reviewsCount})</i>
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
