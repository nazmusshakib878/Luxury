import React, { useState, useEffect } from "react"
import { Icon } from "./Icon"

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top-btn"
      aria-label="Scroll back to top"
      title="Return to top"
    >
      <Icon name="arrow-up" size={17} />
      <span className="scroll-to-top-label">Top</span>
    </button>
  )
}

