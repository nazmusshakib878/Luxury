import React, { useState, useEffect, useRef } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
import { products } from "../../data/products"

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, formatPrice } =
    useShop()

  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
    }
  }, [isSearchOpen])

  if (!isSearchOpen) return null

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      )
    : products.slice(0, 4) // curated suggestions when empty

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsSearchOpen(false)}
      aria-label="Search overlay"
    >
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="flex justify-between items-center mb-6">
          <p className="eyebrow !mb-0">
            <span></span> Aurélia Atelier Search
          </p>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="icon-button"
            aria-label="Close search"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="search-input-wrap">
          <Icon name="search" size={24} className="text-[#8c8579]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by piece, fragrance, or material..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="icon-button"
              aria-label="Clear query"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="flex gap-2 mt-4 text-[9px] uppercase tracking-[.12em]">
          <span className="text-[#8a8376] py-1">Popular:</span>
          {["Tote", "Eau de Parfum", "Silk Scarf", "Calfskin"].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="border border-[var(--line)] bg-white px-3 py-1 cursor-pointer hover:bg-[var(--ink)] hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="search-results-list">
          <p className="text-[9px] uppercase tracking-[.15em] text-[#8c8579] my-2">
            {query.trim()
              ? `Found ${filtered.length} matches`
              : "Recommended for you"}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#7e766b]">
              No items found matching "{query}". Try searching for "leather",
              "parfum", or "scarf".
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => {
                  setIsSearchOpen(false)
                  setQuickViewProduct(product)
                }}
              >
                <img src={product.image} alt={product.name} />
                <div className="flex-1">
                  <h4 className="m-0 font-['Cormorant_Garamond',serif] text-lg font-medium">
                    {product.name}
                  </h4>
                  <p className="m-0 text-[10px] text-[#787165] uppercase tracking-wider">
                    {product.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <strong className="text-sm font-semibold">
                    {formatPrice(product.price)}
                  </strong>
                  <span className="block text-[10px] text-[#8c6e49]">
                    ★ {product.rating}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
