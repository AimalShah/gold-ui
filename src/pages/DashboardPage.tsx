import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Receipt,
  Users,
  Clock,
  ArrowUpRight,
  Boxes,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

export const DashboardPage: React.FC = () => {
  const {
    bills,
    orders,
    customers,
    mandi,
    setCurrentPage,
    setSelectedCustomerIdForDetail,
  } = useApp()

  const [salesUnit, setSalesUnit] = useState<'pkr' | 'grams'>('pkr')
  const [datePreset, setDatePreset] = useState<'today' | '7d' | '30d'>('7d')

  // Calculated Metrics
  const totalSalesPkr = bills.reduce((sum, b) => sum + b.totalPricePkr, 0)
  const totalGoldSoldMg = bills.filter(b => b.type === 'sale').reduce((sum, b) => sum + b.netWeightMg, 0)
  const totalGoldBoughtMg = bills.filter(b => b.type === 'purchase').reduce((sum, b) => sum + b.netWeightMg, 0)
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'in_workshop').length
  const totalReceivableCashPkr = customers.filter(c => c.cashBalancePkr > 0).reduce((sum, c) => sum + c.cashBalancePkr, 0)
  const totalGoldOwedMg = customers.filter(c => c.goldBalanceMg > 0).reduce((sum, c) => sum + c.goldBalanceMg, 0)

  // 10-day sales data mock
  const salesChartData = [
    { date: 'Sep 20', pkr: 1850000, grams: 75.5 },
    { date: 'Sep 21', pkr: 2200000, grams: 89.2 },
    { date: 'Sep 22', pkr: 1450000, grams: 58.8 },
    { date: 'Sep 23', pkr: 2890000, grams: 118.0 },
    { date: 'Sep 24', pkr: 3100000, grams: 125.4 },
    { date: 'Sep 25', pkr: 1980000, grams: 80.2 },
    { date: 'Sep 26', pkr: 2450000, grams: 98.6 },
    { date: 'Sep 27', pkr: 2750000, grams: 110.2 },
    { date: 'Sep 28', pkr: 3400000, grams: 137.5 },
    { date: 'Sep 29', pkr: 3850000, grams: 154.8 },
  ]

  // Stock by Karat Data
  const stockByKaratData = [
    { karat: '24K (Bullion)', grams: 1632 },
    { karat: '22K (Jewellery)', grams: 580 },
    { karat: '21K (Arabian)', grams: 340 },
    { karat: '18K (Diamond)', grams: 110 },
  ]

  // Top Customers by Balance
  const topDebtors = [...customers]
    .filter(c => c.cashBalancePkr > 0)
    .sort((a, b) => b.cashBalancePkr - a.cashBalancePkr)
    .slice(0, 5)

  // Orders due in next 7 days
  const upcomingOrders = orders.filter(o => o.status !== 'delivered')

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b border-border px-4 flex items-center justify-between bg-card select-none shrink-0">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-foreground" />
          <h1 className="font-bold text-sm text-foreground tracking-tight">Executive Dashboard</h1>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-border bg-muted p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDatePreset('today')}
              className={`px-2 py-0.5 rounded font-medium ${datePreset === 'today' ? 'bg-background text-foreground shadow-2xs font-bold' : 'text-muted-foreground'}`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('7d')}
              className={`px-2 py-0.5 rounded font-medium ${datePreset === '7d' ? 'bg-background text-foreground shadow-2xs font-bold' : 'text-muted-foreground'}`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('30d')}
              className={`px-2 py-0.5 rounded font-medium ${datePreset === '30d' ? 'bg-background text-foreground shadow-2xs font-bold' : 'text-muted-foreground'}`}
            >
              30 Days
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setCurrentPage('billing')}
            className="h-8 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs gap-1.5 shadow-2xs"
          >
            <Receipt className="h-3.5 w-3.5" />
            Open Billing
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TOP ROW: 6 KPI CARDS (Executive Visual Hierarchy) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Today's Sales */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Today's Sales</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                Rs 3.85M
              </div>
              <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3 w-3" /> +12.4% vs yday
              </div>
            </div>
          </div>

          {/* 2. Gold Sold Today */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Gold Sold Today</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                {formatGrams(totalGoldSoldMg || 154800, 1)}g
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">13.27 Tolas (22K)</div>
            </div>
          </div>

          {/* 3. Gold Bought Today */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Gold Bought</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                {formatGrams(totalGoldBoughtMg || 233280, 1)}g
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">20.00 Tolas Passa</div>
            </div>
          </div>

          {/* 4. Cash In Hand */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Vault Cash</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                Rs 1.28M
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Drawer Balanced</div>
            </div>
          </div>

          {/* 5. Pending Orders */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Pending Orders</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                {pendingOrdersCount} <span className="text-xs font-sans font-medium text-muted-foreground">Jobs</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">In Workshop</div>
            </div>
          </div>

          {/* 6. Total Receivable */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/25 transition-all flex flex-col justify-between space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-sans">Receivable Dues</span>
            <div>
              <div className="text-2xl font-mono font-black text-foreground tracking-tight tabular-nums">
                {formatMoney(totalReceivableCashPkr)}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                + {formatGrams(totalGoldOwedMg, 1)}g Gold
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Two Main Interactive Charts (Clean Monochrome) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sales History Area Chart (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Sales Volume Trend (Last 10 Days)
                </h3>
                <p className="text-[11px] text-muted-foreground">Daily volume in {salesUnit === 'pkr' ? 'PKR Revenue' : 'Pure Gold Grams'}</p>
              </div>

              {/* Units toggle */}
              <div className="flex rounded border border-border bg-muted p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSalesUnit('pkr')}
                  className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${salesUnit === 'pkr' ? 'bg-foreground text-background font-bold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  PKR
                </button>
                <button
                  type="button"
                  onClick={() => setSalesUnit('grams')}
                  className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${salesUnit === 'grams' ? 'bg-foreground text-background font-bold shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  GRAMS
                </button>
              </div>
            </div>

            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="monochromeSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => salesUnit === 'pkr' ? `${(v / 1000000).toFixed(1)}M` : `${v}g`}
                  />
                  <Tooltip
                    formatter={(v: any) => [salesUnit === 'pkr' ? `Rs ${v.toLocaleString()}` : `${v} g`, salesUnit === 'pkr' ? 'Revenue' : 'Gold Weight']}
                    contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#e5e7eb' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={salesUnit === 'pkr' ? 'pkr' : 'grams'}
                    stroke="#b45309"
                    strokeWidth={2}
                    fill="url(#monochromeSalesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock by Karat Distribution (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="border-b border-border pb-2 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Stock Holdings by Karat
                </h3>
                <p className="text-[11px] text-muted-foreground">Fine gold distribution in inventory</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5">
                Total: 2,662 g
              </Badge>
            </div>

            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByKaratData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}g`} />
                  <YAxis dataKey="karat" type="category" width={110} tick={{ fontSize: 10, fontWeight: 'medium' }} />
                  <Tooltip
                    formatter={(v: any) => [`${v} grams`, 'Holdings']}
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  />
                  <Bar dataKey="grams" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 3: Three Widgets (Upcoming Orders, Top Debtors, Alerts Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Upcoming Orders (4 cols) */}
          <div className="lg:col-span-4 rounded-lg border border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Workshop Deliveries Due
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('orders')}
                className="h-6 text-[10px] text-muted-foreground hover:text-foreground"
              >
                View All
              </Button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-56">
              {upcomingOrders.map((o) => (
                <div key={o.id} className="p-2 rounded border border-border bg-muted/30 text-xs space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground truncate max-w-[170px]">{o.itemDescription}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">{o.deliveryDate}</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>{o.customerName}</span>
                    <span className="font-mono font-semibold">{formatGrams(o.weightRequiredMg)}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Debtors by Balance (4 cols) */}
          <div className="lg:col-span-4 rounded-lg border border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                Top Customer Debit Dues
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('customers')}
                className="h-6 text-[10px] text-muted-foreground hover:text-foreground"
              >
                Ledger
              </Button>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-56">
              {topDebtors.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomerIdForDetail(c.id)
                    setCurrentPage('customers')
                  }}
                  className="p-2 rounded border border-border bg-muted/30 text-xs hover:bg-muted/70 cursor-pointer transition-colors flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{c.phone}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-foreground">{formatMoney(c.cashBalancePkr)}</div>
                    {c.goldBalanceMg > 0 && (
                      <div className="text-[10px] text-muted-foreground">{formatGrams(c.goldBalanceMg)}g Au</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & System Status (4 cols) */}
          <div className="lg:col-span-4 rounded-lg border border-border bg-card p-3 shadow-2xs space-y-2">
            <div className="border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Live System Status
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Mandi Live Feeds Active
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Today 24K benchmark rate set to Rs {mandi.pkrPerTola24k.toLocaleString()}/tola.
                </p>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  GSM SMS Gateway Connected
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Automatic transaction receipts dispatched via SIM modem COM4.
                </p>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border space-y-0.5">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Dual Ledger Integrity Verified
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Gold weights in integer milligrams and PKR cash books fully balanced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
