import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  isSupabaseConfigured,
  setSupabaseCredentials,
  testSupabaseConnection,
} from "../../lib/supabase"

export const ApiDatabasePage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(getSupabaseUrl())
  const [apiKey, setApiKey] = useState(getSupabaseAnonKey())
  const [testResult, setTestResult] = useState<{
    tested: boolean
    success?: boolean
    message?: string
  }>({ tested: false })
  const [isTesting, setIsTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTestApi = async () => {
    setIsTesting(true)
    setTestResult({ tested: false })
    const res = await testSupabaseConnection(apiUrl, apiKey)
    setTestResult({
      tested: true,
      success: res.success,
      message: res.message,
    })
    setIsTesting(false)
  }

  const handleSaveApi = () => {
    if (!apiUrl.trim() || !apiKey.trim()) {
      alert("Please provide both Supabase Project URL and Public Anon Key.")
      return
    }
    const success = setSupabaseCredentials(apiUrl, apiKey)
    if (success) {
      alert("Supabase credentials saved successfully. Reloading live store...")
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
          Supabase PostgreSQL Database & Real-Time API
        </h3>
        <p className="text-xs text-[#8c8273] m-0 mt-0.5">
          Manage your cloud PostgreSQL database connection, test live queries,
          and verify table schema.
        </p>
      </div>

      {/* Live Status Card */}
      <div
        className={`p-6 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isSupabaseConfigured()
            ? "bg-[#1b2b1b] border-[#4caf50]/40 text-[#a5d6a7]"
            : "bg-[#2b1f17] border-[#ff9800]/40 text-[#ffcc80]"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full animate-pulse ${
                isSupabaseConfigured() ? "bg-[#4caf50]" : "bg-[#ff9800]"
              }`}
            />
            <strong className="text-base font-semibold uppercase tracking-wider font-mono">
              {isSupabaseConfigured()
                ? "LIVE SUPABASE POSTGRESQL ACTIVE"
                : "OFFLINE FALLBACK MODE ACTIVE"}
            </strong>
          </div>
          <p className="text-xs mt-1.5 m-0 opacity-80">
            {isSupabaseConfigured()
              ? `Connected endpoint: ${getSupabaseUrl()}`
              : "No live credentials stored. Storefront and admin are running in fallback mode with local storage."}
          </p>
        </div>

        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1.5 border border-current rounded-xs">
          {isSupabaseConfigured() ? "Cloud PostgreSQL" : "Local Mock Storage"}
        </span>
      </div>

      {/* Connection Form */}
      <div className="p-6 bg-[#171713] border border-[#2d2a24] space-y-4 text-xs">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f]">
          Supabase API Credentials
        </h4>
        <p className="text-[#8c8273]">
          Obtain these from your Supabase Dashboard under{" "}
          <strong className="text-white">Project Settings ➔ API</strong>.
        </p>

        <div className="space-y-4 pt-2">
          <div className="form-group">
            <label className="text-[#8c8273] block mb-1">
              Project URL (VITE_SUPABASE_URL) *
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-[#12110e] border border-[#3a362f] p-3 text-white outline-none focus:border-[#aa8b5f]"
            />
          </div>

          <div className="form-group">
            <label className="text-[#8c8273] block mb-1">
              Public Anon Key (VITE_SUPABASE_ANON_KEY) *
            </label>
            <textarea
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#12110e] border border-[#3a362f] p-3 text-white font-mono outline-none focus:border-[#aa8b5f]"
            />
          </div>

          {testResult.tested && (
            <div
              className={`p-3 text-xs border ${
                testResult.success
                  ? "bg-[#1b2b1b] border-[#4caf50]/40 text-[#81c784]"
                  : "bg-[#2b1717] border-[#e53935]/40 text-[#ef9a9a]"
              }`}
            >
              <strong>
                {testResult.success
                  ? "✓ Verification Passed: "
                  : "✕ Verification Failed: "}
              </strong>
              {testResult.message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestApi}
              className="px-5 py-2.5 bg-[#1f1d17] border border-[#aa8b5f] text-[#aa8b5f] hover:bg-[#aa8b5f]/10 text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              {isTesting ? "Pinging Database..." : "🔍 Ping & Test Connection"}
            </button>
            <button
              type="button"
              onClick={handleSaveApi}
              className="px-6 py-2.5 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              💾 Save Credentials & Connect
            </button>
          </div>
        </div>
      </div>

      {/* SQL Migration Quick Reference */}
      <div className="p-6 bg-[#171713] border border-[#2d2a24] text-xs space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#aa8b5f] m-0">
            Database Migration Reference (supabase/schema.sql)
          </h4>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                "Open supabase/schema.sql in repository and run in Supabase SQL Editor.",
              )
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="text-[10px] text-[#aa8b5f] hover:underline cursor-pointer uppercase font-bold"
          >
            {copied ? "✓ Copied" : "Copy Path Reference"}
          </button>
        </div>
        <p className="text-[#8c8273] m-0">
          The database script is saved locally at{" "}
          <code className="text-[#aa8b5f]">supabase/schema.sql</code>. It
          includes all 10 tables, triggers, and Row Level Security policies.
        </p>
      </div>
    </div>
  )
}
