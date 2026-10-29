import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const AccountModal: React.FC = () => {
  const navigate = useNavigate()
  const {
    isAccountOpen,
    setIsAccountOpen,
    orders,
    appointments,
    formatPrice,
    isAdmin,
    setIsAdminOpen,
    userProfile,
    loginUser,
    registerUser,
    logoutUser,
    showToast,
  } = useShop()

  const [activeTab, setActiveTab] = useState<"orders" | "login" | "register">(
    "orders",
  )
  const [email, setEmail] = useState(
    userProfile?.email || "nazmusshakib335@gmail.com",
  )
  const [password, setPassword] = useState("••••••••")
  const [firstName, setFirstName] = useState("Nazmus")
  const [lastName, setLastName] = useState("Shakib")
  const [regEmail, setRegEmail] = useState("nazmusshakib335@gmail.com")
  const [regPassword, setRegPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAccountOpen) return null

  const isLoggedIn = Boolean(userProfile)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await loginUser(email, password)
    setIsSubmitting(false)
    if (result.success) {
      if (result.isAdmin) {
        setIsAccountOpen(false)
        navigate("/atelier-admin")
      } else {
        setActiveTab("orders")
      }
    } else {
      showToast(
        result.error || "Authentication failed. Please verify credentials.",
        "error",
      )
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await registerUser(
      regEmail,
      regPassword,
      `${firstName} ${lastName}`.trim(),
    )
    setIsSubmitting(false)
    if (result.success) {
      setActiveTab("orders")
    } else {
      showToast(
        result.error || "Registration failed. Please check your details.",
        "error",
      )
    }
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

        <div className="flex justify-between items-center mb-1">
          <p className="eyebrow !mb-0">
            <span></span> Maison Aurélia Privé
          </p>
          {isAdmin && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#aa8b5f] bg-[#aa8b5f]/15 px-2 py-0.5 border border-[#aa8b5f]/40">
              👑 Master Admin
            </span>
          )}
        </div>

        <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-4">
          Client Space
        </h2>

        {/* Master Admin Portal Access Banner */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-[#171713] border border-[#aa8b5f] text-[#f7f5f0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#aa8b5f] font-bold block mb-0.5">
                👑 Executive Administrator Active
              </span>
              <p className="text-xs text-[#a19a8d] m-0">
                You have full access to manage products, pricing, orders, and
                salon bookings.
              </p>
            </div>
            <Link
              to="/atelier-admin"
              onClick={() => setIsAccountOpen(false)}
              className="px-4 py-2 bg-[#aa8b5f] text-[#171713] text-xs font-semibold uppercase tracking-wider hover:bg-[#c2a275] whitespace-nowrap cursor-pointer transition-colors block text-center"
            >
              Open Admin Portal ➔
            </Link>
          </div>
        )}

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
              onClick={() => logoutUser()}
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
                placeholder="nazmusshakib335@gmail.com"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="button button-dark w-full mt-4 cursor-pointer"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Account"}
            </button>

            {/* Quick Master Admin Login Button */}
            <div className="pt-4 border-t border-[var(--line)] text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail("nazmusshakib335@gmail.com")
                  loginUser("nazmusshakib335@gmail.com", "admin123")
                }}
                className="text-xs text-[#8c6e49] hover:underline font-semibold"
              >
                👑 Quick Access: Sign in as Master Admin
                (nazmusshakib335@gmail.com)
              </button>
            </div>
          </form>
        )}

        {/* Tab content: Register */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Nazmus"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Shakib"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="nazmusshakib335@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button button-dark w-full mt-4 cursor-pointer"
            >
              {isSubmitting
                ? "Creating Membership..."
                : "Create Atelier Membership"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
