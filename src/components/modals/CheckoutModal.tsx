import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"
import { UserOrder } from "../../types"

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartFinalTotal,
    discountPercent,
    discountAmount,
    formatPrice,
    createOrder,
    showToast,
  } = useShop()

  const [step, setStep] = useState<"shipping" | "payment" | "confirmed">(
    "shipping",
  )
  const [createdOrder, setCreatedOrder] = useState<UserOrder | null>(null)

  // Form states
  const [fullName, setFullName] = useState("Nazmus Shakib")
  const [email, setEmail] = useState("shakib@aurelia.com.bd")
  const [address, setAddress] = useState("House 14, Road 71, Gulshan-2")
  const [city, setCity] = useState("Dhaka")
  const [postalCode, setPostalCode] = useState("1212")
  const [country, setCountry] = useState("Bangladesh")
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242")
  const [cardExp, setCardExp] = useState("08/29")
  const [cardCvc, setCardCvc] = useState("892")

  if (!isCheckoutOpen) return null

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const order = createOrder({
      fullName,
      email,
      address,
      city,
      postalCode,
      country,
    })
    setCreatedOrder(order)
    setStep("confirmed")
    showToast("Acquisition confirmed. Your order is now in our Paris atelier.")
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setStep("shipping")
    setCreatedOrder(null)
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      aria-label="Atelier Checkout"
    >
      <div
        className="luxury-modal p-8 max-w-[680px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close-corner"
          onClick={handleClose}
          aria-label="Close checkout"
        >
          <Icon name="x" size={18} />
        </button>

        {step === "shipping" && (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <p className="eyebrow !mb-2">
              <span></span> Step 01 / 02 · Delivery Sanctuary
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-2">
              White Glove Delivery Details
            </h2>
            <p className="text-xs text-[#756e63] mb-6">
              All acquisitions are packaged in archival cedar boxes and
              hand-delivered with signature verification.
            </p>

            <div className="form-grid">
              <div className="form-group full">
                <label>Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Email for Correspondence & Dispatch Tracking</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Street Address / Suite</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Country / Region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option>Bangladesh</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>United Arab Emirates</option>
                  <option>France</option>
                  <option>Singapore</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex justify-between items-center">
              <div>
                <span className="text-xs text-[#8c857a] block">
                  Acquisition Total
                </span>
                <strong className="text-lg font-semibold">
                  {formatPrice(cartFinalTotal)}
                </strong>
                {discountPercent > 0 && (
                  <span className="text-[10px] text-[#8c6e49] block">
                    Includes {discountPercent}% privilege savings (-
                    {formatPrice(discountAmount)})
                  </span>
                )}
              </div>
              <button type="submit" className="button button-dark !px-8">
                Continue to Payment <Icon name="arrow" size={16} />
              </button>
            </div>
          </form>
        )}

        {step === "payment" && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <p className="eyebrow !mb-2">
              <span></span> Step 02 / 02 · Secure Acquisition
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-2">
              Payment Method
            </h2>
            <p className="text-xs text-[#756e63] mb-6">
              Encrypted transaction protected by 256-bit bank-grade protocol.
            </p>

            <div className="p-4 bg-white border border-[var(--ink)] mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="shield" size={20} className="text-[var(--gold)]" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Credit / Debit Card (Amex, Visa, Mastercard)
                </span>
              </div>
              <span className="text-[10px] text-[#7a7368]">Encrypted</span>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Card Number</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Expiry (MM/YY)</label>
                <input
                  type="text"
                  required
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Security Code (CVV)</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="text-xs font-semibold uppercase tracking-wider text-[#797266] border-0 bg-transparent cursor-pointer hover:underline"
              >
                ← Back to Shipping
              </button>
              <button type="submit" className="button button-dark !px-8">
                Complete Acquisition ({formatPrice(cartFinalTotal)})
              </button>
            </div>
          </form>
        )}

        {step === "confirmed" && createdOrder && (
          <div className="text-center py-8 space-y-4">
            <span className="inline-flex p-4 rounded-full bg-[rgba(170,139,95,0.15)] text-[var(--gold)]">
              <Icon name="check" size={36} />
            </span>
            <p className="eyebrow !justify-center !mb-1">
              <span></span> Confirmed Atelier Acquisition
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-4xl m-0">
              Merci, {fullName}.
            </h2>
            <p className="text-xs text-[#716a5e] max-w-[460px] mx-auto leading-relaxed">
              Your order <strong>{createdOrder.id}</strong> has been received by
              our Paris workshop. A dedicated concierge will oversee final
              quality inspection before dispatch.
            </p>

            <div className="p-5 bg-white border border-[var(--line)] text-xs text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b border-[var(--line)] pb-2 font-semibold">
                <span>Order Reference: {createdOrder.id}</span>
                <span className="text-[#8c6e49]">{createdOrder.status}</span>
              </div>
              <div>
                <strong>Delivery Address:</strong> {address}, {city},{" "}
                {postalCode}, {country}
              </div>
              <div>
                <strong>Tracking Number:</strong> {createdOrder.trackingNumber}
              </div>
              <div className="border-t border-[var(--line)] pt-2 flex justify-between font-semibold text-sm">
                <span>Total Paid:</span>
                <span>{formatPrice(createdOrder.total)}</span>
              </div>
            </div>

            <button className="button button-dark mt-4" onClick={handleClose}>
              Return to Maison Aurélia
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
