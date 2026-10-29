import React from "react"
import { Icon } from "../common/Icon"
import { categories } from "../../data/categories"
import { useShop } from "../../context/ShopContext"

export const CategoriesSection: React.FC = () => {
  const { setActiveCategory } = useShop()

  const handleCategorySelect = (categoryType: any) => {
    setActiveCategory(categoryType)
  }

  return (
    <section className="section categories" id="collections">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow">Curated for you</p>
          <h2>
            Enter the world
            <br />
            of Aurélia
          </h2>
        </div>
        <p className="section-intro">
          Considered objects, tactile materials, and timeless silhouettes. Each
          collection is an expression of French modern luxury and unhurried
          craftsmanship.
        </p>
      </div>
      <div className="category-grid">
        {categories.map((category, index) => (
          <a
            className="category-card"
            href="#shop"
            key={category.id}
            onClick={() => handleCategorySelect(category.categoryType)}
            aria-label={`Explore ${category.name}`}
          >
            <img src={category.image} alt={category.name} loading="lazy" />
            <div className="category-overlay">
              <span>0{index + 1}</span>
              <div>
                <p>{category.note}</p>
                <h3>{category.name}</h3>
              </div>
              <span className="round-arrow">
                <Icon name="arrow" size={18} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
