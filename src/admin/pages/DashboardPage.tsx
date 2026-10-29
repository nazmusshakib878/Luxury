import React, { useState } from "react"
import { Icon } from "../../components/common/Icon"
import { MetricCard } from "../components/MetricCard"
import { Product, UserOrder, Customer, AppointmentData } from "../../types"
import {
  calculateExecutiveKPIs,
  generateRevenueTrend,
} from "../services/adminService"
import { AdminTab } from "../components/AdminSidebar"

interface DashboardPageProps {
  products: Product[]
  orders: UserOrder[]
  customers: Customer[]
  appointments: AppointmentData[]
  formatPrice: (p: number) => string
  onSelectTab: (tab: AdminTab) => void
  onUpdateOrderStatus: (
    orderId: string,
    status: UserOrder["status"],
  ) => Promise<boolean>
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  products,
  orders,
  customers,
  appointments,
  formatPrice,
  onSelectTab,
  onUpdateOrderStatus,
}) => {
  const [dateFilter, setDateFilter] =
    useState<"today" | "7days" | "30days" | "all">("30days")

  const kpis = calculateExecutiveKPIs(orders, products, customers, appointments)
  const trends = generateRevenueTrend(orders)

  // Current month revenue estimate
  const currentMonthRevenue =
    trends[trends.length - 1]?.revenue || kpis.totalRevenue

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Date Filter & Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#171713] p-6 border border-[#2d2a24]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#aa8b5f] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Icon name="sparkle" size={14} /> Maison Executive Operations
            </span>
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl md:text-3xl text-[#f7f5f0] m-0">
            Welcome back, Master Administrator
          </h2>
          <p className="text-xs text-[#a19a8d] mt-1 m-0">
            Real-time business performance across Bangladesh boutique
            operations.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center bg-[#100f0c] p-1 border border-[#332f27] rounded-xs text-xs">
          <button
            onClick={() => setDateFilter("today")}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              dateFilter === "today"
                ? "bg-[#aa8b5f] text-[#171713] font-semibold"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter("7days")}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              dateFilter === "7days"
                ? "bg-[#aa8b5f] text-[#171713] font-semibold"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateFilter("30days")}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              dateFilter === "30days"
                ? "bg-[#aa8b5f] text-[#171713] font-semibold"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateFilter("all")}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
              dateFilter === "all"
                ? "bg-[#aa8b5f] text-[#171713] font-semibold"
                : "text-[#8c8273] hover:text-white"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 4 Primary Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Gross Revenue"
          value={formatPrice(kpis.totalRevenue)}
          subtext={`৳ Current month: ${formatPrice(currentMonthRevenue)}`}
          icon="dollar"
          trend="+18.4% vs last period"
          trendPositive={true}
          accentColor="text-[#aa8b5f]"
        />

        <MetricCard
          label="Orders Volume"
          value={kpis.totalOrders}
          subtext={`${kpis.pendingOrders} pending · ${kpis.processingOrders} in atelier`}
          icon="bag"
          trend={
            kpis.pendingOrders > 0
              ? `${kpis.pendingOrders} need action`
              : "Fully cleared"
          }
          trendPositive={kpis.pendingOrders === 0}
          accentColor="text-[#f7f5f0]"
        />

        <MetricCard
          label="Active Catalog Pieces"
          value={kpis.totalProducts}
          subtext={`${kpis.lowStockCount} low stock · ${kpis.outOfStockCount} out of stock`}
          icon="box"
          trend={kpis.lowStockCount > 0 ? "Review inventory" : "Healthy levels"}
          trendPositive={kpis.lowStockCount === 0}
          accentColor="text-[#f7f5f0]"
        />

        <MetricCard
          label="VIP Patrons Registered"
          value={kpis.totalCustomers}
          subtext={`${kpis.totalAppointments} salon viewings scheduled`}
          icon="users"
          trend="+28% this month"
          trendPositive={true}
          accentColor="text-[#f7f5f0]"
        />
      </div>

      {/* Charts & Analytical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart (2 columns) */}
        <div className="lg:col-span-2 bg-[#171713] p-6 border border-[#2d2a24] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2d2a24]">
            <div>
              <h3 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
                Revenue Trajectory & Sales Volume
              </h3>
              <p className="text-[11px] text-[#8c8273] m-0 mt-0.5">
                Monthly revenue in Bangladeshi Taka over recent cycles
              </p>
            </div>
            <button
              onClick={() => onSelectTab("analytics")}
              className="text-xs text-[#aa8b5f] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              Full Analytics <Icon name="arrow" size={14} />
            </button>
          </div>

          {/* SVG Bar Visualizer */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end gap-3 md:gap-6 justify-between px-2 border-b border-[#2d2a24]">
              {trends.map((item, idx) => {
                const maxVal = Math.max(...trends.map((t) => t.revenue))
                const heightPercent = Math.max(
                  15,
                  Math.round((item.revenue / maxVal) * 100),
                )
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#000] text-[#aa8b5f] text-[10px] px-2 py-0.5 rounded-xs border border-[#3a362f] whitespace-nowrap pointer-events-none z-10">
                      {formatPrice(item.revenue)} · {item.orders} orders
                    </div>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#aa8b5f]/40 to-[#aa8b5f] group-hover:from-[#c2a275] group-hover:to-[#ffd700] transition-all rounded-t-xs"
                    />

                    <span className="text-[10px] text-[#8c8273] font-medium uppercase tracking-wider">
                      {item.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Status Distribution (1 column) */}
        <div className="bg-[#171713] p-6 border border-[#2d2a24] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
              Fulfillment Status Distribution
            </h3>
            <p className="text-[11px] text-[#8c8273] m-0 mt-0.5">
              Breakdown of current customer orders
            </p>
          </div>

          <div className="space-y-3.5 my-auto py-2">
            {/* Delivered */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a19a8d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4caf50]" />{" "}
                  Delivered & Completed
                </span>
                <strong className="text-white">{kpis.deliveredOrders}</strong>
              </div>
              <div className="w-full h-2 bg-[#22201a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4caf50]"
                  style={{
                    width: `${
                      kpis.totalOrders
                        ? Math.round(
                            (kpis.deliveredOrders / kpis.totalOrders) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* In Atelier / Processing */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a19a8d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#aa8b5f]" /> In
                  Atelier / Handcrafting
                </span>
                <strong className="text-white">{kpis.processingOrders}</strong>
              </div>
              <div className="w-full h-2 bg-[#22201a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#aa8b5f]"
                  style={{
                    width: `${
                      kpis.totalOrders
                        ? Math.round(
                            (kpis.processingOrders / kpis.totalOrders) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Dispatched */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a19a8d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#29b6f6]" />{" "}
                  Dispatched (Courier)
                </span>
                <strong className="text-white">{kpis.dispatchedOrders}</strong>
              </div>
              <div className="w-full h-2 bg-[#22201a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#29b6f6]"
                  style={{
                    width: `${
                      kpis.totalOrders
                        ? Math.round(
                            (kpis.dispatchedOrders / kpis.totalOrders) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a19a8d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff9800]" /> Pending
                  Confirmation
                </span>
                <strong className="text-white">{kpis.pendingOrders}</strong>
              </div>
              <div className="w-full h-2 bg-[#22201a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff9800]"
                  style={{
                    width: `${
                      kpis.totalOrders
                        ? Math.round(
                            (kpis.pendingOrders / kpis.totalOrders) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectTab("orders-all")}
            className="w-full py-2 border border-[#332f27] hover:border-[#aa8b5f] text-xs font-semibold uppercase tracking-wider text-[#aa8b5f] transition-colors cursor-pointer text-center"
          >
            Manage Order Queue ➔
          </button>
        </div>
      </div>

      {/* Lower Grids: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-[#171713] p-6 border border-[#2d2a24] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2d2a24]">
            <h3 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
              Recent Customer Orders
            </h3>
            <button
              onClick={() => onSelectTab("orders-all")}
              className="text-xs text-[#aa8b5f] hover:underline cursor-pointer font-semibold"
            >
              View All ({orders.length})
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-[#8c8273] text-center py-8">
              No orders received in the system yet.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 bg-[#1f1d17] border border-[#2d2a24] hover:border-[#443e33] transition-colors flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#12110e] border border-[#2d2a24] flex items-center justify-center shrink-0">
                      <Icon name="bag" size={16} className="text-[#aa8b5f]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{order.id}</strong>
                        <span className="text-[#8c8273] text-[10px]">
                          {order.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#aa8b5f] m-0">
                        {order.customerName || "Valued Patron"} ·{" "}
                        {order.items.length} piece(s)
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <strong className="text-sm font-['Cormorant_Garamond',serif] text-[#f7f5f0]">
                      {formatPrice(order.total)}
                    </strong>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(
                          order.id,
                          e.target.value as UserOrder["status"],
                        )
                      }
                      className="text-[10px] bg-[#12110e] border border-[#3a362f] text-[#aa8b5f] px-2 py-0.5 rounded-xs outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="In Atelier">In Atelier</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock & Out of Stock Alerts */}
        <div className="bg-[#171713] p-6 border border-[#2d2a24] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2d2a24]">
            <h3 className="font-['Cormorant_Garamond',serif] text-xl text-[#f7f5f0] m-0">
              Inventory & Restock Alerts
            </h3>
            <button
              onClick={() => onSelectTab("inventory")}
              className="text-xs text-[#aa8b5f] hover:underline cursor-pointer font-semibold"
            >
              Inventory Manager
            </button>
          </div>

          <div className="space-y-3">
            {products
              .filter(
                (p) =>
                  !p.inStock || (p.stockQuantity ?? (p.inStock ? 12 : 0)) <= 5,
              )
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-[#1f1d17] border border-[#2d2a24] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt=""
                      className="w-10 h-12 object-cover border border-[#2d2a24]"
                    />
                    <div>
                      <h4 className="m-0 font-medium text-white truncate max-w-[180px]">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#8c8273] m-0">
                        {product.category} · {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-xs uppercase tracking-wider ${
                        !product.inStock
                          ? "bg-[#e53935]/20 text-[#ef5350] border border-[#e53935]/40"
                          : "bg-[#ff9800]/20 text-[#ffb74d] border border-[#ff9800]/40"
                      }`}
                    >
                      {!product.inStock
                        ? "Out of Stock"
                        : `${product.stockQuantity ?? 3} left`}
                    </span>
                    <button
                      onClick={() => onSelectTab("inventory")}
                      className="px-2.5 py-1 bg-[#22201b] hover:bg-[#aa8b5f] hover:text-[#171713] text-[#aa8b5f] text-[10px] font-semibold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}

            {products.filter((p) => !p.inStock || (p.stockQuantity ?? 12) <= 5)
              .length === 0 && (
              <p className="text-xs text-[#8c8273] text-center py-8">
                All catalog items maintain optimal inventory levels.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
