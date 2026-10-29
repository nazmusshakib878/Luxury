import React from "react"
import { Icon } from "../../components/common/Icon"
import { AppointmentData } from "../../types"

interface SalonBookingsPageProps {
  appointments: AppointmentData[]
  onUpdateStatus: (emailOrId: string, status: string) => Promise<boolean>
}

export const SalonBookingsPage: React.FC<SalonBookingsPageProps> = ({
  appointments,
  onUpdateStatus,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-[#171713] p-6 border border-[#2d2a24]">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Private Salon & Atelier Styling Reservations
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Manage bespoke viewings scheduled at our Gulshan 2 and Banani
            private lounges.
          </p>
        </div>

        <span className="text-xs text-[#aa8b5f] font-mono font-bold px-3 py-1.5 bg-[#12110e] border border-[#3a362f]">
          {appointments.length} Total Bookings
        </span>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-12 text-center bg-[#171713] border border-[#2d2a24]">
            <Icon
              name="calendar"
              size={32}
              className="text-[#8c8273] mx-auto mb-2"
            />
            <h4 className="font-['Cormorant_Garamond',serif] text-xl text-white m-0">
              No private appointments scheduled
            </h4>
            <p className="text-xs text-[#70695c] mt-1">
              New client salon bookings from the boutique storefront will appear
              here.
            </p>
          </div>
        ) : (
          appointments.map((apt, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#171713] border border-[#2d2a24] hover:border-[#3d382e] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-white text-sm font-medium">
                    {apt.clientName || "VIP Patron"}
                  </strong>
                  <span className="text-[#aa8b5f] text-xs">· {apt.city}</span>
                </div>
                <p className="text-[#8c8273] m-0">
                  Phone: <strong className="text-white">{apt.phone}</strong> ·
                  Email: {apt.email}
                </p>
                <p className="text-[#aa8b5f] m-0 mt-1 flex items-center gap-1.5">
                  <Icon name="clock" size={13} />
                  <span>
                    Scheduled: <strong>{apt.date}</strong> at{" "}
                    <strong>{apt.time}</strong> (Advisor: {apt.advisor})
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] px-2.5 py-0.5 rounded-xs font-bold uppercase tracking-wider border ${
                    apt.status === "Completed"
                      ? "bg-[#4caf50]/15 text-[#81c784] border-[#4caf50]/40"
                      : apt.status === "Cancelled"
                        ? "bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/40"
                        : "bg-[#aa8b5f]/15 text-[#aa8b5f] border-[#aa8b5f]/40"
                  }`}
                >
                  {apt.status || "Confirmed"}
                </span>

                {apt.status !== "Completed" && (
                  <button
                    onClick={() => onUpdateStatus(apt.email, "Completed")}
                    className="px-3 py-1 bg-[#4caf50]/15 hover:bg-[#4caf50] text-[#81c784] hover:text-[#171713] border border-[#4caf50]/40 text-[10px] uppercase font-semibold tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    Mark Done
                  </button>
                )}

                {apt.status !== "Cancelled" && (
                  <button
                    onClick={() => onUpdateStatus(apt.email, "Cancelled")}
                    className="px-3 py-1 bg-[#e53935]/15 hover:bg-[#e53935] text-[#ef5350] hover:text-white border border-[#e53935]/40 text-[10px] uppercase font-semibold tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
