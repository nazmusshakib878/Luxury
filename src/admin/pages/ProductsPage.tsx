import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Product, ProductCategory } from "../../types"
import { ConfirmationModal } from "../components/ConfirmationModal"

interface ProductsPageProps {
  products: Product[]
  formatPrice: (price: number) => string
  onAddNewProduct: (data: Omit<Product, "id">) => Promise<boolean>
  onEditProduct: (id: number, updates: Partial<Product>) => Promise<boolean>
  onRemoveProduct: (id: number) => Promise<boolean>
  searchQuery: string
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  formatPrice,
  onAddNewProduct,
  onEditProduct,
  onRemoveProduct,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Confirmation dialog state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form State
  const [formName, setFormName] = useState("")
  const [formSubtitle, setFormSubtitle] = useState("")
  const [formCategoryType, setFormCategoryType] =
    useState<ProductCategory>("leather")
  const [formPrice, setFormPrice] = useState<number>(1200)
  const [formSalePrice, setFormSalePrice] = useState<number | undefined>(
    undefined,
  )
  const [formSku, setFormSku] = useState("")
  const [formStockQty, setFormStockQty] = useState<number>(15)
  const [formBadge, setFormBadge] = useState("Atelier Exclusive")
  const [formImage, setFormImage] = useState(
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
  )
  const [formDescription, setFormDescription] = useState("")
  const [formMaterials, setFormMaterials] = useState(
    "Full-grain French box calfskin, 24K gold-plated hardware",
  )
  const [formDimensions, setFormDimensions] = useState("32 × 24 × 14 cm")
  const [formInStock, setFormInStock] = useState(true)
  const [formIsPublished, setFormIsPublished] = useState(true)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || p.categoryType === selectedCategory

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in" && p.inStock) ||
      (stockFilter === "out" && !p.inStock)

