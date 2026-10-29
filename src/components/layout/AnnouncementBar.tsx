import React from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const AnnouncementBar: React.FC = () => {
  const { setIsAppointmentOpen } = useShop()

  return (
    <div className="announcement">
      <span>Complimentary nationwide delivery & returns across Bangladesh</span>
      <button
        onClick={() => setIsAppointmentOpen(true)}
        className="announcement-center border-0 bg-transparent text-white cursor-pointer hover:underline uppercase text-[9px] tracking-[.14em]"
        style={{ letterSpacing: ".14em" }}
      >
        Private appointments now available in Dhaka (Gulshan) & Paris
      </button>
      <a href="#newsletter">
        Join the maison <Icon name="arrow" size={14} />
      </a>
    </div>
  )
}
