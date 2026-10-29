import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Customer, UserOrder } from "../../types"

interface CustomersPageProps {
  customers: Customer[]
  orders: UserOrder[]
  formatPrice: (p: number) => string
  searchQuery: string
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  orders,
  formatPrice,
  searchQuery,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  )

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    )
  })

  // Find verified orders for selected customer
  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          (o.customerEmail &&
            o.customerEmail.toLowerCase() ===
              selectedCustomer.email.toLowerCase()) ||
          (o.customerName &&
            o.customerName.toLowerCase() ===
              selectedCustomer.fullName.toLowerCase()),
      )
    : []

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Total VIP Patrons
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-white my-1">
            {customers.length}
          </h3>
          <p className="text-[11px] text-[#aa8b5f] m-0">
            Verified client directory
          </p>
        </div>

        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Combined Patron Volume
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#aa8b5f] my-1">
            {formatPrice(
              customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0),
            )}
          </h3>
          <p className="text-[11px] text-[#70695c] m-0">
            Lifetime purchases recorded
          </p>
        </div>

        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Average Client Spend
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#81c784] my-1">
            {formatPrice(
              customers.length
                ? Math.round(
                    customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0) /
                      customers.length,
                  )
                : 0,
            )}
          </h3>
          <p className="text-[11px] text-[#70695c] m-0">
            Average order value per patron
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        <div className="p-4 border-b border-[#2d2a24] bg-[#12110e] flex justify-between items-center">
          <h3 className="font-['Cormorant_Garamond',serif] text-xl text-white m-0">
            Registered Patrons Directory
          </h3>
          <span className="text-xs text-[#8c8273]">
            {filteredCustomers.length} patron(s) displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4">Patron Name</th>
                <th className="p-4">Contact Information</th>
                <th className="p-4">Location</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Total Spend (BDT)</th>
                <th className="p-4">Member Since</th>
                <th className="p-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24211b]">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-[#1a1813] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#aa8b5f]/15 border border-[#aa8b5f]/40 flex items-center justify-center text-[#aa8b5f] font-['Cormorant_Garamond',serif] font-bold text-sm shrink-0">
                        {cust.fullName.charAt(0)}
                      </div>
                      <strong className="text-white font-medium block">
                        {cust.fullName}
                      </strong>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-white block">{cust.email}</span>
                    <span className="text-[#8c8273] text-[11px] font-mono">
                      {cust.phone || "—"}
                    </span>
                  </td>

                  <td className="p-4 text-[#a19a8d]">
                    {cust.city || "Dhaka, Bangladesh"}
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {cust.totalOrders} order(s)
                  </td>

                  <td className="p-4 font-['Cormorant_Garamond',serif] text-base text-[#aa8b5f] font-semibold">
                    {formatPrice(cust.totalSpent)}
                  </td>

                  <td className="p-4 text-[#8c8273]">{cust.registeredAt}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 border border-[#3a362f] hover:border-[#aa8b5f] text-[#aa8b5f] hover:bg-[#aa8b5f]/10 text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile & Purchase History Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-[#171713] border border-[#aa8b5f]/40 max-w-xl w-full p-6 text-[#f7f5f0] shadow-2xl relative animate-fadeIn rounded-xs space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-[#8c8273] hover:text-white cursor-pointer"
            >
              <Icon name="x" size={20} />
            </button>

            {/* Header Profile */}
            <div className="flex items-center gap-4 pb-4 border-b border-[#2d2a24]">
              <div className="w-14 h-14 rounded-full bg-[#aa8b5f]/20 border-2 border-[#aa8b5f] flex items-center justify-center text-[#aa8b5f] font-['Cormorant_Garamond',serif] font-bold text-2xl shrink-0">
                {selectedCustomer.fullName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f]">
                  VIP Patron Profile
                </span>
                <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
                  {selectedCustomer.fullName}
                </h3>
                <p className="text-xs text-[#8c8273] m-0">
                  Member since {selectedCustomer.registeredAt}
                </p>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="p-4 bg-[#1f1d17] border border-[#2d2a24] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Email Address:</span>
                <span className="text-white font-medium">
                  {selectedCustomer.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Phone Number:</span>
                <span className="text-white font-medium">
                  {selectedCustomer.phone || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c8273]">Delivery Location:</span>
                <span className="text-white font-medium">
                  {selectedCustomer.address ||
                    selectedCustomer.city ||
                    "Dhaka, Bangladesh"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2d2a24]">
                <span className="text-[#8c8273]">Total Verified Spend:</span>
                <strong className="text-[#aa8b5f]">
                  {formatPrice(selectedCustomer.totalSpent)}
                </strong>
              </div>
            </div>

            {/* Purchase History */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase font-bold tracking-widest text-[#aa8b5f] m-0">
                Order History ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <p className="text-xs text-[#8c8273] p-4 bg-[#1f1d17] text-center">
                  No direct orders found for this email in recent session queue.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customerOrders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 bg-[#1f1d17] border border-[#2d2a24] flex justify-between items-center text-xs"
                    >
                      <div>
                        <strong className="text-white font-mono block">
                          {o.id}
                        </strong>
                        <span className="text-[10px] text-[#8c8273]">
                          {o.date} · {o.items.length} item(s)
                        </span>
                      </div>
                      <div className="text-right">
                        <strong className="text-[#aa8b5f]">
                          {formatPrice(o.total)}
                        </strong>
                        <span className="text-[9px] block text-[#8c8273] uppercase">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 border border-[#3a362f] text-xs uppercase font-semibold text-[#8c8273] hover:text-white rounded-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
