import React from "react"
import { Icon } from "../common/Icon"
import { galleryImages } from "../../data/gallery"

export const SocialGallery: React.FC = () => {
  return (
    <section className="social-section">
      <div className="section-heading social-heading">
        <div>
          <p className="eyebrow">@AURELIA.MAISON</p>
          <h2>A life, beautifully lived.</h2>
        </div>
        <a
          className="text-link"
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="instagram" size={17} /> Follow on Instagram
        </a>
      </div>
      <div className="gallery-grid">
        {galleryImages.map((image, index) => (
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className={`gallery-item gallery-${index + 1}`}
            key={image}
            aria-label="View Aurélia on Instagram"
          >
            <img
              src={image}
              alt={`Aurélia editorial moment ${index + 1}`}
              loading="lazy"
            />
            <span>
              <Icon name="instagram" />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
