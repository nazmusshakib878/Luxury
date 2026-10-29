import React, { useState } from "react"
import { Icon } from "../common/Icon"
import { useShop } from "../../context/ShopContext"

export const AppointmentModal: React.FC = () => {
  const { isAppointmentOpen, setIsAppointmentOpen, bookAppointment } = useShop()

  const [city, setCity] = useState("Dhaka — Gulshan 2 Salon")
  const [date, setDate] = useState("2026-11-15")
  const [time, setTime] = useState("14:30")
  const [advisor, setAdvisor] = useState("Haute Maroquinerie Specialist")
  const [clientName, setClientName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [booked, setBooked] = useState(false)

  if (!isAppointmentOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    bookAppointment({
      city,
      date,
      time,
      advisor,
      clientName,
      email,
      phone,
      notes,
    })
    setBooked(true)
  }

  const handleClose = () => {
    setIsAppointmentOpen(false)
    setBooked(false)
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      aria-label="Private Appointment Booking"
    >
      <div
        className="luxury-modal p-8 max-w-[640px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close-corner"
          onClick={handleClose}
          aria-label="Close booking modal"
        >
          <Icon name="x" size={18} />
        </button>

        {booked ? (
          <div className="text-center py-10 space-y-4">
            <span className="inline-flex p-4 rounded-full bg-[rgba(170,139,95,0.15)] text-[var(--gold)]">
              <Icon name="check" size={32} />
            </span>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl m-0">
              Your Salon Appointment is Reserved
            </h2>
            <p className="text-xs text-[#756d62] max-w-[420px] mx-auto leading-relaxed">
              We look forward to welcoming you, {clientName}. An invitation and
              private access card have been dispatched to {email}.
            </p>
            <div className="p-4 bg-white border border-[var(--line)] max-w-sm mx-auto text-xs text-left space-y-1">
              <div>
                <strong>Salon:</strong> {city}
              </div>
              <div>
                <strong>Date & Time:</strong> {date} at {time}
              </div>
              <div>
                <strong>Host:</strong> {advisor}
              </div>
            </div>
            <button className="button button-dark mt-4" onClick={handleClose}>
              Return to Maison
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="eyebrow !mb-2">
              <span></span> Private Salon Appointments
            </p>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl mb-2">
              Book a Private Consultation
            </h2>
            <p className="text-xs text-[#7a7368] mb-6">
              Experience the craftsmanship of Aurélia in an intimate, private
              salon environment with champagne service and personalized bespoke
              guidance.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Salon Location</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option>Dhaka — Gulshan 2 Salon</option>
                  <option>Dhaka — Banani 11 Atelier</option>
                  <option>Chattogram — Nasirabad Salon</option>
                  <option>Paris — Place Vendôme</option>
                </select>
              </div>

              <div className="form-group">
                <label>Advisory Specialization</label>
                <select
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                >
                  <option>Haute Maroquinerie (Leather Goods)</option>
                  <option>Les Parfums Privés (Fragrance Sommelier)</option>
                  <option>Bespoke Color & Monogramming</option>
                  <option>Private Archival Viewing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option>11:00 AM</option>
                  <option>14:30 PM</option>
                  <option>16:00 PM</option>
                  <option>18:30 PM (Private Evening)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Client Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nazmus Shakib"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="shakib@aurelia.com.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Telephone (for chauffeur / concierge)</label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1700 000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Special Requests or Desired Pieces to View</label>
                <textarea
                  rows={2}
                  placeholder="Mention specific bags, fragrance notes, or dietary preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="button button-dark w-full mt-4">
              Confirm Private Reservation <Icon name="arrow" size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
