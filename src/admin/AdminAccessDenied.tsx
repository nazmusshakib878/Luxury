import React from "react"
import { Icon } from "../components/common/Icon"
import { useShop } from "../context/ShopContext"

export const AdminAccessDenied: React.FC = () => {
  const { logoutUser, userProfile } = useShop()

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f7f5f0] flex flex-col justify-between p-6">
      <div className="max-w-5xl mx-auto w-full pt-4">
        <a
          href="/"
          className="text-xs uppercase font-bold tracking-widest text-[#aa8b5f] flex items-center gap-2 hover:text-[#c2a275]"
        >
          <Icon name="arrow" size={14} className="rotate-180" />
          <span>Return to Boutique Storefront</span>
        </a>
      </div>

      <div className="max-w-md w-full mx-auto my-auto text-center p-8 bg-[#171713] border border-[#e53935]/40 shadow-2xl rounded-xs space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#e53935]/15 border border-[#e53935]/30 text-[#ef5350] mx-auto flex items-center justify-center">
          <Icon name="lock" size={28} />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest text-[#e57373] block">
          403 Access Denied
        </span>

        <h2 className="font-['Cormorant_Garamond',serif] text-3xl text-white m-0">
          Restricted Backoffice Area
        </h2>

        <p className="text-xs text-[#a19a8d] leading-relaxed">
          The account{" "}
          <strong className="text-white font-mono">{userProfile?.email}</strong>{" "}
          is registered as a customer and does not possess administrator
          permissions to access this management dashboard.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="px-5 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] font-semibold uppercase tracking-wider text-xs transition-colors rounded-xs text-center"
          >
            Go to Customer Boutique
          </a>
          <button
            onClick={() => logoutUser()}
            className="px-5 py-2.5 border border-[#3a362f] text-[#8c8273] hover:text-white uppercase font-semibold text-xs rounded-xs cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-[#554e44]">
        Aurélia Maison Paris · Unauthorized administration requests are logged.
      </div>
    </div>
  )
}
