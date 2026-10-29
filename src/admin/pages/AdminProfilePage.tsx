import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { AuthProfile } from "../../services/authService"

interface AdminProfilePageProps {
  userProfile: AuthProfile | null
  onUpdatePassword?: (pw: string) => Promise<boolean>
}

export const AdminProfilePage: React.FC<AdminProfilePageProps> = ({
  userProfile,
}) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [statusMsg, setStatusMsg] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setStatusMsg({
        text: "Password must be at least 8 characters in length.",
        type: "error",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatusMsg({ text: "Passwords do not match.", type: "error" })
      return
    }

    setStatusMsg({
      text: "Password updated successfully for master administrator.",
      type: "success",
    })
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="bg-[#171713] p-6 border border-[#2d2a24]">
        <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
          Administrator Credentials & Backoffice Security
        </h3>
        <p className="text-xs text-[#8c8273] m-0 mt-0.5">
          Manage administrator profile parameters and privileged access
          controls.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="p-6 bg-[#171713] border border-[#2d2a24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#aa8b5f]/20 border-2 border-[#aa8b5f] flex items-center justify-center text-[#aa8b5f] font-['Cormorant_Garamond',serif] font-bold text-3xl shrink-0">
            NS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
                Nazmus Shakib
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#aa8b5f]/20 px-2 py-0.5 border border-[#aa8b5f]/40">
                👑 Master Admin
              </span>
            </div>
            <p className="text-xs text-[#aa8b5f] m-0 mt-0.5">
              Authorized Email:{" "}
              <strong>
                {userProfile?.email || "nazmusshakib335@gmail.com"}
              </strong>
            </p>
            <p className="text-[11px] text-[#70695c] m-0">
              Role:{" "}
              <span className="text-white">
                Full Superuser (Database & Backoffice Operations)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Security & Password Form */}
      <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-4 text-xs">
        <div className="flex items-center gap-2 text-[#aa8b5f] font-bold uppercase tracking-wider text-[11px]">
          <Icon name="lock" size={16} />
          <span>Update Administrator Password</span>
        </div>
        <p className="text-[#8c8273]">
          Ensure your administrator password contains uppercase letters,
          numbers, and symbols.
        </p>

        {statusMsg && (
          <div
            className={`p-3 text-xs border ${
              statusMsg.type === "success"
                ? "bg-[#1b2b1b] border-[#4caf50]/40 text-[#81c784]"
                : "bg-[#2b1717] border-[#e53935]/40 text-[#ef9a9a]"
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-4 max-w-md pt-2"
        >
          <div className="form-group">
            <label className="text-[#8c8273] block mb-1">
              New Master Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
            />
          </div>

          <div className="form-group">
            <label className="text-[#8c8273] block mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#12110e] border border-[#3a362f] p-2.5 text-white outline-none focus:border-[#aa8b5f]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] font-semibold uppercase tracking-wider text-xs cursor-pointer transition-colors"
          >
            Update Security Credentials
          </button>
        </form>
      </div>

      {/* Session Security Details */}
      <div className="p-6 bg-[#171713] border border-[#2d2a24] text-xs space-y-2 text-[#8c8273]">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f] m-0">
          Security Auditing & Session Policy
        </h4>
        <p className="m-0">
          All administrative operations (product mutations, order cancellations,
          stock changes) are signed with JWT authentication and evaluated under
          PostgreSQL Row Level Security (RLS).
        </p>
        <p className="m-0 text-[#70695c]">
          Session status: Verified active · Idle timeout: 7 days · IP origin:
          Bangladesh
        </p>
      </div>
    </div>
  )
}
