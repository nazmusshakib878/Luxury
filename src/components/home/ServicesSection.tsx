import React from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const ServicesSection: React.FC = () => {
  const { setIsAppointmentOpen } = useShop()

  return (
    <section className="service-section" id="service">
      <div className="service-intro">
        <p className="eyebrow">The Aurélia promise</p>
        <h2>Luxury, considered.</h2>
      </div>
      <div className="service-grid">
        <article>
          <span>
            <Icon name="sparkle" />
          </span>
          <h3>Exquisite craftsmanship</h3>
          <p>
            Made by master artisans in France and Italy using heritage
            techniques and rare, certified materials.
          </p>
        </article>
        <article>
          <span>
            <Icon name="shield" />
          </span>
          <h3>Lifetime care</h3>
          <p>
            Complimentary annual conditioning, hardware polishing, and expert
            restoration for every treasured piece.
          </p>
        </article>
        <article>
          <span>
            <Icon name="bag" />
          </span>
          <h3>Signature delivery</h3>
          <p>
            Enclosed in signature linen boxes with silk ribbon. Complimentary
            white-glove courier delivery across Dhaka & all 64 districts.
          </p>
        </article>
        <article>
          <span>
            <Icon name="clock" />
          </span>
          <h3>Private service</h3>
          <p>
            Dedicated client advisors available 7 days a week. Private
            appointments available at our Gulshan & Banani salons.
          </p>
          <button
            onClick={() => setIsAppointmentOpen(true)}
            className="mt-4 border-0 bg-transparent text-[9px] uppercase tracking-[.14em] text-[#8c6e49] font-semibold cursor-pointer hover:underline flex items-center gap-2"
          >
            Schedule a salon visit <Icon name="arrow" size={13} />
          </button>
        </article>
      </div>
    </section>
  )
}
