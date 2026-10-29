import React from "react"
import { Icon } from "../../components/common/Icon"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#171713] border border-[#3a362f] max-w-md w-full p-6 text-[#f7f5f0] shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#8c8273] hover:text-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <Icon name="x" size={18} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? "bg-[#e53935]/15 text-[#e53935] border border-[#e53935]/30"
                : "bg-[#aa8b5f]/15 text-[#aa8b5f] border border-[#aa8b5f]/30"
            }`}
          >
            <Icon name={isDestructive ? "trash" : "shield"} size={20} />
          </div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-[#f7f5f0] m-0">
            {title}
          </h3>
        </div>

        <p className="text-xs text-[#a19a8d] leading-relaxed mb-6">{message}</p>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#2d2a24]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#3a362f] text-[#a19a8d] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              isDestructive
                ? "bg-[#e53935] hover:bg-[#c62828] text-white"
                : "bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
