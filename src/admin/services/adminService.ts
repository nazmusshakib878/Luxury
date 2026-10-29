import { supabase, isSupabaseConfigured } from "../../lib/supabase"
import {
  Product,
  Category,
  UserOrder,
  Coupon,
  ProductReview,
  Customer,
  InventoryLog,
  StoreSettings,
  AppointmentData,
} from "../../types"
import { products as fallbackProducts } from "../../data/products"
import { categories as fallbackCategories } from "../../data/categories"

// Default Store Settings
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Aurélia Maison Paris (Luxury Shop BD)",
  supportEmail: "concierge@aurelia.com.bd",
  supportPhone: "+880 1700-AURELIA",
  storeAddress: "Gulshan Avenue, Dhaka 1212, Bangladesh",
  currencySymbol: "৳",
  deliveryChargeDhaka: 80,
  deliveryChargeOutside: 150,
  freeShippingThreshold: 20000,
  lowStockThreshold: 5,
}

// Initial Sample Customers
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    fullName: "Begum Rokeya Chowdhury",
    email: "rokeya.chowdhury@gulshan.bd",
    phone: "+880 1711-234567",
    city: "Dhaka (Gulshan 2)",
    address: "Road 79, House 14, Gulshan 2",
    totalOrders: 3,
    totalSpent: 3840,
    registeredAt: "2026-08-14",
    lastOrderDate: "2026-10-14",
  },
  {
    id: "cust-002",
    fullName: "Nadeem Rahman",
    email: "nadeem.rahman@banani.com",
    phone: "+880 1819-987654",
    city: "Dhaka (Banani)",
    address: "Block D, Road 11, Banani",
    totalOrders: 2,
    totalSpent: 2150,
    registeredAt: "2026-09-02",
    lastOrderDate: "2026-10-22",
  },
  {
    id: "cust-003",
    fullName: "Tahmina Anam",
    email: "tahmina.anam@dhanmondi.net",
    phone: "+880 1912-345678",
    city: "Dhaka (Dhanmondi)",
    address: "Road 27 (Old), Dhanmondi",
    totalOrders: 1,
    totalSpent: 980,
    registeredAt: "2026-09-28",
    lastOrderDate: "2026-09-29",
  },
  {
    id: "cust-004",
    fullName: "Zubair Al-Mahmud",
    email: "zubair.mahmud@chittagong.org",
    phone: "+880 1311-567890",
    city: "Chittagong (Khulshi)",
    address: "South Khulshi Residential Area",
    totalOrders: 2,
    totalSpent: 1820,
    registeredAt: "2026-10-05",
    lastOrderDate: "2026-10-25",
  },
]

// Initial Sample Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "AURELIA10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 5000,
    usageLimit: 100,
    usageCount: 24,
    isActive: true,
    expiresAt: "2026-12-31",
    createdAt: "2026-01-01",
  },
  {
    id: "coup-2",
    code: "DHAKA20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 15000,
    usageLimit: 50,
    usageCount: 12,
    isActive: true,
    expiresAt: "2026-11-30",
    createdAt: "2026-06-01",
  },
  {
    id: "coup-3",
    code: "VIPLUXURY",
    discountType: "fixed",
    discountValue: 2500,
    minOrderAmount: 20000,
    usageLimit: 25,
    usageCount: 7,
    isActive: true,
    expiresAt: "2026-12-31",
    createdAt: "2026-07-15",
  },
]

// Initial Sample Product Reviews
export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    productId: 1,
    productName: "Élan Sculpted Tote",
    customerName: "Sharmin Sultana",
    customerEmail: "sharmin@aurelia.bd",
    rating: 5,
    comment:
      "Exceptional craftsmanship. The box calfskin leather is rich, and the golden hardware arrived gleaming. White-glove delivery in Gulshan was seamless.",
    status: "approved",
    createdAt: "2026-10-18",
  },
  {
    id: "rev-2",
    productId: 6,
    productName: "Cèdre Blanc Extrait",
    customerName: "Dr. Farhan Qureshi",
    customerEmail: "farhan@dhaka.med",
    rating: 5,
    comment:
      "A masterpiece fragrance. Sophisticated Atlas cedar with velvety citrus undertones that lasts over 14 hours in Bangladesh's climate.",
    status: "approved",
    createdAt: "2026-10-21",
  },
  {
    id: "rev-3",
    productId: 3,
    productName: "Symphonie Saddle Bag",
    customerName: "Ayesha Zaman",
    customerEmail: "ayesha.z@lifestyle.bd",
    rating: 4,
    comment:
      "Beautiful structured silhouette. Perfect size for day-to-evening galas in Dhaka.",
    status: "approved",
    createdAt: "2026-10-25",
  },
]

