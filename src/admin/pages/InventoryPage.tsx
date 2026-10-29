import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Product, InventoryLog } from "../../types"

interface InventoryPageProps {
  products: Product[]
  inventoryLogs: InventoryLog[]
  onAdjustStock: (
    productId: number,
    delta: number,
    reason: string,
  ) => Promise<boolean>
  searchQuery: string
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  products,
  inventoryLogs,
  onAdjustStock,
  searchQuery,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustDelta, setAdjustDelta] = useState<number>(5)
  const [adjustReason, setAdjustReason] = useState<string>(
    "Restock shipment arrived",
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "low" | "out">("all")

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))

    const qty = p.stockQuantity ?? (p.inStock ? 12 : 0)
    const isLow = p.inStock && qty <= 5
    const isOut = !p.inStock || qty <= 0

    if (filterType === "low") return matchesSearch && isLow
    if (filterType === "out") return matchesSearch && isOut
    return matchesSearch
  })

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsSubmitting(true)
    await onAdjustStock(selectedProduct.id, adjustDelta, adjustReason)
    setIsSubmitting(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
              filterType === "all"
                ? "bg-[#aa8b5f] text-[#171713]"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            All Inventory ({products.length})
          </button>
          <button
            onClick={() => setFilterType("low")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
              filterType === "low"
                ? "bg-[#ff9800] text-[#171713]"
                : "text-[#ff9800] hover:bg-[#ff9800]/10"
            }`}
          >
            ⚠️ Low Stock (
            {
              products.filter((p) => p.inStock && (p.stockQuantity ?? 12) <= 5)
                .length
            }
            )
          </button>
          <button
            onClick={() => setFilterType("out")}
            className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider text-[11px] cursor-pointer transition-colors ${
              filterType === "out"
                ? "bg-[#e53935] text-white"
                : "text-[#e53935] hover:bg-[#e53935]/10"
            }`}
          >
            ✕ Out of Stock (
            {
              products.filter((p) => !p.inStock || (p.stockQuantity ?? 0) <= 0)
                .length
            }
            )
          </button>
        </div>
      </div>

      {/* Inventory Stock Levels Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        <div className="p-4 border-b border-[#2d2a24] bg-[#12110e]">
          <h3 className="font-['Cormorant_Garamond',serif] text-xl text-white m-0">
            Live Atelier Stock Levels
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4">Piece</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Stock Condition</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24211b]">
              {filteredProducts.map((p) => {
                const qty = p.stockQuantity ?? (p.inStock ? 12 : 0)
                const isLow = p.inStock && qty <= 5
                const isOut = !p.inStock || qty <= 0

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#1a1813] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-10 h-12 object-cover border border-[#2d2a24]"
                        />
                        <strong className="text-white font-medium">
                          {p.name}
                        </strong>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[#8c8273]">
                      {p.sku || `AUR-${p.id}`}
                    </td>

                    <td className="p-4 text-[#a19a8d] capitalize">
                      {p.category}
                    </td>

                    <td className="p-4">
                      <span className="text-white font-bold text-sm">
                        {qty} units
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                          isOut
                            ? "bg-[#e53935]/20 text-[#ef5350] border-[#e53935]/40"
                            : isLow
                              ? "bg-[#ff9800]/20 text-[#ffb74d] border-[#ff9800]/40"
                              : "bg-[#4caf50]/20 text-[#81c784] border-[#4caf50]/40"
                        }`}
                      >
                        {isOut
                          ? "Out of Stock"
                          : isLow
                            ? "Low Stock Warning"
                            : "Healthy Stock"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p)
                          setAdjustDelta(5)
                          setAdjustReason("Restock shipment arrived")
                        }}
                        className="px-3 py-1.5 bg-[#aa8b5f]/15 hover:bg-[#aa8b5f] text-[#aa8b5f] hover:text-[#171713] border border-[#aa8b5f]/40 text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movement Logs Section */}
      <div className="bg-[#171713] border border-[#2d2a24] p-6 space-y-4">
        <h3 className="font-['Cormorant_Garamond',serif] text-xl text-white m-0">
          Stock Movement & Audit History
        </h3>
        <p className="text-xs text-[#8c8273]">
          Chronological record of stock arrivals, sales deductions, and
          adjustments.
        </p>

        <div className="space-y-2">
          {inventoryLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-[#1f1d17] border border-[#2d2a24] flex justify-between items-center text-xs"
            >
              <div>
                <strong className="text-white block font-medium">
                  {log.productName}
                </strong>
                <span className="text-[#8c8273] text-[10px]">
                  Reason: {log.reason || "Manual Adjustment"} · {log.createdAt}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold text-sm block ${
                    log.quantityDelta > 0 ? "text-[#81c784]" : "text-[#e57373]"
                  }`}
                >
                  {log.quantityDelta > 0
                    ? `+${log.quantityDelta}`
                    : log.quantityDelta}
                </span>
                <span className="text-[10px] text-[#8c8273]">
                  New Balance: {log.newQuantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#171713] border border-[#aa8b5f]/40 max-w-md w-full p-6 text-[#f7f5f0] shadow-2xl relative animate-fadeIn rounded-xs space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#8c8273] hover:text-white cursor-pointer"
            >
              <Icon name="x" size={18} />
            </button>

            <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-[#aa8b5f] m-0">
              Adjust Stock Level
            </h3>
            <p className="text-white font-medium m-0">
              {selectedProduct.name} (Current:{" "}
              {selectedProduct.stockQuantity ?? 12} units)
            </p>

            <form onSubmit={handleStockSubmit} className="space-y-4 pt-2">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Quantity Delta (+ to restock, - to deduct) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                />
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
                >
                  <option value="Restock shipment arrived">
                    Restock shipment arrived from Atelier
                  </option>
                  <option value="Physical inventory audit correction">
                    Physical inventory audit correction
                  </option>
                  <option value="Damaged / Inspection rejected">
                    Damaged / Inspection rejected
                  </option>
                  <option value="VIP client showroom reservation">
                    VIP client showroom reservation
                  </option>
                  <option value="Customer return restocked">
                    Customer return restocked
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2d2a24]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-[#3a362f] text-[#8c8273] hover:text-white uppercase font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] uppercase font-semibold text-xs cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Commit Stock Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