    return matchesSearch && matchesCategory && matchesStock
  })

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setFormName("")
    setFormSubtitle("")
    setFormCategoryType("leather")
    setFormPrice(1200)
    setFormSalePrice(undefined)
    setFormSku(`AUR-${Math.floor(1000 + Math.random() * 9000)}`)
    setFormStockQty(15)
    setFormBadge("Atelier Exclusive")
    setFormImage(
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
    )
    setFormDescription(
      "Individually finished in our French atelier, designed exclusively for patrons in Bangladesh.",
    )
    setFormMaterials("Full-grain French box calfskin, 24K gold-plated hardware")
    setFormDimensions("32 × 24 × 14 cm")
    setFormInStock(true)
    setFormIsPublished(true)
    setShowModal(true)
  }

  const openEditModal = (p: Product) => {
    setEditingProduct(p)
    setFormName(p.name)
    setFormSubtitle(p.subtitle)
    setFormCategoryType(p.categoryType)
    setFormPrice(p.price)
    setFormSalePrice(p.salePrice)
    setFormSku(p.sku || `AUR-${p.id}`)
    setFormStockQty(p.stockQuantity ?? (p.inStock ? 12 : 0))
    setFormBadge(p.badge || "")
    setFormImage(p.image)
    setFormDescription(p.description)
    setFormMaterials(p.materials)
    setFormDimensions(p.dimensions || "")
    setFormInStock(p.inStock)
    setFormIsPublished(p.isPublished !== false)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const categoryLabels: Record<ProductCategory, string> = {
      all: "Curated Luxury",
      leather: "Leather Goods",
      fragrance: "Fine Fragrance",
      silk: "Artisanal Silk",
    }

    if (editingProduct) {
      await onEditProduct(editingProduct.id, {
        name: formName,
        subtitle: formSubtitle,
        category: categoryLabels[formCategoryType],
        categoryType: formCategoryType,
        price: formPrice,
        salePrice: formSalePrice,
        sku: formSku,
        stockQuantity: formStockQty,
        badge: formBadge || undefined,
        image: formImage,
        description: formDescription,
        materials: formMaterials,
        dimensions: formDimensions,
        inStock: formInStock && formStockQty > 0,
        isPublished: formIsPublished,
      })
    } else {
      await onAddNewProduct({
        name: formName,
        subtitle: formSubtitle,
        category: categoryLabels[formCategoryType],
        categoryType: formCategoryType,
        price: formPrice,
        salePrice: formSalePrice,
        sku: formSku,
        stockQuantity: formStockQty,
        lowStockThreshold: 5,
        rating: 5.0,
        reviewsCount: 1,
        badge: formBadge || undefined,
        image: formImage,
        additionalImages: [formImage],
        description: formDescription,
        details: [
          "Handcrafted in Parisian Atelier",
          "Certificate of Luxury Authenticity included",
          "Complimentary secure courier delivery across Bangladesh",
        ],
        dimensions: formDimensions,
        materials: formMaterials,
        inStock: formInStock && formStockQty > 0,
        isPublished: formIsPublished,
      })
    }

    setShowModal(false)
  }

  const handleDeleteConfirm = async () => {
    if (confirmDeleteId !== null) {
      setIsDeleting(true)
      await onRemoveProduct(confirmDeleteId)
      setIsDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#171713] p-6 border border-[#2d2a24]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-[#1f1d17] border border-[#3a362f] text-xs text-[#aa8b5f] px-3 py-2 rounded-xs outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="leather">Leather Goods</option>
            <option value="fragrance">Fine Fragrance</option>
            <option value="silk">Artisanal Silk</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-[#1f1d17] border border-[#3a362f] text-xs text-[#a19a8d] px-3 py-2 rounded-xs outline-none cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in">In Stock Only</option>
            <option value="out">Out of Stock Only</option>
          </select>

          <span className="text-xs text-[#70695c]">
            Showing {filteredProducts.length} piece(s)
          </span>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Icon name="plus" size={16} />
          <span>Add New Luxury Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Icon
              name="box"
              size={32}
              className="text-[#8c8273] mx-auto mb-2"
            />
            <h4 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
              No products found
            </h4>
            <p className="text-xs text-[#70695c] mt-1">
              Try adjusting your search criteria or add a new piece to the
              catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                  <th className="p-4">Piece</th>
                  <th className="p-4">SKU / Code</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (BDT)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24211b]">
                {paginatedProducts.map((product) => {
                  const qty =
                    product.stockQuantity ?? (product.inStock ? 12 : 0)
                  const isLow = product.inStock && qty <= 5

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#1a1813] transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="w-12 h-14 object-cover border border-[#2d2a24] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-sm">
                                {product.name}
                              </span>
                              {product.badge && (
                                <span className="text-[9px] bg-[#aa8b5f]/15 text-[#aa8b5f] border border-[#aa8b5f]/30 px-1.5 py-0.2 rounded-xs uppercase font-semibold">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8c8273] block truncate max-w-xs">
                              {product.subtitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 font-mono text-[#8c8273]">
                        {product.sku || `AUR-${product.id}`}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-[#a19a8d] capitalize">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <strong className="text-white font-semibold">
                          {formatPrice(product.price)}
                        </strong>
                        {product.salePrice && (
                          <span className="text-[10px] text-[#8c8273] line-through block">
                            {formatPrice(product.salePrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            !product.inStock
                              ? "text-[#e53935]"
                              : isLow
                                ? "text-[#ff9800]"
                                : "text-[#81c784]"
                          }`}
                        >
                          {qty} units
                        </span>
                        {isLow && (
                          <span className="block text-[9px] text-[#ff9800] uppercase font-bold tracking-wider">
                            Low Stock
                          </span>
                        )}
                      </td>

                      {/* In Stock & Published Status */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              onEditProduct(product.id, {
                                inStock: !product.inStock,
                              })
                            }
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs border text-center cursor-pointer ${
                              product.inStock
                                ? "bg-[#4caf50]/15 text-[#81c784] border-[#4caf50]/40"
                                : "bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/40"
                            }`}
                          >
                            {product.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 border border-[#3a362f] hover:border-[#aa8b5f] text-[#a19a8d] hover:text-[#aa8b5f] rounded-xs transition-colors cursor-pointer"
                            title="Edit piece details"
                          >
                            <Icon name="edit" size={14} />
                          </button>

                          <button
                            onClick={() => setConfirmDeleteId(product.id)}
                            className="p-1.5 border border-[#3a362f] hover:border-[#e53935] text-[#8c8273] hover:text-[#e53935] rounded-xs transition-colors cursor-pointer"
                            title="Delete piece"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#2d2a24] bg-[#12110e] flex justify-between items-center text-xs">
            <span className="text-[#8c8273]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-[#3a362f] disabled:opacity-30 text-[#a19a8d] hover:text-white rounded-xs cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 border border-[#3a362f] disabled:opacity-30 text-[#a19a8d] hover:text-white rounded-xs cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#171713] border border-[#aa8b5f]/40 max-w-2xl w-full p-6 text-[#f7f5f0] shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#8c8273] hover:text-white cursor-pointer"
            >
              <Icon name="x" size={20} />
            </button>

            <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-[#aa8b5f] m-0 mb-4">
              {editingProduct ? "Edit Luxury Piece" : "Add New Luxury Piece"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Monogram Silk Scarf"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted Box Calfskin"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategoryType}
                    onChange={(e) =>
                      setFormCategoryType(e.target.value as ProductCategory)
                    }
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  >
                    <option value="leather">
                      The Signature Bags (Leather)
                    </option>
                    <option value="fragrance">Fine Fragrance</option>
                    <option value="silk">Modern Icons (Silk)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AUR-8924"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white font-mono outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Base Price in USD ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                  <span className="text-[10px] text-[#aa8b5f] mt-1 block">
                    Converts to BDT: {formatPrice(formPrice)}
                  </span>
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStockQty}
                    onChange={(e) => setFormStockQty(Number(e.target.value))}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label className="text-[#8c8273] block mb-1">
                    High-Resolution Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                  {formImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-12 h-14 object-cover border border-[#3a362f]"
                      />
                      <span className="text-[10px] text-[#8c8273]">
                        Image preview loaded
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Luxury Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Limited Edition, Atelier Exclusive"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Materials & Finishes
                  </label>
                  <input
                    type="text"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label className="text-[#8c8273] block mb-1">
                    Product Story / Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#2d2a24]">
                <label className="flex items-center gap-2 cursor-pointer text-[#f7f5f0]">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="accent-[#aa8b5f]"
                  />
                  <span>Mark Available In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#f7f5f0]">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="accent-[#aa8b5f]"
                  />
                  <span>Publish to Customer Storefront</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2a24]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-[#3a362f] hover:border-[#aa8b5f] text-[#a19a8d] hover:text-white uppercase tracking-wider text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] uppercase tracking-wider text-xs font-semibold cursor-pointer transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={confirmDeleteId !== null}
        title="Delete Luxury Piece"
        message="Are you certain you wish to delete this piece from the catalog? This action will remove it from the storefront catalog while safely preserving all past order history."
        confirmText={isDeleting ? "Deleting..." : "Delete Piece"}
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
