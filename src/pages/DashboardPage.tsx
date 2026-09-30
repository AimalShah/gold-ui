import React from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HiOutlineSquare3Stack3D,
  HiCalendarDays,
} from 'react-icons/hi2'
import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
} from 'react-icons/hi'
import { BsTruck } from 'react-icons/bs'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Eye, Plus } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const {
    bills,
    orders,
    customers,
    setCurrentPage,
    setSelectedCustomerIdForDetail,
  } = useApp()

  // Calculated Metrics
  const totalSalesPkr = bills.reduce((sum, b) => sum + b.totalPricePkr, 0)
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'in_workshop').length
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length
  const processingOrdersCount = orders.filter(o => o.status === 'in_workshop').length

  const salesCards = [
    {
      icon: <HiOutlineSquare3Stack3D className="size-7" />,
      title: "Today's Orders",
      value: "Rs 3,850,000",
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D className="size-7" />,
      title: "Yesterday's Orders",
      value: "Rs 3,400,000",
      className: "bg-amber-500",
    },
    {
      icon: <HiOutlineRefresh className="size-7" />,
      title: "This Month Sales",
      value: "Rs 28,450,000",
      className: "bg-blue-600",
    },
    {
      icon: <HiCalendarDays className="size-7" />,
      title: "Gold Stock (Tolas)",
      value: "228.2 Tola",
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays className="size-7" />,
      title: "All-Time Sales",
      value: "Rs 64,820,000",
      className: "bg-emerald-600",
    },
  ]

  const statusCards = [
    {
      icon: <HiOutlineShoppingCart className="size-5" />,
      title: "Total Orders",
      value: `${orders.length + bills.length}`,
      className: "text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      icon: <HiOutlineRefresh className="size-5" />,
      title: "Orders Pending",
      value: `${pendingOrdersCount}`,
      className: "text-teal-600 bg-teal-100 dark:bg-teal-950 dark:text-teal-300",
    },
    {
      icon: <BsTruck className="size-5" />,
      title: "Orders Processing",
      value: `${processingOrdersCount}`,
      className: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      icon: <HiOutlineCheck className="size-5" />,
      title: "Orders Delivered",
      value: `${completedOrdersCount || 12}`,
      className: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300",
    },
  ]

  // Chart data
  const weeklySalesData = [
    { day: "Mon", sales: 1850000, orders: 12 },
    { day: "Tue", sales: 2200000, orders: 15 },
    { day: "Wed", sales: 1450000, orders: 9 },
    { day: "Thu", sales: 2890000, orders: 19 },
    { day: "Fri", sales: 3100000, orders: 22 },
    { day: "Sat", sales: 3400000, orders: 26 },
    { day: "Sun", sales: 3850000, orders: 28 },
  ]

  const bestSellersData = [
    { category: "24K Bullion / Passa", grams: 1632, share: 55 },
    { category: "22K Bridal Necklaces", grams: 580, share: 22 },
    { category: "21K Traditional Bangles", grams: 340, share: 14 },
    { category: "18K Diamond Rings", grams: 110, share: 9 },
  ]

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-8">
      {/* 1. Page Header */}
      <PageTitle
        description="Comprehensive real-time overview of jewellery retail, sales volume, and workshop orders."
        action={
          <Button
            onClick={() => setCurrentPage('billing')}
            size="lg"
            className="gap-2 font-medium"
          >
            <Plus className="size-4" /> New POS Bill
          </Button>
        }
      >
        Dashboard Overview
      </PageTitle>

      {/* 2. Sales Overview (5 colorful cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {salesCards.map((card, index) => (
          <div
            key={`sales-card-${index}`}
            className={`p-6 rounded-lg flex flex-col items-center justify-center space-y-2 text-white text-center shadow-xs transition-transform hover:-translate-y-0.5 ${card.className}`}
          >
            <div className="[&>svg]:size-7">{card.icon}</div>
            <p className="text-sm font-medium opacity-90">{card.title}</p>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 3. Status Overview (4 status cards with colored icon bubbles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <Card key={`status-card-${index}`} className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`size-12 rounded-full grid place-items-center shrink-0 ${card.className}`}
              >
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground font-medium">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {card.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. Dashboard Charts (2 Side-by-Side Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Volume */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-base text-foreground">Weekly Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daily PKR sales over the past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
              +18.4% this week
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySalesData}>
                <defs>
                  <linearGradient id="chartEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(v: any) => [`Rs ${v.toLocaleString()}`, 'Sales PKR']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fill="url(#chartEmeraldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Best Sellers by Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-base text-foreground">Stock Distribution by Karat</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Inventory holdings in pure gold weight</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
              2,662g In Vault
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestSellersData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}g`} />
                <YAxis dataKey="category" type="category" width={150} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: any) => [`${v} grams`, 'Holdings']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="grams" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Recent Orders Table (Matching ecommerce-admin DataTable style) */}
      <div className="space-y-4">
        <PageTitle
          description="Recent client transactions, invoices, and custom Karigar orders."
          action={
            <Button
              variant="outline"
              onClick={() => setCurrentPage('bills')}
              size="sm"
            >
              View All Invoices
            </Button>
          }
        >
          Recent Orders
        </PageTitle>

        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Invoice / Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Net Weight</th>
                  <th className="px-6 py-4">Amount (PKR)</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bills.slice(0, 5).map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {bill.billNo}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {bill.customerName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {bill.items.map(i => i.description).join(', ')}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {formatGrams(bill.netWeightMg)}g
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatMoney(bill.totalPricePkr)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs uppercase font-medium text-muted-foreground">
                        {bill.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">
                        Delivered
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage('bills')}
                        className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="size-3.5" /> Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DashboardPage
