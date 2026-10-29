import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Coupon } from "../../types"
import { ConfirmationModal } from "../components/ConfirmationModal"

interface CouponsPageProps {
  coupons: Coupon[]
  formatPrice: (p: number) => string
  onSaveCoupon: (coupon: Coupon) => Promise<boolean>
  onDeleteCoupon: (id: string) => Promise<boolean>
}

export const CouponsPage: React.FC<CouponsPageProps> = ({
  coupons,
  formatPrice,
  onSaveCoupon,
  onDeleteCoupon,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form State
  const [formCode, setFormCode] = useState("")
  const [formType, setFormType] = useState<"percentage" | "fixed">("percentage")
  const [formValue, setFormValue] = useState<number>(10)
  const [formMinOrder, setFormMinOrder] = useState<number>(5000)
  const [formUsageLimit, setFormUsageLimit] = useState<number>(100)
  const [formExpiresAt, setFormExpiresAt] = useState<string>("2026-12-31")
  const [formIsActive, setFormIsActive] = useState<boolean>(true)

  const openAddModal = () => {
    setEditingCoupon(null)
    setFormCode("VIP" + Math.floor(10 + Math.random() * 90))
    setFormType("percentage")
    setFormValue(15)
    setFormMinOrder(5000)
    setFormUsageLimit(50)
    setFormExpiresAt("2026-12-31")
    setFormIsActive(true)
    setShowModal(true)
  }

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c)
    setFormCode(c.code)
    setFormType(c.discountType)
    setFormValue(c.discountValue)
    setFormMinOrder(c.minOrderAmount)
    setFormUsageLimit(c.usageLimit || 100)
    setFormExpiresAt(c.expiresAt || "2026-12-31")
    setFormIsActive(c.isActive)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSaveCoupon({
      id: editingCoupon ? editingCoupon.id : `coup-${Date.now()}`,
      code: formCode.toUpperCase().trim(),
      discountType: formType,
      discountValue: formValue,
      minOrderAmount: formMinOrder,
      usageLimit: formUsageLimit,
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
      isActive: formIsActive,
      expiresAt: formExpiresAt,
      createdAt: editingCoupon
        ? editingCoupon.createdAt
        : new Date().toISOString().split("T")[0],
    })
    setShowModal(false)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await onDeleteCoupon(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Promotional Coupons & Privileged Discounts
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Configure luxury promo codes applied at checkout.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Icon name="plus" size={16} /> Create Promo Code
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Order Amount</th>
                <th className="p-4">Usage Stats</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24211b]">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-[#1a1813] transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono font-bold text-sm text-[#aa8b5f] px-2.5 py-1 bg-[#12110e] border border-[#3a362f] rounded-xs">
                      {coupon.code}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `${formatPrice(coupon.discountValue)} Fixed OFF`}
                  </td>

                  <td className="p-4 text-[#8c8273]">
                    {formatPrice(coupon.minOrderAmount)}
                  </td>

                  <td className="p-4 text-[#a19a8d]">
                    {coupon.usageCount} / {coupon.usageLimit || "∞"} used
                  </td>

                  <td className="p-4 text-[#8c8273]">
                    {coupon.expiresAt || "Never"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-xs border ${
                        coupon.isActive
                          ? "bg-[#4caf50]/15 text-[#81c784] border-[#4caf50]/40"
                          : "bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/40"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 border border-[#3a362f] hover:border-[#aa8b5f] text-[#a19a8d] hover:text-[#aa8b5f] rounded-xs cursor-pointer"
                        title="Edit Code"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(coupon.id)}
                        className="p-1.5 border border-[#3a362f] hover:border-[#e53935] text-[#8c8273] hover:text-[#e53935] rounded-xs cursor-pointer"
                        title="Delete Code"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
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
              {editingCoupon ? "Edit Promo Code" : "Create Promotional Code"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Coupon Code (Uppercase) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHAKA20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white font-mono uppercase outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) =>
                      setFormType(e.target.value as "percentage" | "fixed")
                    }
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Min. Order Amount (BDT)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>

                <div className="form-group">
                  <label className="text-[#8c8273] block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                    className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formExpiresAt}
                  onChange={(e) => setFormExpiresAt(e.target.value)}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="accent-[#aa8b5f]"
                  />
                  <span>Activate Promo Code for Storefront Checkout</span>
                </label>
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Coupon"
        message="Are you certain you wish to delete this coupon code? Customers will no longer be able to apply it at checkout."
        confirmText="Delete Coupon"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
