import React from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
import { currencies } from "../../data/currencies"

export const CurrencyModal: React.FC = () => {
  const {
    isCurrencyModalOpen,
    setIsCurrencyModalOpen,
    currency,
    setCurrency,
    showToast,
  } = useShop()

  if (!isCurrencyModalOpen) return null

  const handleSelect = (curr: any) => {
    setCurrency(curr)
    setIsCurrencyModalOpen(false)
    showToast(`Region and currency updated to ${curr.label}`)
  }

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsCurrencyModalOpen(false)}
      aria-label="Currency and Region Selection"
    >
      <div
        className="luxury-modal p-8 max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close-corner"
          onClick={() => setIsCurrencyModalOpen(false)}
          aria-label="Close currency selection"
        >
          <Icon name="x" size={18} />
        </button>

        <p className="eyebrow !mb-2">
          <span></span> International Concierge
        </p>
        <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-3">
          Select Region & Currency
        </h2>
        <p className="text-xs text-[#736c61] mb-6">
          Pricing, duties, and complimentary delivery will be calibrated for
          your selected destination.
        </p>

        <div className="space-y-2">
          {currencies.map((curr) => {
            const isSelected = currency.code === curr.code
            return (
              <button
                key={curr.code}
                onClick={() => handleSelect(curr)}
                className={`w-full p-4 flex items-center justify-between border text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? "border-[var(--ink)] bg-white font-semibold"
                    : "border-[var(--line)] bg-[rgba(255,255,255,0.4)] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#eeeae3] flex items-center justify-center font-serif text-sm">
                    {curr.symbol}
                  </span>
                  <span>{curr.label}</span>
                </div>
                {isSelected && <Icon name="check" size={16} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