// Initial Sample Inventory Movement Logs
export const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: "inv-1",
    productId: 1,
    productName: "Élan Sculpted Tote",
    changeType: "restock",
    quantityDelta: 10,
    newQuantity: 18,
    reason: "New shipment arrived from Paris Atelier",
    createdAt: "2026-10-20 14:30",
  },
  {
    id: "inv-2",
    productId: 6,
    productName: "Cèdre Blanc Extrait",
    changeType: "sale",
    quantityDelta: -1,
    newQuantity: 4,
    reason: "Order AUR-892410 fulfillment",
    createdAt: "2026-10-24 11:15",
  },
  {
    id: "inv-3",
    productId: 8,
    productName: "Vendôme Pocket Wallet",
    changeType: "adjustment",
    quantityDelta: 2,
    newQuantity: 15,
    reason: "Inventory audit reconciliation",
    createdAt: "2026-10-28 09:40",
  },
]

/**
 * Calculates executive KPI overview metrics from orders, products, and appointments.
 */
export function calculateExecutiveKPIs(
  orders: UserOrder[],
  products: Product[],
  customers: Customer[],
  appointments: AppointmentData[],
) {
  const totalOrders = orders.length
  const todayStr = new Date().toISOString().split("T")[0]

  // Count orders by status
  let pendingOrders = 0
  let confirmedOrders = 0
  let processingOrders = 0
  let dispatchedOrders = 0
  let deliveredOrders = 0
  let cancelledOrders = 0
  let totalRevenue = 0
  let todayOrdersCount = 0

  orders.forEach((o) => {
    const status = (o.status || "").toLowerCase()
    if (status.includes("pending")) pendingOrders++
    else if (status.includes("confirmed")) confirmedOrders++
    else if (status.includes("process") || status.includes("atelier"))
      processingOrders++
    else if (status.includes("dispatch") || status.includes("ship"))
      dispatchedOrders++
    else if (status.includes("deliver")) deliveredOrders++
    else if (status.includes("cancel") || status.includes("refund"))
      cancelledOrders++

    // Revenue counting rule: Valid non-cancelled orders contribute to gross volume
    if (!status.includes("cancel") && !status.includes("refund")) {
      totalRevenue += o.total || 0
    }

    if (o.date && o.date.includes(todayStr)) {
      todayOrdersCount++
    }
  })

  // Stock status counts
  const totalProducts = products.length
  let lowStockCount = 0
  let outOfStockCount = 0

  products.forEach((p) => {
    const qty = p.stockQuantity ?? (p.inStock ? 12 : 0)
    const threshold = p.lowStockThreshold ?? 5
    if (!p.inStock || qty <= 0) {
      outOfStockCount++
    } else if (qty <= threshold) {
      lowStockCount++
    }
  })

  return {
    totalRevenue,
    totalOrders,
    todayOrdersCount,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    dispatchedOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    totalCustomers: customers.length,
    totalAppointments: appointments.length,
  }
}

/**
 * Generates dynamic revenue chart trends based on orders.
 */
export function generateRevenueTrend(orders: UserOrder[]) {
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"]
  const baseAmounts = [14200, 19800, 24500, 31000, 28900, 36500]

  // Add real order totals to current month
  const currentMonthAdd = orders.reduce(
    (acc, o) =>
      !o.status?.toLowerCase().includes("cancel") ? acc + (o.total || 0) : acc,
    0,
  )
  baseAmounts[5] += currentMonthAdd

  return months.map((month, idx) => ({
    month,
    revenue: baseAmounts[idx],
    orders: Math.round(baseAmounts[idx] / 1200),
  }))
}

/**
 * CSV Export utility for Orders, Products, and Customers.
 */
export function downloadCSV(filename: string, rows: any[]) {
  if (!rows || !rows.length) return

  const separator = ","
  const keys = Object.keys(rows[0])
  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k]
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""')
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`
            }
            return cell
          })
          .join(separator),
      )
      .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
