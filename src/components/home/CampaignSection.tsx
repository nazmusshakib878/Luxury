import React from "react"
import { Icon } from "../common/Icon"

export const CampaignSection: React.FC = () => {
  return (
    <section className="campaign" id="story">
      <div className="campaign-image">
        <img
          src="https://images.unsplash.com/photo-1737188550231-cd8a16ec614b?auto=format&fit=crop&w=1400&q=90"
          alt="Aurélia artisan crafting leather goods by hand"
          loading="lazy"
        />
        <span>ARTISAN SERIES / 01</span>
      </div>
      <div className="campaign-copy">
        <p className="eyebrow">The art of making</p>
        <h2>
          Beauty in
          <br />
          <em>every detail.</em>
        </h2>
        <p>
          From the first line drawn in our Paris studio to the final stitch made
          by hand, every Aurélia piece is the result of time, patience, and
          human touch. We reject mass velocity in favor of heirloom longevity.
        </p>
        <div className="campaign-stat">
          <span>18</span>
          <p>
            Hours of meticulous handwork
            <br />
            in every signature piece
          </p>
        </div>
        <a className="button button-light" href="#newsletter">
          Inside our atelier <Icon name="arrow" size={17} />
        </a>
      </div>
    </section>
  )
}
