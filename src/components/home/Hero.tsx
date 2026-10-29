import React, { useState, useEffect } from "react"
import { Icon } from "../common/Icon"
import { heroSlides } from "../../data/heroSlides"

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <section className="hero" id="new">
      <div className="hero-copy">
        <p className="eyebrow">
          <span /> {slide.eyebrow}
        </p>
        <h1>
          {slide.titleLine1}
          <br />
          <em>{slide.titleEm}</em>
        </h1>
        <p className="hero-intro">{slide.intro}</p>
        <div className="hero-actions">
          <a className="button button-dark" href="#shop">
            Explore the collection <Icon name="arrow" size={17} />
          </a>
          <a className="text-link" href="#story">
            Discover our story <span>↗</span>
          </a>
        </div>
        <div className="hero-meta">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
              )
            }
            className="border-0 bg-transparent cursor-pointer p-1 text-[9px] tracking-[.13em] uppercase opacity-60 hover:opacity-100"
            aria-label="Previous slide"
          >
            0{currentSlide + 1}
          </button>
          <div
            className="hero-progress"
            role="progressbar"
            aria-valuenow={currentSlide + 1}
            aria-valuemin={1}
            aria-valuemax={heroSlides.length}
          >
            <i
              style={{
                width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
            }
            className="border-0 bg-transparent cursor-pointer p-1 text-[9px] tracking-[.13em] uppercase opacity-60 hover:opacity-100"
            aria-label="Next slide"
          >
            0{heroSlides.length}
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-orbit" />
        <img
          key={slide.image}
          src={slide.image}
          alt={`Aurélia editorial - ${slide.floatTitle}`}
          style={{ animation: "fadeIn 0.7s ease" }}
        />
        <div className="hero-float">
          <span className="float-label">{slide.floatLabel}</span>
          <strong>{slide.floatTitle}</strong>
          <a href="#shop">
            View the look <Icon name="arrow" size={15} />
          </a>
        </div>
        <p className="vertical-caption">PARIS — SPRING / SUMMER 2026</p>
      </div>
    </section>
  )
}
