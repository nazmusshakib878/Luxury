import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { UserOrder } from "../../types"
import { ConfirmationModal } from "../components/ConfirmationModal"

interface OrdersPageProps {
  orders: UserOrder[]
  formatPrice: (price: number) => string
  onUpdateOrderStatus: (
    orderId: string,
    status: UserOrder["status"],
  ) => Promise<boolean>
  searchQuery: string
  initialStatusFilter?: string
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  formatPrice,
  onUpdateOrderStatus,
  searchQuery,
  initialStatusFilter = "all",
}) => {
  const [activeStatusTab, setActiveStatusTab] =
    useState<string>(initialStatusFilter)
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState<UserOrder | null>(
    null,
  )

  // Cancel order confirmation dialog
  const [cancelOrderTarget, setCancelOrderTarget] = useState<string | null>(
    null,
  )

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName &&
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
      (o.trackingNumber &&
        o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))

    let matchesStatus = true
    if (activeStatusTab !== "all") {
      const statusLower = (o.status || "").toLowerCase()
      if (activeStatusTab === "pending")
        matchesStatus = statusLower.includes("pending")
      else if (activeStatusTab === "confirmed")
        matchesStatus = statusLower.includes("confirmed")
      else if (activeStatusTab === "processing")
        matchesStatus =
          statusLower.includes("process") || statusLower.includes("atelier")
      else if (activeStatusTab === "dispatched")
        matchesStatus =
          statusLower.includes("dispatch") || statusLower.includes("ship")
      else if (activeStatusTab === "delivered")
        matchesStatus = statusLower.includes("deliver")
      else if (activeStatusTab === "cancelled")
        matchesStatus = statusLower.includes("cancel")
      else if (activeStatusTab === "refunded")
        matchesStatus = statusLower.includes("refund")
    }

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("deliver")) {
      return "bg-[#4caf50]/15 text-[#81c784] border-[#4caf50]/40"
    } else if (s.includes("cancel") || s.includes("refund")) {
      return "bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/40"
    } else if (s.includes("dispatch") || s.includes("ship")) {
      return "bg-[#29b6f6]/15 text-[#81d4fa] border-[#29b6f6]/40"
    } else if (s.includes("process") || s.includes("atelier")) {
      return "bg-[#aa8b5f]/15 text-[#d4af37] border-[#aa8b5f]/40"
    }
    return "bg-[#ff9800]/15 text-[#ffb74d] border-[#ff9800]/40"
  }

  const handleConfirmCancel = async () => {
    if (cancelOrderTarget) {
      await onUpdateOrderStatus(cancelOrderTarget, "Cancelled")
      setCancelOrderTarget(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Status Tabs Navigation */}
      <div className="bg-[#171713] border border-[#2d2a24] p-2 flex flex-wrap gap-2 text-xs">
        {[
          { id: "all", label: "All Orders", count: orders.length },
          {
            id: "pending",
            label: "Pending",
            count: orders.filter((o) =>
              (o.status || "").toLowerCase().includes("pending"),
            ).length,
          },
          {
            id: "processing",
            label: "In Atelier / Processing",
            count: orders.filter(
              (o) =>
                (o.status || "").toLowerCase().includes("process") ||
                (o.status || "").toLowerCase().includes("atelier"),
            ).length,
          },
          {
            id: "dispatched",
            label: "Dispatched (Courier)",
            count: orders.filter((o) =>
              (o.status || "").toLowerCase().includes("dispatch"),
            ).length,
          },
          {
            id: "delivered",
            label: "Delivered",
            count: orders.filter((o) =>
              (o.status || "").toLowerCase().includes("deliver"),
            ).length,
          },
          {
            id: "cancelled",
            label: "Cancelled",
            count: orders.filter((o) =>
              (o.status || "").toLowerCase().includes("cancel"),
            ).length,
          },
          {
            id: "refunded",
            label: "Returns / Refunds",
            count: orders.filter((o) =>
              (o.status || "").toLowerCase().includes("refund"),
            ).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-3 py-2 rounded-xs font-semibold uppercase tracking-wider text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStatusTab === tab.id
                ? "bg-[#aa8b5f] text-[#171713]"
                : "text-[#8c8273] hover:text-white hover:bg-[#201d17]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                activeStatusTab === tab.id
                  ? "bg-[#171713] text-[#aa8b5f]"
                  : "bg-[#2d2a24] text-[#8c8273]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Icon
              name="bag"
              size={32}
              className="text-[#8c8273] mx-auto mb-2"
            />
            <h4 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
              No orders found
            </h4>
            <p className="text-xs text-[#70695c] mt-1">
              There are currently no customer orders matching this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status & Transition</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#24211b]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#1a1813] transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <strong className="text-white block font-mono">
                        {order.id}
                      </strong>
                      <span className="text-[11px] text-[#8c8273]">
                        {order.date}
                      </span>
                      <span className="text-[10px] text-[#70695c] block font-mono mt-0.5">
                        Track: {order.trackingNumber}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <span className="text-white font-medium block">
                        {order.customerName || "Valued Customer"}
                      </span>
                      <span className="text-[11px] text-[#aa8b5f] block">
                        {order.customerPhone || "017XXXXXXXX"}
                      </span>
                      <span className="text-[10px] text-[#8c8273] block truncate max-w-xs">
                        {order.shippingCity || "Dhaka, Bangladesh"}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt=""
                            className="w-8 h-10 object-cover border border-[#2d2a24] shrink-0"
                            title={`${item.productName} (x${item.quantity})`}
                          />
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] text-[#8c8273] px-1 bg-[#22201b] border border-[#2d2a24]">
                            +{order.items.length - 2}
                          </span>
                        )}
                        <span className="text-[#a19a8d] text-[11px] ml-1">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                          piece(s)
                        </span>
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="p-4">
                      <strong className="text-sm font-['Cormorant_Garamond',serif] text-[#aa8b5f] block">
                        {formatPrice(order.total)}
                      </strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-white font-medium">
                          {order.paymentMethod || "bKash"}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-xs font-semibold uppercase ${
                            order.paymentStatus === "paid"
                              ? "bg-[#81c784]/20 text-[#81c784]"
                              : "bg-[#f7941d]/20 text-[#f7941d]"
                          }`}
                        >
                          {order.paymentStatus || "Paid"}
                        </span>
                      </div>
                      {order.paymentDetails?.transactionId && (
                        <span className="text-[10px] text-[#aa8b5f] font-mono block mt-0.5">
                          Trx: {order.paymentDetails.transactionId}
                        </span>
                      )}
                    </td>

                    {/* Status Changer */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-xs border text-center ${getStatusBadge(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(
                              order.id,
                              e.target.value as UserOrder["status"],
                            )
                          }
                          className="text-[10px] bg-[#12110e] border border-[#3a362f] text-[#aa8b5f] px-2 py-1 rounded-xs outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="In Atelier">In Atelier</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 border border-[#3a362f] hover:border-[#aa8b5f] text-[#aa8b5f] hover:bg-[#aa8b5f]/10 text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => setShowInvoiceModal(order)}
                          className="p-1.5 border border-[#3a362f] hover:border-white text-[#8c8273] hover:text-white rounded-xs transition-colors cursor-pointer"
                          title="Print Customer Invoice"
                        >
                          <Icon name="printer" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[10000] flex justify-end bg-black/80 backdrop-blur-xs"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg bg-[#171713] border-l border-[#2d2a24] h-full p-6 text-[#f7f5f0] overflow-y-auto space-y-6 custom-scrollbar animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#2d2a24]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f]">
                  Order Inspection
                </span>
                <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#8c8273] hover:text-white cursor-pointer"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 bg-[#1f1d17] border border-[#2d2a24] space-y-2 text-xs">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f] mb-2">
                Customer & Shipping
              </h4>
              <p className="m-0 text-white font-medium">
                {selectedOrder.customerName || "Valued Customer"}
              </p>
              <p className="m-0 text-[#8c8273]">
                Email: {selectedOrder.customerEmail || "Not provided"}
              </p>
              <p className="m-0 text-[#8c8273]">
                Phone: {selectedOrder.customerPhone || "Not provided"}
              </p>
              <p className="m-0 text-[#8c8273]">
                Delivery Address:{" "}
                {selectedOrder.shippingAddress ||
                  selectedOrder.shippingCity ||
                  "Gulshan 2, Dhaka, Bangladesh"}
              </p>
            </div>

            {/* Payment Gateway Settlement */}
            <div className="p-4 bg-[#1f1d17] border border-[#2d2a24] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f] m-0">
                  Payment Gateway Settlement
                </h4>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase ${
                    selectedOrder.paymentStatus === "paid"
                      ? "bg-[#81c784]/20 text-[#81c784] border border-[#81c784]/30"
                      : "bg-[#f7941d]/20 text-[#f7941d] border border-[#f7941d]/30"
                  }`}
                >
                  {selectedOrder.paymentStatus || "Paid"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[#8c8273] text-[10px] block">
                    Payment Gateway:
                  </span>
                  <strong className="text-white">
                    {selectedOrder.paymentMethod || "bKash"}
                  </strong>
                </div>
                {selectedOrder.paymentDetails?.transactionId && (
                  <div>
                    <span className="text-[#8c8273] text-[10px] block">
                      Transaction ID (TrxID):
                    </span>
                    <strong className="text-[#aa8b5f] font-mono">
                      {selectedOrder.paymentDetails.transactionId}
                    </strong>
                  </div>
                )}
                {selectedOrder.paymentDetails?.walletNumber && (
                  <div>
                    <span className="text-[#8c8273] text-[10px] block">
                      Sender Wallet:
                    </span>
                    <strong className="text-white font-mono">
                      {selectedOrder.paymentDetails.walletNumber}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f]">
                Order Line Items
              </h4>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#1f1d17] border border-[#2d2a24] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-12 object-cover border border-[#2d2a24]"
                    />
                    <div>
                      <p className="font-medium text-white m-0">
                        {item.productName}
                      </p>
                      <span className="text-[#8c8273] text-[10px]">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  <strong className="text-white">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-[#1f1d17] border border-[#2d2a24] space-y-2 text-xs">
              <div className="flex justify-between text-[#8c8273]">
                <span>Items Subtotal</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
              <div className="flex justify-between text-[#8c8273]">
                <span>Delivery Charge (Bangladesh White-Glove)</span>
                <span className="text-[#81c784]">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-white font-semibold pt-2 border-t border-[#2d2a24] text-sm">
                <span>Grand Total BDT</span>
                <span className="text-[#aa8b5f] font-['Cormorant_Garamond',serif] text-lg">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Status Transition Action Bar */}
            <div className="pt-4 border-t border-[#2d2a24] space-y-3">
              <label className="text-[10px] text-[#8c8273] uppercase tracking-widest block font-bold">
                Change Fulfillment Status:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onUpdateOrderStatus(selectedOrder.id, "In Atelier")
                  }
                  className="py-2 bg-[#aa8b5f]/20 hover:bg-[#aa8b5f] text-[#aa8b5f] hover:text-[#171713] text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs"
                >
                  Set In Atelier
                </button>
                <button
                  onClick={() =>
                    onUpdateOrderStatus(selectedOrder.id, "Dispatched")
                  }
                  className="py-2 bg-[#29b6f6]/20 hover:bg-[#29b6f6] text-[#81d4fa] hover:text-[#171713] text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs"
                >
                  Set Dispatched
                </button>
                <button
                  onClick={() =>
                    onUpdateOrderStatus(selectedOrder.id, "Delivered")
                  }
                  className="py-2 bg-[#4caf50]/20 hover:bg-[#4caf50] text-[#81c784] hover:text-[#171713] text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs"
                >
                  Set Delivered
                </button>
                <button
                  onClick={() => setCancelOrderTarget(selectedOrder.id)}
                  className="py-2 bg-[#e53935]/20 hover:bg-[#e53935] text-[#ef5350] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs"
                >
                  Cancel Order
                </button>
              </div>

              <button
                onClick={() => {
                  setShowInvoiceModal(selectedOrder)
                  setSelectedOrder(null)
                }}
                className="w-full py-2.5 bg-transparent border border-[#aa8b5f] text-[#aa8b5f] hover:bg-[#aa8b5f]/10 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <Icon name="printer" size={16} /> Print Official Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Invoice Modal */}
      {showInvoiceModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setShowInvoiceModal(null)}
        >
          <div
            className="bg-white text-[#171713] max-w-2xl w-full p-8 shadow-2xl relative animate-fadeIn rounded-xs"
            onClick={(e) => e.stopPropagation()}
            id="printable-invoice"
          >
            {/* Action Bar (hidden when printing) */}
            <div className="flex justify-between items-center pb-4 border-b border-[#e5e0d8] mb-6 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#aa8b5f] hover:bg-[#8c6e49] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Icon name="printer" size={16} /> Print or Save as PDF
              </button>

              <button
                onClick={() => setShowInvoiceModal(null)}
                className="text-[#8c8273] hover:text-black cursor-pointer"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start pb-6 border-b border-[#e5e0d8]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#aa8b5f] block">
                  Official Atelier Receipt
                </span>
                <h2 className="font-['Cormorant_Garamond',serif] text-3xl font-bold tracking-wide m-0 text-[#171713]">
                  AURÉLIA MAISON PARIS
                </h2>
                <p className="text-xs text-[#70695c] m-0 mt-1">
                  Dhaka Gulshan 2 Salon · Paris Saint-Honoré
                </p>
                <p className="text-xs text-[#70695c] m-0">
                  Concierge: +880 1700-AURELIA · concierge@aurelia.com.bd
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase font-bold text-[#8c8273] block">
                  INVOICE
                </span>
                <strong className="text-lg font-mono block">
                  {showInvoiceModal.id}
                </strong>
                <span className="text-xs text-[#70695c] block">
                  Date: {showInvoiceModal.date}
                </span>
                <span className="text-xs text-[#aa8b5f] font-mono block">
                  Track: {showInvoiceModal.trackingNumber}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Section */}
            <div className="grid grid-cols-2 gap-6 py-6 border-b border-[#e5e0d8] text-xs">
              <div>
                <p className="font-bold text-[#8c8273] uppercase tracking-wider text-[10px] mb-1">
                  Billed & Delivered To:
                </p>
                <strong className="text-sm block">
                  {showInvoiceModal.customerName || "Valued Patron"}
                </strong>
                <p className="text-[#555] m-0">
                  {showInvoiceModal.customerPhone || "017XXXXXXXX"}
                </p>
                <p className="text-[#555] m-0">
                  {showInvoiceModal.customerEmail || "patron@aurelia.com.bd"}
                </p>
                <p className="text-[#555] m-0 mt-1">
                  {showInvoiceModal.shippingAddress ||
                    showInvoiceModal.shippingCity ||
                    "Gulshan 2, Dhaka, Bangladesh"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#8c8273] uppercase tracking-wider text-[10px] mb-1">
                  Payment Details:
                </p>
                <p className="text-[#555] m-0">
                  Method:{" "}
                  <strong>{showInvoiceModal.paymentMethod || "bKash"}</strong>
                </p>
                {showInvoiceModal.paymentDetails?.transactionId && (
                  <p className="text-[#555] m-0 font-mono">
                    TrxID: {showInvoiceModal.paymentDetails.transactionId}
                  </p>
                )}
                <p className="text-[#555] m-0">
                  Status:{" "}
                  <strong
                    className={
                      showInvoiceModal.paymentStatus === "pending"
                        ? "text-[#f57c00]"
                        : "text-[#4caf50]"
                    }
                  >
                    {showInvoiceModal.paymentStatus === "pending"
                      ? "PENDING (COD / VERIFY)"
                      : "PAID & VERIFIED"}
                  </strong>
                </p>
                <p className="text-[#555] m-0">
                  Fulfillment: {showInvoiceModal.status}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6 border-b border-[#e5e0d8]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e0d8] text-[10px] uppercase font-bold tracking-wider text-[#8c8273]">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Unit Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece4]">
                  {showInvoiceModal.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-medium">{item.productName}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3 text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 flex justify-end text-xs">
              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between text-[#70695c]">
                  <span>Subtotal:</span>
                  <span>{formatPrice(showInvoiceModal.total)}</span>
                </div>
                <div className="flex justify-between text-[#70695c]">
                  <span>Delivery (White-Glove):</span>
                  <span className="text-[#4caf50]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#171713] pt-2 border-t border-[#e5e0d8]">
                  <span>Total Amount BDT:</span>
                  <span className="text-[#aa8b5f] font-['Cormorant_Garamond',serif] text-xl">
                    {formatPrice(showInvoiceModal.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Footer Stamp */}
            <div className="pt-8 text-center text-[11px] text-[#8c8273]">
              <p className="m-0 italic">
                Thank you for acquiring from Aurélia Maison Paris. Each creation
                is accompanied by our lifetime seal of authenticity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Order Cancellation */}
      <ConfirmationModal
        isOpen={cancelOrderTarget !== null}
        title="Cancel Order Confirmation"
        message="Are you certain you wish to cancel this customer order? The customer will receive an alert and the status will be permanently marked as Cancelled."
        confirmText="Confirm Order Cancellation"
        isDestructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelOrderTarget(null)}
      />
    </div>
  )
}
