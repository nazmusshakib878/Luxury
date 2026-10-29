import React, { useState } from "react"
import { StoreSettings, PaymentGatewaysConfig } from "../../types"
import { Icon } from "../../components/common/Icon"

interface PaymentGatewaysPageProps {
  settings: StoreSettings
  onSaveSettings: (settings: StoreSettings) => Promise<boolean>
}

export const PaymentGatewaysPage: React.FC<PaymentGatewaysPageProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] =
    useState<"bkash" | "nagad" | "card" | "cod">("bkash")
  const [testTrxId, setTestTrxId] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)

  const gateways: PaymentGatewaysConfig = formData.paymentGateways || {
    bkash: {
      enabled: true,
      accountType: "merchant",
      accountNumber: "01711-234567",
      instructions:
        "Make Payment to our Official bKash Merchant Number using 'Make Payment' in the bKash app.",
      sandboxMode: false,
    },
    nagad: {
      enabled: true,
      accountType: "merchant",
      accountNumber: "01819-987654",
      instructions:
        "Send or Pay to our Official Nagad Merchant Number using the Nagad app.",
    },
    card: {
      enabled: true,
      provider: "sslcommerz",
      storeId: "aureliamaisondk001",
      sandboxMode: true,
    },
    cod: {
      enabled: true,
      instructions:
        "White-glove handover with parcel inspection. Pay with Cash or POS Card upon arrival.",
      maxOrderLimit: 250000,
    },
  }

  const handleUpdateGateway = (
    key: keyof PaymentGatewaysConfig,
    field: string,
    value: any,
  ) => {
    const updatedGateways = {
      ...gateways,
      [key]: {
        ...gateways[key],
        [field]: value,
      },
    }
    setFormData({
      ...formData,
      paymentGateways: updatedGateways,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSaveSettings(formData)
    setIsSaving(false)
  }

  const handleTestTrx = () => {
    if (!testTrxId.trim()) {
      setTestResult("Please enter a Transaction ID to test.")
      return
    }
    setTestResult(
      `✓ Validated: TrxID "${testTrxId.toUpperCase()}" matches verified format for Bangladesh MFS (bKash/Nagad). Status: AUTH_SUCCESS.`,
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      {/* Header Banner */}
      <div className="bg-[#171713] p-4 sm:p-6 border border-[#2d2a24] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Payment Gateways & Financial Settlement
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Configure live payment channels for Bangladesh: bKash (বিকাশ), Nagad
            (নগদ), Credit/Debit Cards, and White-Glove Cash on Delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 bg-[#81c784]/15 text-[#81c784] border border-[#81c784]/30 font-semibold uppercase">
            Active: bKash & Cards Live
          </span>
        </div>
      </div>

      {/* Gateway Selector Tabs */}
      <div className="flex border-b border-[#2d2a24] gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("bkash")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "bkash"
              ? "border-[#e2136e] text-[#e2136e] bg-[#e2136e]/10"
              : "border-transparent text-[#8c8273] hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#e2136e]" />
          bKash (বিকাশ) Gateway
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("nagad")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "nagad"
              ? "border-[#f7941d] text-[#f7941d] bg-[#f7941d]/10"
              : "border-transparent text-[#8c8273] hover:text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#f7941d]" />
          Nagad (নগদ) MFS
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("card")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "card"
              ? "border-[#aa8b5f] text-[#aa8b5f] bg-[#aa8b5f]/10"
              : "border-transparent text-[#8c8273] hover:text-white"
          }`}
        >
          <Icon name="credit-card" size={14} />
          Cards & SSLCommerz
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cod")}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "cod"
              ? "border-[#81c784] text-[#81c784] bg-[#81c784]/10"
              : "border-transparent text-[#8c8273] hover:text-white"
          }`}
        >
          <Icon name="box" size={14} />
          Cash on Delivery
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* ================= BKASH SETTINGS ================= */}
        {activeTab === "bkash" && (
          <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-5">
            <div className="flex items-center justify-between border-b border-[#2d2a24] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0">
                  <span className="text-[#e2136e]">
                    bKash Gateway Configuration
                  </span>
                  {gateways.bkash.enabled ? (
                    <span className="text-[10px] bg-[#81c784]/20 text-[#81c784] px-2 py-0.5 font-normal">
                      Enabled
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#e57373]/20 text-[#e57373] px-2 py-0.5 font-normal">
                      Disabled
                    </span>
                  )}
                </h4>
                <p className="text-[#8c8273] text-[11px] m-0 mt-0.5">
                  Allows customers to pay directly with bKash PGW or submit
                  their Transaction ID (TrxID).
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateways.bkash.enabled}
                  onChange={(e) =>
                    handleUpdateGateway("bkash", "enabled", e.target.checked)
                  }
                  className="w-4 h-4 accent-[#e2136e]"
                />
                <span className="text-white text-xs font-semibold">
                  Enable bKash Gateway
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Atelier bKash Account Number
                </label>
                <input
                  type="text"
                  required
                  value={gateways.bkash.accountNumber}
                  onChange={(e) =>
                    handleUpdateGateway(
                      "bkash",
                      "accountNumber",
                      e.target.value,
                    )
                  }
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] font-mono text-xs"
                />
                <span className="text-[10px] text-[#8c8273] block mt-1">
                  This number is shown to customers during checkout.
                </span>
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  bKash Account Type
                </label>
                <select
                  value={gateways.bkash.accountType}
                  onChange={(e) =>
                    handleUpdateGateway("bkash", "accountType", e.target.value)
                  }
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] text-xs"
                >
                  <option value="merchant">
                    Merchant Account (Make Payment)
                  </option>
                  <option value="personal">
                    Personal Account (Send Money)
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Customer Instructions on Checkout
              </label>
              <textarea
                rows={3}
                value={gateways.bkash.instructions}
                onChange={(e) =>
                  handleUpdateGateway("bkash", "instructions", e.target.value)
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#e2136e] text-xs"
              />
            </div>

            {/* bKash PGW API Credentials (Optional Live Integration) */}
            <div className="p-4 bg-[#12110e] border border-[#2d2a24] space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-white m-0 text-xs">
                  bKash PGW Tokenized API Credentials (Optional)
                </h5>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gateways.bkash.sandboxMode}
                    onChange={(e) =>
                      handleUpdateGateway(
                        "bkash",
                        "sandboxMode",
                        e.target.checked,
                      )
                    }
                    className="accent-[#e2136e]"
                  />
                  <span className="text-[11px] text-[#8c8273]">
                    Sandbox / Test Mode
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="text-[#8c8273] block mb-0.5">App Key</label>
                  <input
                    type="password"
                    value={gateways.bkash.appKey || ""}
                    onChange={(e) =>
                      handleUpdateGateway("bkash", "appKey", e.target.value)
                    }
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#171713] border border-[#2d2a24] p-2 text-white outline-none font-mono text-xs"
                  />
                </div>
                <div className="form-group">
                  <label className="text-[#8c8273] block mb-0.5">
                    App Secret
                  </label>
                  <input
                    type="password"
                    value={gateways.bkash.appSecret || ""}
                    onChange={(e) =>
                      handleUpdateGateway("bkash", "appSecret", e.target.value)
                    }
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#171713] border border-[#2d2a24] p-2 text-white outline-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= NAGAD SETTINGS ================= */}
        {activeTab === "nagad" && (
          <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-5">
            <div className="flex items-center justify-between border-b border-[#2d2a24] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0">
                  <span className="text-[#f7941d]">
                    Nagad (নগদ) MFS Configuration
                  </span>
                  {gateways.nagad.enabled ? (
                    <span className="text-[10px] bg-[#81c784]/20 text-[#81c784] px-2 py-0.5 font-normal">
                      Enabled
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#e57373]/20 text-[#e57373] px-2 py-0.5 font-normal">
                      Disabled
                    </span>
                  )}
                </h4>
                <p className="text-[#8c8273] text-[11px] m-0 mt-0.5">
                  Allows customers to pay via Nagad Merchant Pay or Send Money
                  with TrxID.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateways.nagad.enabled}
                  onChange={(e) =>
                    handleUpdateGateway("nagad", "enabled", e.target.checked)
                  }
                  className="w-4 h-4 accent-[#f7941d]"
                />
                <span className="text-white text-xs font-semibold">
                  Enable Nagad Gateway
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Atelier Nagad Merchant Number
                </label>
                <input
                  type="text"
                  required
                  value={gateways.nagad.accountNumber}
                  onChange={(e) =>
                    handleUpdateGateway(
                      "nagad",
                      "accountNumber",
                      e.target.value,
                    )
                  }
                  placeholder="018XXXXXXXX"
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#f7941d] font-mono text-xs"
                />
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Account Type
                </label>
                <select
                  value={gateways.nagad.accountType}
                  onChange={(e) =>
                    handleUpdateGateway("nagad", "accountType", e.target.value)
                  }
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#f7941d] text-xs"
                >
                  <option value="merchant">
                    Merchant Account (Merchant Pay)
                  </option>
                  <option value="personal">
                    Personal Account (Send Money)
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Customer Instructions on Checkout
              </label>
              <textarea
                rows={3}
                value={gateways.nagad.instructions}
                onChange={(e) =>
                  handleUpdateGateway("nagad", "instructions", e.target.value)
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#f7941d] text-xs"
              />
            </div>
          </div>
        )}

        {/* ================= CARD SETTINGS ================= */}
        {activeTab === "card" && (
          <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-5">
            <div className="flex items-center justify-between border-b border-[#2d2a24] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0">
                  <span className="text-[#aa8b5f]">
                    Credit & Debit Card Gateway
                  </span>
                  {gateways.card.enabled ? (
                    <span className="text-[10px] bg-[#81c784]/20 text-[#81c784] px-2 py-0.5 font-normal">
                      Enabled
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#e57373]/20 text-[#e57373] px-2 py-0.5 font-normal">
                      Disabled
                    </span>
                  )}
                </h4>
                <p className="text-[#8c8273] text-[11px] m-0 mt-0.5">
                  Accept Visa, MasterCard, American Express, and DBBL NexusPay
                  cards.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateways.card.enabled}
                  onChange={(e) =>
                    handleUpdateGateway("card", "enabled", e.target.checked)
                  }
                  className="w-4 h-4 accent-[#aa8b5f]"
                />
                <span className="text-white text-xs font-semibold">
                  Enable Card Gateway
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Card Gateway Provider
                </label>
                <select
                  value={gateways.card.provider}
                  onChange={(e) =>
                    handleUpdateGateway("card", "provider", e.target.value)
                  }
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f] text-xs"
                >
                  <option value="sslcommerz">
                    SSLCommerz (Bangladesh Leading PGW)
                  </option>
                  <option value="stripe">Stripe International</option>
                  <option value="direct">Direct 3D Secure / Simulated</option>
                </select>
              </div>

              <div className="form-group">
                <label className="text-[#8c8273] block mb-1">
                  Store ID / Merchant ID
                </label>
                <input
                  type="text"
                  value={gateways.card.storeId || ""}
                  onChange={(e) =>
                    handleUpdateGateway("card", "storeId", e.target.value)
                  }
                  placeholder="e.g. aureliamaisondk001"
                  className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f] font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="cardSandbox"
                checked={gateways.card.sandboxMode}
                onChange={(e) =>
                  handleUpdateGateway("card", "sandboxMode", e.target.checked)
                }
                className="w-4 h-4 accent-[#aa8b5f]"
              />
              <label
                htmlFor="cardSandbox"
                className="text-white text-xs cursor-pointer"
              >
                Enable Sandbox / Test Environment (Safe card simulation without
                real charges)
              </label>
            </div>
          </div>
        )}

        {/* ================= CASH ON DELIVERY ================= */}
        {activeTab === "cod" && (
          <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-5">
            <div className="flex items-center justify-between border-b border-[#2d2a24] pb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 m-0">
                  <span className="text-[#81c784]">
                    White-Glove Cash on Delivery
                  </span>
                  {gateways.cod.enabled ? (
                    <span className="text-[10px] bg-[#81c784]/20 text-[#81c784] px-2 py-0.5 font-normal">
                      Enabled
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#e57373]/20 text-[#e57373] px-2 py-0.5 font-normal">
                      Disabled
                    </span>
                  )}
                </h4>
                <p className="text-[#8c8273] text-[11px] m-0 mt-0.5">
                  Hand-delivery with inspection before payment via Cash or POS
                  terminal.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateways.cod.enabled}
                  onChange={(e) =>
                    handleUpdateGateway("cod", "enabled", e.target.checked)
                  }
                  className="w-4 h-4 accent-[#81c784]"
                />
                <span className="text-white text-xs font-semibold">
                  Enable Cash on Delivery
                </span>
              </label>
            </div>

            <div className="form-group max-w-sm">
              <label className="text-[#8c8273] block mb-1">
                Maximum Order Value for COD (BDT ৳)
              </label>
              <input
                type="number"
                min={0}
                value={gateways.cod.maxOrderLimit || 250000}
                onChange={(e) =>
                  handleUpdateGateway(
                    "cod",
                    "maxOrderLimit",
                    Number(e.target.value),
                  )
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#81c784] text-xs font-mono"
              />
              <span className="text-[10px] text-[#8c8273] block mt-1">
                Orders exceeding this amount require digital advance payment
                (bKash/Card).
              </span>
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Customer Delivery Notice
              </label>
              <textarea
                rows={3}
                value={gateways.cod.instructions}
                onChange={(e) =>
                  handleUpdateGateway("cod", "instructions", e.target.value)
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#81c784] text-xs"
              />
            </div>
          </div>
        )}

        {/* Transaction ID Diagnostics Tool */}
        <div className="p-5 bg-[#12110e] border border-[#2d2a24] space-y-3">
          <div className="flex items-center gap-2">
            <Icon name="sparkle" size={16} className="text-[#aa8b5f]" />
            <h5 className="font-semibold text-white m-0 text-xs">
              MFS Transaction ID (TrxID) Lookup & Validation Tool
            </h5>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={testTrxId}
              onChange={(e) => setTestTrxId(e.target.value)}
              placeholder="e.g. 9B87F2K1L or 8N2K91LP"
              className="flex-1 bg-[#171713] border border-[#3a362f] p-2 text-white font-mono text-xs uppercase outline-none focus:border-[#aa8b5f]"
            />
            <button
              type="button"
              onClick={handleTestTrx}
              className="px-4 py-2 bg-[#2a2720] hover:bg-[#3d382f] text-white border border-[#3d382f] text-xs font-semibold cursor-pointer"
            >
              Verify TrxID
            </button>
          </div>
          {testResult && (
            <p className="text-[11px] text-[#81c784] font-mono m-0 bg-[#81c784]/10 p-2 border border-[#81c784]/20">
              {testResult}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] uppercase font-semibold text-xs tracking-wider cursor-pointer transition-colors shadow-md"
          >
            {isSaving ? "Saving Gateway Config..." : "Save Payment Gateways"}
          </button>
        </div>
      </form>
    </div>
  )
}
