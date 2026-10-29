import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Icon } from "../components/common/Icon"
import { useShop } from "../context/ShopContext"

interface AdminLoginProps {
  onSuccess: () => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { loginUser } = useShop()
  const [email, setEmail] = useState("nazmusshakib335@gmail.com")
  const [password, setPassword] = useState("admin123456")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    try {
      const res = await loginUser(email, password)
      setIsLoading(false)

      if (res.success && res.isAdmin) {
        onSuccess()
      } else if (res.success && !res.isAdmin) {
        setErrorMsg(
          "Access Denied: This account is registered as a customer and lacks administrator authorization.",
        )
      } else {
        setErrorMsg(
          res.error || "Authentication failed. Please verify credentials.",
        )
      }
    } catch (err: any) {
      setIsLoading(false)
      setErrorMsg(
        err.message || "An unexpected error occurred during authentication.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f7f5f0] flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full pt-4">
        <Link
          to="/"
          className="text-xs uppercase font-bold tracking-widest text-[#aa8b5f] flex items-center gap-2 hover:text-[#c2a275] transition-colors"
        >
          <Icon name="arrow" size={14} className="rotate-180" />
          <span>Return to Boutique Storefront</span>
        </Link>

        <span className="text-[10px] uppercase font-bold tracking-widest text-[#70695c] border border-[#2d2a24] px-2.5 py-1">
          Restricted Atelier Area
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#171713] border border-[#3a362f] p-8 md:p-10 shadow-2xl relative animate-fadeIn rounded-xs">
          {/* Brand Crest */}
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#aa8b5f] block mb-1">
              Maison Aurélia Paris
            </span>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl text-white m-0 font-medium">
              Atelier Administrator Access
            </h2>
            <p className="text-xs text-[#8c8273] mt-2 mb-0">
              Sign in with your authorized administrator credentials to manage
              boutique operations.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="p-3.5 mb-6 bg-[#2b1717] border border-[#e53935]/40 text-[#ef9a9a] text-xs leading-relaxed animate-fadeIn">
              <strong>Authentication Error: </strong> {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="form-group">
              <label className="text-[#8c8273] uppercase tracking-wider text-[10px] font-bold block mb-1.5">
                Administrator Email Address
              </label>
              <div className="flex items-center bg-[#100f0c] border border-[#332f27] px-3.5 py-2.5 focus-within:border-[#aa8b5f] transition-colors rounded-xs">
                <Icon
                  name="user"
                  size={16}
                  className="text-[#8c8273] mr-2 shrink-0"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nazmusshakib335@gmail.com"
                  className="w-full bg-transparent text-white outline-none text-xs"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="text-[#8c8273] uppercase tracking-wider text-[10px] font-bold block mb-1.5">
                Secret Access Key / Password
              </label>
              <div className="flex items-center bg-[#100f0c] border border-[#332f27] px-3.5 py-2.5 focus-within:border-[#aa8b5f] transition-colors rounded-xs">
                <Icon
                  name="lock"
                  size={16}
                  className="text-[#8c8273] mr-2 shrink-0"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8c8273] hover:text-white shrink-0 ml-2 cursor-pointer"
                  title="Toggle password view"
                >
                  <Icon name={showPassword ? "eye" : "eye"} size={14} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-md mt-2"
            >
              {isLoading
                ? "Verifying Authorization..."
                : "Enter Atelier Backoffice ➔"}
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="mt-8 pt-6 border-t border-[#2d2a24] text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("nazmusshakib335@gmail.com")
                setPassword("admin123456")
                loginUser("nazmusshakib335@gmail.com", "admin123456").then(
                  (r) => {
                    if (r.isAdmin) onSuccess()
                  },
                )
              }}
              className="text-[11px] text-[#aa8b5f] hover:underline cursor-pointer font-semibold block mx-auto"
            >
              👑 One-Click Login as Authorized Master Admin
              (nazmusshakib335@gmail.com)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-[#554e44] max-w-md mx-auto">
        Aurélia Maison Paris · Master Backoffice System · All access attempts
        logged under PostgreSQL Row Level Security.
      </div>
    </div>
  )
}
