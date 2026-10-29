import React, { useState } from "react"
import { StoreSettings } from "../../types"

interface StoreSettingsPageProps {
  settings: StoreSettings
  onSaveSettings: (settings: StoreSettings) => Promise<boolean>
}

export const StoreSettingsPage: React.FC<StoreSettingsPageProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSaveSettings(formData)
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
          Store Configuration & Operational Parameters
        </h3>
        <p className="text-xs text-[#8c8273] m-0 mt-0.5">
          Configure localized business rules, contact details, and courier
          delivery rates across Bangladesh.
        </p>
      </div>

      {/* Payment Gateways Banner */}
      <div className="p-4 bg-[#1b1914] border border-[#aa8b5f]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[#aa8b5f] font-bold block">
            Looking for bKash, Nagad & Card Gateways?
          </span>
          <span className="text-[#8c8273] text-[11px]">
            Configure merchant numbers, TrxID validation, and live payment
            gateways under the dedicated Payment Gateways panel.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#81c784] bg-[#81c784]/15 px-3 py-1.5 border border-[#81c784]/30 shrink-0">
          bKash & Cards Active
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* General Store Details */}
        <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f]">
            Atelier Identity & Concierge Contact
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Official Store Name
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Concierge Support Email
              </label>
              <input
                type="email"
                required
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                VIP Concierge Phone / WhatsApp
              </label>
              <input
                type="text"
                required
                value={formData.supportPhone}
                onChange={(e) =>
                  setFormData({ ...formData, supportPhone: e.target.value })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Primary Physical Atelier Location
              </label>
              <input
                type="text"
                required
                value={formData.storeAddress}
                onChange={(e) =>
                  setFormData({ ...formData, storeAddress: e.target.value })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>
          </div>
        </div>

        {/* Courier & Delivery Charges in Bangladesh */}
        <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f]">
            Nationwide Courier & Delivery Charges (BDT ৳)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Delivery Charge: Inside Dhaka (BDT)
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.deliveryChargeDhaka}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryChargeDhaka: Number(e.target.value),
                  })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Delivery Charge: Outside Dhaka (BDT)
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.deliveryChargeOutside}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryChargeOutside: Number(e.target.value),
                  })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] block mb-1">
                Free White-Glove Threshold (BDT)
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
              />
            </div>
          </div>
        </div>

        {/* Inventory Rules */}
        <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f]">
            Inventory Warning Threshold
          </h4>

          <div className="max-w-xs">
            <label className="text-[#8c8273] block mb-1">
              Low-Stock Alert Trigger (Units)
            </label>
            <input
              type="number"
              min={1}
              required
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lowStockThreshold: Number(e.target.value),
                })
              }
              className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
            />
            <span className="text-[10px] text-[#8c8273] block mt-1">
              Products with stock at or below this number trigger executive
              alerts.
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] uppercase font-semibold text-xs tracking-wider cursor-pointer transition-colors"
          >
            {isSaving ? "Saving Settings..." : "Save Store Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
