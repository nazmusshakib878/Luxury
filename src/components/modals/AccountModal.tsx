import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    orders,
    appointments,
    formatPrice,
    showToast,
  } = useShop()

  const [activeTab, setActiveTab] = useState<"login" | "register" | "orders">(
    "orders",
  )
  const [email, setEmail] = useState("vip.client@aurelia.com.bd")
  const [password, setPassword] = useState("••••••••")
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  if (!isAccountOpen) return null

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setActiveTab("orders")
    showToast("Welcome back to your Aurélia Client Account.")
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setActiveTab("orders")
    showToast("Your Aurélia Client Account has been created.")
  }

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsAccountOpen(false)}
      aria-label="Account overlay"
    >
      <div
        className="luxury-modal p-8 max-w-[620px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close-corner"
          onClick={() => setIsAccountOpen(false)}
          aria-label="Close account view"
        >
          <Icon name="x" size={18} />
        </button>

        <p className="eyebrow !mb-2">
          <span></span> Maison Aurélia Privé
        </p>
        <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-6">
          Client Space
        </h2>

        {/* Tabs */}
        <div className="luxury-tabs">
          <button
            className={`luxury-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders & Bookings ({orders.length + appointments.length})
          </button>
          {!isLoggedIn ? (
            <>
              <button
                className={`luxury-tab ${
                  activeTab === "login" ? "active" : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </button>
              <button
                className={`luxury-tab ${
                  activeTab === "register" ? "active" : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </>
          ) : (
            <button
              className="luxury-tab text-[#9e2a2b]"
              onClick={() => {
                setIsLoggedIn(false)
                showToast("You have been signed out.", "info")
              }}
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Tab content: Orders & Bookings */}
        {activeTab === "orders" && (
          <div className="space-y-6 max-h-[460px] overflow-y-auto pr-1">
            {/* Appointments Section */}
            {appointments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8c6e49] mb-3">
                  Upcoming Salon Appointments
                </h3>
                {appointments.map((apt, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-[var(--line)] mb-2 text-xs"
                  >
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Salon {apt.city}</span>
                      <span className="text-[#8c6e49]">
                        {apt.date} · {apt.time}
                      </span>
                    </div>
                    <p className="text-[#726a5e] m-0">
                      Private Advisor: {apt.advisor}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8c6e49] mb-3">
                Order History
              </h3>
              {orders.length === 0 ? (
                <p className="text-sm text-[#7e766b] py-6 text-center">
                  You have not placed any orders yet.
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white border border-[var(--line)] mb-4 text-xs space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-[var(--line)] pb-3">
                      <div>
                        <span className="font-semibold block text-sm">
                          {order.id}
                        </span>
                        <span className="text-[#8c857a] text-[10px]">
                          {order.date}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-[#f7f5f0] text-[9px] font-semibold uppercase tracking-wider border border-[var(--line)] text-[#655d51]">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-12 object-cover"
                            />
                            <div>
                              <p className="m-0 font-medium">
                                {item.productName}
                              </p>
                              <span className="text-[#8c857a] text-[10px]">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <strong>
                            {formatPrice(item.price * item.quantity)}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-3 border-t border-[var(--line)] text-[#6c6559]">
                      <span>Tracking: {order.trackingNumber}</span>
                      <strong className="text-[var(--ink)] text-sm">
                        Total: {formatPrice(order.total)}
                      </strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab content: Login */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="button button-dark w-full mt-4">
              Sign In to Atelier Account
            </button>
          </form>
        )}

        {/* Tab content: Register */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" required placeholder="Shakib" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" required placeholder="Ahmed" />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="shakib.ahmed@aurelia.com.bd"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required minLength={8} />
            </div>
            <button type="submit" className="button button-dark w-full mt-4">
              Create Atelier Membership
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
