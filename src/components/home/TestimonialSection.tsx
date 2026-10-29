import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { testimonials } from "../../data/testimonials"

export const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="testimonial" id="testimonials">
      <span className="quote-mark">
        <Icon name="quote" size={40} />
      </span>
      <p className="eyebrow">The journal — words from our community</p>

      <blockquote key={current.id} style={{ animation: "fadeIn 0.4s ease" }}>
        {current.quote}
      </blockquote>

      <div className="testimonial-person">
        <img src={current.image} alt={current.author} />
        <div>
          <strong>{current.author}</strong>
          <span>{current.role}</span>
        </div>
      </div>

      <div className="testimonial-nav">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          title="Previous quote"
        >
          ←
        </button>
        <span>
          0{currentIndex + 1} / 0{testimonials.length}
        </span>
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          title="Next quote"
        >
          →
        </button>
      </div>
    </section>
  )
}
