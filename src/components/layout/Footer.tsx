import React from "react"
import { Icon } from "../common/Icon"
import { Brand } from "./Navbar"
import { useShop } from "../../context/ShopContext"

export const Footer: React.FC = () => {
  const { currency, setIsCurrencyModalOpen, setIsAppointmentOpen } = useShop()

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand />
          <p>
            Contemporary objects of desire,
            <br />
            created in Paris.
          </p>
          <div className="social-links">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Aurélia Instagram"
            >
              Instagram
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Aurélia Pinterest"
            >
              Pinterest
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Aurélia TikTok"
            >
              TikTok
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h3>Collections</h3>
            <a href="#shop">New arrivals</a>
            <a href="#shop">Leather goods</a>
            <a href="#shop">Fragrance</a>
            <a href="#shop">Silk & accessories</a>
          </div>
          <div>
            <h3>Client services</h3>
            <a href="mailto:concierge@aurelia.com.bd">Contact concierge</a>
            <a href="#service">Delivery & returns</a>
            <button
              onClick={() => setIsAppointmentOpen(true)}
              className="bg-transparent border-0 text-[#e3e1da] p-0 font-['Cormorant_Garamond',serif] text-[15px] cursor-pointer hover:underline mb-[13px] block text-left"
            >
              Book an appointment
            </button>
            <a href="#service">Care guide</a>
          </div>
          <div>
            <h3>La Maison</h3>
            <a href="#story">Our story</a>
            <a href="#story">Craftsmanship</a>
            <a href="#testimonials">Journal</a>
            <a href="#story">Boutiques</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Aurélia Maison Paris. All rights reserved.</span>
        <div>
          <a href="#top">Privacy Policy</a>
          <a href="#top">Terms of Service</a>
          <a href="#top">Accessibility</a>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-[8px] tracking-[.14em] uppercase text-[#c8ab80] hover:text-white transition-colors border-0 bg-transparent cursor-pointer p-0"
          >
            Back to top <Icon name="arrow-up" size={12} />
          </button>
          <button
            onClick={() => setIsCurrencyModalOpen(true)}
            aria-label="Change currency and region"
          >
            {currency.label} <Icon name="chevron" size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
