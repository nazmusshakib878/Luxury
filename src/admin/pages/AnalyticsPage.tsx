import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { Product, UserOrder, Customer } from "../../types"
import { generateRevenueTrend, downloadCSV } from "../services/adminService"

interface AnalyticsPageProps {
  orders: UserOrder[]
  products: Product[]
  customers: Customer[]
  formatPrice: (p: number) => string
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  orders,
  products,
  customers,
  formatPrice,
}) => {
  const [reportRange, setReportRange] = useState<"monthly" | "weekly">(
    "monthly",
  )

  const trends = generateRevenueTrend(orders)
  const grossRevenue = orders.reduce(
    (acc, o) => (!o.status?.includes("Cancel") ? acc + (o.total || 0) : acc),
    0,
  )
  const totalDiscounts = orders.reduce(
    (acc, o) => acc + (o.discountAmount || 0),
    0,
  )
  const netRevenue = grossRevenue - totalDiscounts
  const aov = orders.length ? Math.round(grossRevenue / orders.length) : 0

  // Calculate best-selling products from order line items
  const productSalesMap: Record<string, {
    name: string
    units: number
    revenue: number
    image: string
  }> = {}

  orders.forEach((o) => {
    if (!o.status?.includes("Cancel")) {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productName]) {
          productSalesMap[item.productName] = {
            name: item.productName,
            units: 0,
            revenue: 0,
            image: item.image,
          }
        }
        productSalesMap[item.productName].units += item.quantity
        productSalesMap[item.productName].revenue += item.price * item.quantity
      })
    }
  })

  const topSellingProducts = Object.values(productSalesMap).sort(
    (a, b) => b.revenue - a.revenue,
  )

  const handleExportOrdersCSV = () => {
    const rows = orders.map((o) => ({
      "Order ID": o.id,
      Date: o.date,
      "Customer Name": o.customerName || "Patron",
      "Customer Phone": o.customerPhone || "",
      "Customer Email": o.customerEmail || "",
      "Shipping City": o.shippingCity || "Dhaka",
      "Total Amount (BDT)": o.total,
      Status: o.status,
      "Tracking Number": o.trackingNumber,
      "Payment Method": o.paymentMethod || "Direct Card",
      "Items Count": o.items.length,
    }))
    downloadCSV(
      `Aurelia_Orders_Report_${new Date().toISOString().split("T")[0]}.csv`,
      rows,
    )
  }

  const handleExportProductsCSV = () => {
    const rows = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      Subtitle: p.subtitle,
      Category: p.category,
      "Price (USD)": p.price,
      "In Stock": p.inStock ? "YES" : "NO",
      "Stock Quantity": p.stockQuantity ?? 12,
      SKU: p.sku || `AUR-${p.id}`,
      Materials: p.materials,
      Badge: p.badge || "None",
    }))
    downloadCSV(
      `Aurelia_Catalog_Inventory_${new Date().toISOString().split("T")[0]}.csv`,
      rows,
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171713] p-4 sm:p-6 border border-[#2d2a24]">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-white m-0">
            Executive Financial Analytics & CSV Reports
          </h3>
          <p className="text-xs text-[#8c8273] m-0 mt-0.5">
            Audit store performance, revenue trends, and download exportable
            spreadsheets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportOrdersCSV}
            className="px-4 py-2 bg-[#1f1d17] hover:bg-[#aa8b5f] hover:text-[#171713] border border-[#aa8b5f] text-[#aa8b5f] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <Icon name="download" size={14} /> Export Orders CSV
          </button>
          <button
            onClick={handleExportProductsCSV}
            className="px-4 py-2 bg-[#aa8b5f] hover:bg-[#c2a275] text-[#171713] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <Icon name="download" size={14} /> Export Catalog CSV
          </button>
        </div>
      </div>

      {/* Financial Breakdown KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Gross Sales Volume
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-white my-1">
            {formatPrice(grossRevenue)}
          </h3>
          <p className="text-[11px] text-[#aa8b5f] m-0">
            Eligible non-cancelled orders
          </p>
        </div>

        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Discounts Granted
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#ff9800] my-1">
            {formatPrice(totalDiscounts)}
          </h3>
          <p className="text-[11px] text-[#70695c] m-0">
            Coupons & promo codes
          </p>
        </div>

        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Net Collected Revenue
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#81c784] my-1">
            {formatPrice(netRevenue)}
          </h3>
          <p className="text-[11px] text-[#70695c] m-0">
            Realized atelier revenue
          </p>
        </div>

        <div className="bg-[#171713] p-5 border border-[#2d2a24]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c8273]">
            Average Order Value (AOV)
          </span>
          <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#aa8b5f] my-1">
            {formatPrice(aov)}
          </h3>
          <p className="text-[11px] text-[#70695c] m-0">
            Average spend per checkout
          </p>
        </div>
      </div>

      {/* Best-Selling Products Table */}
      <div className="bg-[#171713] border border-[#2d2a24] overflow-hidden">
        <div className="p-4 border-b border-[#2d2a24] bg-[#12110e] flex justify-between items-center">
          <h3 className="font-['Cormorant_Garamond',serif] text-xl text-white m-0">
            Top-Performing Creations by Sales Volume
          </h3>
          <span className="text-xs text-[#8c8273]">
            Ranked by total revenue generated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2d2a24] bg-[#12110e] text-[#8c8273] text-[10px] uppercase font-bold tracking-widest">
                <th className="p-4">Rank</th>
                <th className="p-4">Product Creation</th>
                <th className="p-4">Units Sold</th>
                <th className="p-4">Total Revenue Generated (BDT)</th>
                <th className="p-4 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24211b]">
              {topSellingProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#8c8273]">
                    No sales data recorded yet.
                  </td>
                </tr>
              ) : (
                topSellingProducts.map((p, idx) => {
                  const contributionPercent = grossRevenue
                    ? Math.round((p.revenue / grossRevenue) * 100)
                    : 0

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-[#1a1813] transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-[#aa8b5f]">
                        #{idx + 1}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-12 object-cover border border-[#2d2a24]"
                          />
                          <strong className="text-white">{p.name}</strong>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">
                        {p.units} units
                      </td>
                      <td className="p-4 font-semibold text-[#aa8b5f] font-['Cormorant_Garamond',serif] text-base">
                        {formatPrice(p.revenue)}
                      </td>
                      <td className="p-4 text-right font-mono text-[#81c784]">
                        {contributionPercent}%
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
