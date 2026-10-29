import React from "react"
import { useShop } from "../../context/ShopContext"
import { Icon } from "./Icon"

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-pill toast-${toast.type || "success"}`}
        >
          <span className="toast-icon">
            <Icon name={toast.type === "error" ? "x" : "check"} size={14} />
          </span>
          <span className="toast-text">{toast.text}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close"
            aria-label="Dismiss notification"
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
