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
    storeSettings,
  } = useShop()

  const [step, setStep] = useState<"shipping" | "payment" | "confirmed">(
    "shipping",
  )
  const [createdOrder, setCreatedOrder] = useState<UserOrder | null>(null)

  // Shipping Form states
  const [fullName, setFullName] = useState("Nazmus Shakib")
  const [email, setEmail] = useState("shakib@aurelia.com.bd")
  const [phone, setPhone] = useState("+880 1711-234567")
  const [address, setAddress] = useState("House 14, Road 71, Gulshan-2")
  const [city, setCity] = useState("Dhaka")
  const [postalCode, setPostalCode] = useState("1212")
  const [country, setCountry] = useState("Bangladesh")

  // Payment Selection state
  const [paymentMethod, setPaymentMethod] =
    useState<"bkash" | "nagad" | "card" | "cod">("bkash")

  // bKash States
  const [bkashMode, setBkashMode] = useState<"direct" | "manual">("direct")
  const [bkashNumber, setBkashNumber] = useState("01712345678")
  const [bkashTrxId, setBkashTrxId] = useState("")
  const [isBkashSimulating, setIsBkashSimulating] = useState(false)
  const [bkashSimStep, setBkashSimStep] = useState<"otp" | "pin" | "done">(
    "otp",
  )
  const [bkashOtp, setBkashOtp] = useState("123456")
  const [bkashPin, setBkashPin] = useState("•••••")

  // Nagad States
  const [nagadNumber, setNagadNumber] = useState("01812345678")
  const [nagadTrxId, setNagadTrxId] = useState("")

  // Card States
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242")
  const [cardHolder, setCardHolder] = useState("Nazmus Shakib")
  const [cardExp, setCardExp] = useState("08/29")
  const [cardCvc, setCardCvc] = useState("892")

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!isCheckoutOpen) return null

  // Delivery calculation based on Bangladesh destination
  const isDhaka = city.toLowerCase().includes("dhaka")
  const deliveryFee =
    cartSubtotal >= (storeSettings?.freeShippingThreshold || 50000)
      ? 0
      : isDhaka
        ? storeSettings?.deliveryChargeDhaka || 120
        : storeSettings?.deliveryChargeOutside || 200

  const grandTotal = cartFinalTotal + deliveryFee

  const handleCopyNumber = (num: string, key: string) => {
    navigator.clipboard.writeText(num)
    setCopiedKey(key)
    showToast(`Copied ${num} to clipboard`, "info")
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  // Handle finalize order
  const finalizeOrder = (
    methodLabel: string,
    pStatus: "paid" | "pending",
    details?: any,
  ) => {
    const order = createOrder({
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      paymentMethod: methodLabel,
      paymentStatus: pStatus,
      paymentDetails: details,
      deliveryCharge: deliveryFee,
    })
    setCreatedOrder(order)
    setStep("confirmed")
    setIsBkashSimulating(false)
    showToast(
      `Acquisition confirmed via ${methodLabel}. Order dispatched to Paris workshop.`,
      "success",
    )
  }

  // Handle standard payment submit
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "bkash") {
      if (bkashMode === "direct") {
        // Open interactive bKash simulator
        setIsBkashSimulating(true)
        setBkashSimStep("otp")
        return
      } else {
        if (!bkashTrxId.trim()) {
          showToast("Please enter your bKash Transaction ID (TrxID)", "error")
          return
        }
        finalizeOrder("bKash", "paid", {
          walletNumber: bkashNumber,
          transactionId: bkashTrxId.toUpperCase(),
          accountType:
            storeSettings?.paymentGateways?.bkash?.accountType || "merchant",
        })
      }
    } else if (paymentMethod === "nagad") {
      if (!nagadTrxId.trim()) {
        showToast("Please enter your Nagad Transaction ID (TrxID)", "error")
        return
      }
      finalizeOrder("Nagad", "paid", {
        walletNumber: nagadNumber,
        transactionId: nagadTrxId.toUpperCase(),
        accountType:
          storeSettings?.paymentGateways?.nagad?.accountType || "merchant",
      })
    } else if (paymentMethod === "card") {
      const cleanCard = cardNumber.replace(/\s+/g, "")
      const last4 = cleanCard.slice(-4) || "4242"
      finalizeOrder("Credit / Debit Card", "paid", {
        cardLast4: last4,
        cardBrand: "Visa / Mastercard",
        cardHolder,
      })
    } else if (paymentMethod === "cod") {
      finalizeOrder("Cash on Delivery", "pending", {
        instructions: "Pay upon white-glove inspection in cash or POS card",
      })
    }
  }

  // Complete simulated bKash Gateway
  const handleSimulatedBkashComplete = () => {
    const generatedTrxId = `9B${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    finalizeOrder("bKash (Direct Gateway)", "paid", {
      walletNumber: bkashNumber,
      transactionId: generatedTrxId,
      gateway: "bKash Official PGW",
    })
  }

  const handleClose = () => {
    setIsCheckoutOpen(false)
    setStep("shipping")
    setCreatedOrder(null)
    setIsBkashSimulating(false)
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      aria-label="Atelier Checkout"
    >
      <div
        className="luxury-modal p-6 md:p-8 max-w-[720px] max-h-[92vh] overflow-y-auto"
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

        {/* ================= STEP 1: SHIPPING ================= */}
        {step === "shipping" && (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <p className="eyebrow !mb-2">
              <span></span> Step 01 / 02 · Delivery Sanctuary
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-1 text-white">
              White Glove Delivery Details
            </h2>
            <p className="text-xs text-[#8c8273] mb-5">
              All acquisitions are packaged in archival cedar boxes and
              hand-delivered with signature verification across Bangladesh.
            </p>

            <div className="form-grid">
              <div className="form-group full">
                <label>Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Begum Rokeya Chowdhury"
                />
              </div>

              <div className="form-group">
                <label>Email Address for Tracking</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number (For Courier & MFS)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                />
              </div>

              <div className="form-group full">
                <label>Street Address, Suite or Villa</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 14, Road 71, Gulshan-2"
                />
              </div>

              <div className="form-group">
                <label>City (Dhaka / Chittagong / Sylhet etc.)</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka"
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1212"
                />
              </div>

              <div className="form-group full">
                <label>Country / Territory</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#171713] text-white border border-[#2d2a24] p-2.5 text-xs"
                >
                  <option value="Bangladesh">
                    Bangladesh (Nationwide White-Glove)
                  </option>
                  <option value="United Arab Emirates">
                    United Arab Emirates (Dubai Diplomatic)
                  </option>
                  <option value="United Kingdom">
                    United Kingdom (London Knightsbridge)
                  </option>
                  <option value="United States">
                    United States (New York)
                  </option>
                  <option value="France">France (Paris Atelier)</option>
                </select>
              </div>
            </div>

            {/* Delivery fee breakdown */}
            <div className="p-3.5 bg-[#1b1914] border border-[#2d2a24] text-xs space-y-1.5 mt-4">
              <div className="flex justify-between text-[#8c8273]">
                <span>Items Subtotal:</span>
                <span>{formatPrice(cartFinalTotal)}</span>
              </div>
              <div className="flex justify-between text-[#8c8273]">
                <span>
                  Courier Delivery ({isDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                  ):
                </span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-[#81c784]">
                      COMPLIMENTARY VIP
                    </strong>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              {deliveryFee === 0 && (
                <p className="text-[10px] text-[#aa8b5f] m-0">
                  ✦ Complimentary White-Glove delivery applied for acquisitions
                  over{" "}
                  {formatPrice(storeSettings?.freeShippingThreshold || 50000)}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--line)] flex justify-between items-center">
              <div>
                <span className="text-xs text-[#8c857a] block">
                  Total Payable
                </span>
                <strong className="text-lg font-semibold text-white font-['Cormorant_Garamond',serif]">
                  {formatPrice(grandTotal)}
                </strong>
                {discountPercent > 0 && (
                  <span className="text-[10px] text-[#aa8b5f] block">
                    Includes {discountPercent}% privilege code (-
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

        {/* ================= STEP 2: PAYMENT ================= */}
        {step === "payment" && !isBkashSimulating && (
          <form onSubmit={handlePaymentSubmit} className="space-y-5">
            <p className="eyebrow !mb-1">
              <span></span> Step 02 / 02 · Secure Acquisition
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-1 text-white">
              Select Payment Gateway
            </h2>
            <p className="text-xs text-[#8c8273] mb-4">
              Encrypted transaction protected with 256-bit bank-grade TLS
              protocol.
            </p>

            {/* Gateway Selection Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* bKash Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod("bkash")}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === "bkash"
                    ? "border-[#e2136e] bg-[#e2136e]/10 shadow-[0_0_12px_rgba(226,19,110,0.2)]"
                    : "border-[#2d2a24] bg-[#171713] hover:border-[#3d382f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wide text-[#e2136e]">
                    bKash
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#e2136e]/20 text-[#e2136e]">
                    বিকাশ
                  </span>
                </div>
                <span className="text-[10px] text-[#a0988c] block">
                  Instant PGW / Send Money
                </span>
              </button>

              {/* Nagad Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod("nagad")}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === "nagad"
                    ? "border-[#f7941d] bg-[#f7941d]/10 shadow-[0_0_12px_rgba(247,148,29,0.2)]"
                    : "border-[#2d2a24] bg-[#171713] hover:border-[#3d382f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wide text-[#f7941d]">
                    Nagad
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-[#f7941d]/20 text-[#f7941d]">
                    নগদ
                  </span>
                </div>
                <span className="text-[10px] text-[#a0988c] block">
                  Merchant Pay / MFS
                </span>
              </button>

              {/* Card Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === "card"
                    ? "border-[#aa8b5f] bg-[#aa8b5f]/10 shadow-[0_0_12px_rgba(170,139,95,0.2)]"
                    : "border-[#2d2a24] bg-[#171713] hover:border-[#3d382f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wide text-white">
                    Debit / Card
                  </span>
                  <Icon
                    name="credit-card"
                    size={14}
                    className="text-[#aa8b5f]"
                  />
                </div>
                <span className="text-[10px] text-[#a0988c] block">
                  Visa, MC, Amex, Nexus
                </span>
              </button>

              {/* COD Tab */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === "cod"
                    ? "border-[#81c784] bg-[#81c784]/10 shadow-[0_0_12px_rgba(129,199,132,0.2)]"
                    : "border-[#2d2a24] bg-[#171713] hover:border-[#3d382f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wide text-white">
                    Cash Delivery
                  </span>
                  <Icon name="box" size={14} className="text-[#81c784]" />
                </div>
                <span className="text-[10px] text-[#a0988c] block">
                  White-glove handover
                </span>
              </button>
            </div>

            {/* ================= BKASH DETAILS ================= */}
            {paymentMethod === "bkash" && (
              <div className="p-5 bg-[#171713] border border-[#e2136e]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2d2a24] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e2136e] flex items-center justify-center font-bold text-white text-xs">
                      ব
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white m-0">
                        bKash Payment Gateway (বাংলাদেশ বিকাশ)
                      </h4>
                      <span className="text-[11px] text-[#8c8273]">
                        Official Atelier Merchant Account · 24/7 Instant
                        Verification
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBkashMode("direct")}
                      className={`text-[10px] px-2.5 py-1 uppercase font-semibold cursor-pointer border ${
                        bkashMode === "direct"
                          ? "bg-[#e2136e] text-white border-[#e2136e]"
                          : "bg-transparent text-[#8c8273] border-[#2d2a24]"
                      }`}
                    >
                      Seamless PGW
                    </button>
                    <button
                      type="button"
                      onClick={() => setBkashMode("manual")}
                      className={`text-[10px] px-2.5 py-1 uppercase font-semibold cursor-pointer border ${
                        bkashMode === "manual"
                          ? "bg-[#e2136e] text-white border-[#e2136e]"
                          : "bg-transparent text-[#8c8273] border-[#2d2a24]"
                      }`}
                    >
                      Manual TrxID
                    </button>
                  </div>
                </div>

                {/* Merchant account info badge */}
                <div className="p-3 bg-[#11100d] border border-[#2d2a24] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8c8273] block">
                      Atelier bKash{" "}
                      {storeSettings?.paymentGateways?.bkash?.accountType ===
                      "personal"
                        ? "Personal"
                        : "Merchant"}{" "}
                      Number
                    </span>
                    <strong className="text-white text-sm tracking-widest font-mono">
                      {storeSettings?.paymentGateways?.bkash?.accountNumber ||
                        "01711-234567"}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNumber(
                        storeSettings?.paymentGateways?.bkash?.accountNumber ||
                          "01711-234567",
                        "bkash",
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25221b] hover:bg-[#322e25] text-xs text-[#aa8b5f] border border-[#3d382f] cursor-pointer"
                  >
                    <Icon name="copy" size={12} />
                    {copiedKey === "bkash" ? "Copied!" : "Copy Number"}
                  </button>
                </div>

                {bkashMode === "direct" ? (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-[#b8b0a2] leading-relaxed m-0">
                      You will be directed to the official bKash checkout window
                      to confirm your payment with OTP & PIN. Zero transaction
                      fee.
                    </p>
                    <div className="form-group">
                      <label className="text-[11px] text-[#8c8273] block mb-1">
                        Your 11-Digit bKash Mobile Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-[#11100d] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-[#1e1c17] text-[11px] text-[#c9c1b3] space-y-1">
                      <p className="m-0 font-semibold text-[#aa8b5f]">
                        Instructions for Manual bKash Payment:
                      </p>
                      <p className="m-0">
                        1. Open bKash App or dial *247# on your mobile phone.
                      </p>
                      <p className="m-0">
                        2. Select{" "}
                        <strong>
                          {storeSettings?.paymentGateways?.bkash
                            ?.accountType === "personal"
                            ? "Send Money"
                            : "Make Payment"}
                        </strong>{" "}
                        to{" "}
                        <strong>
                          {storeSettings?.paymentGateways?.bkash
                            ?.accountNumber || "01711-234567"}
                        </strong>
                        .
                      </p>
                      <p className="m-0">
                        3. Enter Amount:{" "}
                        <strong>{formatPrice(grandTotal)}</strong>
                      </p>
                      <p className="m-0">
                        4. Enter Reference: <strong>AUR-VIP</strong>
                      </p>
                      <p className="m-0">
                        5. Confirm with your PIN and paste the received TrxID
                        below.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-group">
                        <label className="text-[11px] text-[#8c8273] block mb-1">
                          Sender bKash Wallet Number
                        </label>
                        <input
                          type="text"
                          required
                          value={bkashNumber}
                          onChange={(e) => setBkashNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full bg-[#11100d] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] font-mono text-xs"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-[11px] text-[#8c8273] block mb-1">
                          Transaction ID (TrxID)
                        </label>
                        <input
                          type="text"
                          required
                          value={bkashTrxId}
                          onChange={(e) => setBkashTrxId(e.target.value)}
                          placeholder="e.g. 9B87F2K1L"
                          className="w-full bg-[#11100d] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] font-mono text-xs uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= NAGAD DETAILS ================= */}
            {paymentMethod === "nagad" && (
              <div className="p-5 bg-[#171713] border border-[#f7941d]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2d2a24] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f7941d] flex items-center justify-center font-bold text-white text-xs">
                      ন
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white m-0">
                        Nagad Payment (ডাক বিভাগীয় ডিজিটাল লেনদেন)
                      </h4>
                      <span className="text-[11px] text-[#8c8273]">
                        Official Atelier Merchant Account
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#f7941d]/20 text-[#f7941d] uppercase font-bold">
                    Nagad Active
                  </span>
                </div>

                <div className="p-3 bg-[#11100d] border border-[#2d2a24] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8c8273] block">
                      Atelier Nagad Merchant Number
                    </span>
                    <strong className="text-white text-sm tracking-widest font-mono">
                      {storeSettings?.paymentGateways?.nagad?.accountNumber ||
                        "01819-987654"}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyNumber(
                        storeSettings?.paymentGateways?.nagad?.accountNumber ||
                          "01819-987654",
                        "nagad",
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25221b] hover:bg-[#322e25] text-xs text-[#f7941d] border border-[#3d382f] cursor-pointer"
                  >
                    <Icon name="copy" size={12} />
                    {copiedKey === "nagad" ? "Copied!" : "Copy Number"}
                  </button>
                </div>

                <div className="p-3 bg-[#1e1c17] text-[11px] text-[#c9c1b3] space-y-1">
                  <p className="m-0 font-semibold text-[#f7941d]">
                    How to pay using Nagad App or *167#:
                  </p>
                  <p className="m-0">
                    1. Open Nagad App or dial *167# on your phone.
                  </p>
                  <p className="m-0">
                    2. Select <strong>Merchant Pay</strong> and enter:{" "}
                    <strong>
                      {storeSettings?.paymentGateways?.nagad?.accountNumber ||
                        "01819-987654"}
                    </strong>
                  </p>
                  <p className="m-0">
                    3. Enter Amount: <strong>{formatPrice(grandTotal)}</strong>
                  </p>
                  <p className="m-0">
                    4. Enter Reference: <strong>AUR-VIP</strong> and confirm
                    with PIN.
                  </p>
                  <p className="m-0">
                    5. Enter your 8-digit Nagad TrxID below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="text-[11px] text-[#8c8273] block mb-1">
                      Sender Nagad Number
                    </label>
                    <input
                      type="text"
                      required
                      value={nagadNumber}
                      onChange={(e) => setNagadNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#11100d] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#f7941d] font-mono text-xs"
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-[11px] text-[#8c8273] block mb-1">
                      Nagad Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      required
                      value={nagadTrxId}
                      onChange={(e) => setNagadTrxId(e.target.value)}
                      placeholder="e.g. 8N2K91LP"
                      className="w-full bg-[#11100d] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#f7941d] font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= CREDIT / DEBIT CARDS ================= */}
            {paymentMethod === "card" && (
              <div className="p-5 bg-[#171713] border border-[#aa8b5f]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2d2a24] pb-3">
                  <div className="flex items-center gap-3">
                    <Icon
                      name="credit-card"
                      size={20}
                      className="text-[#aa8b5f]"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-white m-0">
                        International & Domestic Cards
                      </h4>
                      <span className="text-[11px] text-[#8c8273]">
                        Visa, Mastercard, American Express, DBBL NexusPay
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#81c784] font-mono bg-[#81c784]/15 px-2 py-0.5">
                    256-bit TLS SSL
                  </span>
                </div>

                <div className="form-grid">
                  <div className="form-group full">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name as printed on card"
                    />
                  </div>

                  <div className="form-group full">
                    <label>Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• 4242"
                      className="font-mono"
                    />
                  </div>

                  <div className="form-group">
                    <label>Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="08/29"
                      className="font-mono"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV / CVC Code</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="892"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= CASH ON DELIVERY ================= */}
            {paymentMethod === "cod" && (
              <div className="p-5 bg-[#171713] border border-[#81c784]/40 space-y-3">
                <div className="flex items-center gap-3 border-b border-[#2d2a24] pb-3">
                  <div className="w-8 h-8 rounded-full bg-[#81c784]/20 text-[#81c784] flex items-center justify-center">
                    <Icon name="box" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white m-0">
                      Cash on White-Glove Handover
                    </h4>
                    <span className="text-[11px] text-[#8c8273]">
                      Pay upon delivery after parcel inspection
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#1b1914] text-xs text-[#b8b0a2] space-y-2 leading-relaxed">
                  <p className="m-0">
                    Our dedicated concierge courier will hand-deliver your
                    acquisition in an archival cedar presentation box.
                  </p>
                  <p className="m-0">
                    You are entitled to open and verify the seal and item
                    condition before settling payment in cash (BDT ৳) or using
                    the courier's handheld wireless POS card machine.
                  </p>
                  <div className="p-2.5 bg-[#25221b] border border-[#3a362f] text-[11px] text-[#aa8b5f] font-medium flex justify-between">
                    <span>Payment Due upon Handover:</span>
                    <strong className="text-white font-mono">
                      {formatPrice(grandTotal)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Summary & Submit */}
            <div className="pt-4 border-t border-[var(--line)] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep("shipping")}
                className="text-xs font-semibold uppercase tracking-wider text-[#8c8273] border-0 bg-transparent cursor-pointer hover:underline"
              >
                ← Back to Shipping
              </button>
              <button
                type="submit"
                className={`button !px-8 cursor-pointer ${
                  paymentMethod === "bkash"
                    ? "!bg-[#e2136e] !text-white hover:!bg-[#c20f5c]"
                    : paymentMethod === "nagad"
                      ? "!bg-[#f7941d] !text-white hover:!bg-[#d97c11]"
                      : "button-dark"
                }`}
              >
                {paymentMethod === "bkash" && bkashMode === "direct"
                  ? `Launch bKash Checkout (${formatPrice(grandTotal)})`
                  : paymentMethod === "cod"
                    ? `Confirm Order (${formatPrice(grandTotal)})`
                    : `Complete Acquisition (${formatPrice(grandTotal)})`}
              </button>
            </div>
          </form>
        )}

        {/* ================= BKASH SIMULATED MODAL OVERLAY ================= */}
        {isBkashSimulating && (
          <div className="p-6 bg-[#d81a60] text-white rounded-xs space-y-5 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#d81a60] flex items-center justify-center font-bold text-lg">
                  ব
                </div>
                <div>
                  <h3 className="text-lg font-bold m-0 tracking-wide text-white">
                    bKash Payment Gateway
                  </h3>
                  <span className="text-xs text-white/80">
                    Merchant: {storeSettings?.storeName || "Aurélia Maison"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-white/80 block uppercase">
                  Amount
                </span>
                <strong className="text-xl font-bold font-mono">
                  ৳{grandTotal.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* Step 1: OTP */}
            {bkashSimStep === "otp" && (
              <div className="space-y-4 bg-white text-[#171713] p-6 shadow-md">
                <p className="text-xs text-[#524c42] m-0">
                  A 6-digit verification code has been sent to{" "}
                  <strong>{bkashNumber}</strong>. (Auto-filled for instant
                  simulation)
                </p>
                <div className="form-group">
                  <label className="text-xs font-semibold text-[#171713] block mb-1">
                    Enter Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    value={bkashOtp}
                    onChange={(e) => setBkashOtp(e.target.value)}
                    className="w-full border border-[#d81a60] p-3 text-center tracking-widest font-mono text-lg font-bold outline-none"
                    placeholder="123456"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBkashSimulating(false)}
                    className="px-4 py-2 border border-[#999] text-xs font-semibold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBkashSimStep("pin")}
                    className="px-6 py-2 bg-[#d81a60] text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    Confirm OTP →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: PIN */}
            {bkashSimStep === "pin" && (
              <div className="space-y-4 bg-white text-[#171713] p-6 shadow-md">
                <p className="text-xs text-[#524c42] m-0">
                  Enter your bKash PIN to authorize payment of{" "}
                  <strong>৳{grandTotal.toLocaleString("en-IN")}</strong> to
                  Aurélia Maison Paris.
                </p>
                <div className="form-group">
                  <label className="text-xs font-semibold text-[#171713] block mb-1">
                    Enter bKash 5-Digit PIN
                  </label>
                  <input
                    type="password"
                    maxLength={5}
                    value={bkashPin}
                    onChange={(e) => setBkashPin(e.target.value)}
                    className="w-full border border-[#d81a60] p-3 text-center tracking-widest font-mono text-xl font-bold outline-none"
                    placeholder="•••••"
                  />
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setBkashSimStep("otp")}
                    className="px-4 py-2 border border-[#999] text-xs font-semibold uppercase cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatedBkashComplete}
                    className="px-8 py-2 bg-[#d81a60] text-white text-xs font-semibold uppercase cursor-pointer font-bold shadow-md hover:bg-[#b0134b]"
                  >
                    Confirm Payment ৳{grandTotal.toLocaleString("en-IN")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: CONFIRMED ================= */}
        {step === "confirmed" && createdOrder && (
          <div className="text-center py-6 space-y-4">
            <span className="inline-flex p-4 rounded-full bg-[rgba(170,139,95,0.15)] text-[var(--gold)]">
              <Icon name="check" size={36} />
            </span>
            <p className="eyebrow !justify-center !mb-1">
              <span></span> Confirmed Atelier Acquisition
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-4xl m-0 text-white">
              Merci, {fullName}.
            </h2>
            <p className="text-xs text-[#8c8273] max-w-[480px] mx-auto leading-relaxed">
              Your order <strong>{createdOrder.id}</strong> has been received by
              our Paris workshop. A dedicated concierge will oversee final
              quality inspection before white-glove dispatch.
            </p>

            <div className="p-5 bg-[#171713] border border-[#2d2a24] text-xs text-left space-y-3 max-w-lg mx-auto">
              <div className="flex justify-between border-b border-[#2d2a24] pb-2 font-semibold">
                <span className="text-white font-mono">
                  Order Reference: {createdOrder.id}
                </span>
                <span className="text-[#aa8b5f]">{createdOrder.status}</span>
              </div>

              {/* Payment Receipt Badge */}
              <div className="p-2.5 bg-[#1f1d17] border border-[#2d2a24] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#8c8273] block">
                    Payment Gateway & Status
                  </span>
                  <strong className="text-white">
                    {createdOrder.paymentMethod || "bKash"}
                  </strong>
                  {createdOrder.paymentDetails?.transactionId && (
                    <span className="text-[11px] text-[#aa8b5f] font-mono block">
                      TrxID: {createdOrder.paymentDetails.transactionId}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] px-2.5 py-1 font-bold uppercase ${
                    createdOrder.paymentStatus === "paid"
                      ? "bg-[#81c784]/20 text-[#81c784] border border-[#81c784]/40"
                      : "bg-[#f7941d]/20 text-[#f7941d] border border-[#f7941d]/40"
                  }`}
                >
                  {createdOrder.paymentStatus === "paid"
                    ? "✓ Paid (Verified)"
                    : "Pending (COD)"}
                </span>
              </div>

              <div className="text-[#b8b0a2] space-y-1">
                <div>
                  <strong className="text-white">Delivery Address:</strong>{" "}
                  {address}, {city}, {postalCode}, {country}
                </div>
                <div>
                  <strong className="text-white">Contact Phone:</strong> {phone}
                </div>
                <div>
                  <strong className="text-white">Tracking Number:</strong>{" "}
                  <span className="font-mono text-[#aa8b5f]">
                    {createdOrder.trackingNumber}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#2d2a24] pt-2 flex justify-between font-semibold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="text-[#aa8b5f] font-['Cormorant_Garamond',serif] text-lg">
                  {formatPrice(createdOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                className="button button-dark cursor-pointer !px-8"
                onClick={handleClose}
              >
                Return to Maison Aurélia
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
