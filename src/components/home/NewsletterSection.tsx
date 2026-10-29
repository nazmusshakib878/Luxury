import React, { useState, FormEvent } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useShop()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address", "error")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsSubscribed(true)
      showToast("Welcome to the maison. Check your inbox shortly.")
    }, 600)
  }

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletter-mark">A</div>
      <p className="eyebrow">Private correspondence</p>
      <h2>Join the world of Aurélia</h2>
      <p>
        Receive private access to new collections, atelier stories, invitations
        to salon previews, and considered inspiration.
      </p>
      {isSubscribed ? (
        <div className="success-message">
          <Icon name="check" /> Welcome to the maison. Your first private letter
          will arrive soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            aria-label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            required
            type="email"
            value={email}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Confirming..." : "Subscribe"}{" "}
            <Icon name="arrow" size={17} />
          </button>
        </form>
      )}
      <small>
        By subscribing, you agree to our privacy policy. Unsubscribe anytime.
      </small>
    </section>
  )
}
