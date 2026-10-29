import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Category, Product } from "../../types"
import { ConfirmationModal } from "../components/ConfirmationModal"

interface CategoriesPageProps {
  categories: Category[]
  products: Product[]
  onSaveCategory: (cat: Category) => Promise<boolean>
  onDeleteCategory: (id: string) => Promise<boolean>
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  products,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form
  const [formId, setFormId] = useState("")
  const [formName, setFormName] = useState("")
  const [formNote, setFormNote] = useState("")
  const [formImage, setFormImage] = useState("")

  const openAddModal = () => {
    setEditingCategory(null)
    setFormId(`cat-${Date.now().toString(36)}`)
    setFormName("")
    setFormNote("")
    setFormImage(
      "https://images.unsplash.com/photo-1590739225287-bd31519780c3?auto=format&fit=crop&w=1000&q=85",
    )
    setShowModal(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setFormId(cat.id)
    setFormName(cat.name)
    setFormNote(cat.note)
    setFormImage(cat.image)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSaveCategory({
      id: formId,
      name: formName,
      note: formNote,
      image: formImage,
      categoryType: (formId.includes("leather")
        ? "leather"
        : formId.includes("fragrance")
          ? "fragrance"
          : formId.includes("silk")
            ? "silk"
            : "all") as any,
    })
    setShowModal(false)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await onDeleteCategory(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Maison Categories & Collections
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Organize products into curated luxury thematic collections.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Icon name="plus" size={16} /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter(
            (p) =>
              p.categoryType === cat.categoryType ||
              p.category.toLowerCase().includes(cat.name.toLowerCase()),
          ).length

          return (
            <div
              key={cat.id}
              className="bg-[#171713] border border-[#2d2a24] overflow-hidden group hover:border-[#aa8b5f]/50 transition-colors shadow-xs"
            >
              <div className="h-44 relative overflow-hidden">
                <img
                  src={cat.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f] block">
                    {cat.id}
                  </span>
                  <h4 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0 font-medium">
                    {cat.name}
                  </h4>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <p className="text-[#8c8273] m-0">
                  {cat.note || "Curated collection"}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-[#2d2a24] text-[11px]">
                  <span className="text-[#aa8b5f] font-semibold">
                    {productCount} catalog piece(s)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-[#a19a8d] hover:text-[#aa8b5f] p-1 cursor-pointer"
                      title="Edit Category"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="text-[#8c8273] hover:text-[#e53935] p-1 cursor-pointer"
                      title="Delete Category"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#171713] border border-[#aa8b5f]/40 max-w-md w-full p-6 text-[#f7f5f0] shadow-2xl relative animate-fadeIn rounded-xs space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#8c8273] hover:text-white cursor-pointer"
            >
              <Icon name="x" size={18} />
            </button>

            <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-[#aa8b5f] m-0">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fine Jewelry"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted gold and diamond heirlooms"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Editorial Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2d2a24]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#3a362f] text-[#8c8273] hover:text-white uppercase font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] uppercase font-semibold text-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Category"
        message="Are you certain you wish to delete this collection category? Existing products assigned to this category will remain safe in your catalog."
        confirmText="Confirm Delete"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
