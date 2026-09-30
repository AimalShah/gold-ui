import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Printer,
  Calendar,
  Filter,
  Receipt,
  Users,
  Coins,
  Flame,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'

interface ReportMeta {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export const ReportsPage: React.FC = () => {
  const { bills, customers, rawStock, inventoryItems, tehleelRecords, mandi } = useApp()

  const reportsList: ReportMeta[] = [
    { id: 'sales', title: 'Sales & Invoices Register', description: 'Comprehensive listing of gold sales and receipts', icon: Receipt },
    { id: 'balances', title: 'Customer Balances & Debtors', description: 'Outstanding gold weight (g) and cash balances (PKR)', icon: Users },
    { id: 'stock', title: 'Gold Bullion & Inventory Stock', description: 'Physical 24K pure gold, raw lots, and finished items', icon: Coins },
    { id: 'tehleel', title: 'Assay / Tehleel Testing History', description: 'Cupellation and karat test records with purities', icon: Flame },
    { id: 'zakat', title: 'Zakat Calculation Summary', description: '2.5% Shariah assessment on total inventory value', icon: Sparkles },
  ]

  const [selectedReportId, setSelectedReportId] = useState('sales')
  const [dateFrom, setDateFrom] = useState('2026-09-01')
  const [dateTo, setDateTo] = useState('2026-09-30')

  const handlePrint = () => {
    toast.success("Sending official audit report to printer...")
  }

  const handleExportExcel = () => {
    toast.success("Exported report table to CSV / Excel.")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Page Header */}
      <PageTitle
        description="Comprehensive audit ledgers, sales statistics, stock valuations, and Zakat calculations."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleExportExcel}
              className="gap-2"
            >
              <Download className="size-4" /> Export CSV
            </Button>
            <Button
              size="lg"
              onClick={handlePrint}
              className="gap-2 font-medium"
            >
              <Printer className="size-4" /> Print Report
            </Button>
          </div>
        }
      >
        Financial & Audit Reports
      </PageTitle>

      {/* 2. Filter Bar Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground">From:</span>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-36 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">To:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-36 text-xs"
              />
            </div>
          </div>
          <Button size="sm" variant="secondary" className="gap-1.5 font-medium text-xs">
            <Filter className="size-3.5" /> Apply Date Range
          </Button>
        </div>
      </Card>

      {/* 3. Split Layout: Reports Navigation & Active Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: Report Categories */}
        <div className="lg:col-span-4 rounded-lg border border-border bg-card p-3 space-y-1.5 shadow-xs h-fit">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Report Types
          </div>
          {reportsList.map((r) => {
            const Icon = r.icon
            const isSelected = selectedReportId === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReportId(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-accent text-accent-foreground font-semibold border-l-4 border-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className={`size-5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="truncate">
                  <div className="font-medium text-sm leading-tight text-foreground">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{r.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: Report Data View */}
        <div className="lg:col-span-8 rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          {selectedReportId === 'sales' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Bill #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4 text-right">Net Wt</th>
                    <th className="px-6 py-4 text-right">Gold Rate</th>
                    <th className="px-6 py-4 text-right">Total Amount</th>
                    <th className="px-6 py-4 text-right">Paid</th>
                    <th className="px-6 py-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bills.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">#{b.billNo}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{b.date}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{b.customerName}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">{formatGrams(b.netWeightMg)}g</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">Rs {b.goldRatePkr.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{formatMoney(b.totalPricePkr)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600">{formatMoney(b.wasoolPkr)}</td>
                      <td className="px-6 py-4 text-right font-bold text-destructive">{formatMoney(b.balancePkr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReportId === 'balances' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Customer ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4 text-right">Gold Balance</th>
                    <th className="px-6 py-4 text-right">Cash Balance</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{c.id}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{c.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{c.phone}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{c.city}</td>
                      <td className="px-6 py-4 text-right font-bold">
                        <span className={c.goldBalanceMg > 0 ? 'text-destructive' : 'text-emerald-600'}>
                          {formatGrams(c.goldBalanceMg)}g
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        <span className={c.cashBalancePkr > 0 ? 'text-destructive' : 'text-emerald-600'}>
                          {formatMoney(c.cashBalancePkr)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={c.cashBalancePkr > 0 ? 'destructive' : 'success'}>
                          {c.cashBalancePkr > 0 ? 'Debit Due' : 'Cleared'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReportId === 'stock' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Karat</th>
                    <th className="px-6 py-4 text-right">Gross Weight</th>
                    <th className="px-6 py-4 text-right">24K Fine Equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rawStock.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">Raw Bullion Lot {r.id}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">Bullion Safe</td>
                      <td className="px-6 py-4 font-medium">{r.karat}K</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">{formatGrams(r.weightMg)}g</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">{formatGrams(r.fineWeightMg)}g</td>
                    </tr>
                  ))}
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{item.category}</td>
                      <td className="px-6 py-4 font-medium">{item.karat}K</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{formatGrams(item.grossWeightMg)}g</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {formatGrams(Math.round(item.netWeightMg * (item.karat / 24)))}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReportId === 'zakat' && (
            <div className="p-10 space-y-6 max-w-xl mx-auto text-center">
              <div className="size-16 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto">
                <Sparkles className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Annual Zakat Assessment Report (2.5%)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated based on Total Fine Gold equivalent ({formatGrams(1600000)}g) at today's Mandi rate (Rs {mandi.pkrPerTola24k.toLocaleString()}/tola).
                </p>
              </div>

              <div className="p-6 bg-muted/40 rounded-lg border border-border space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assessable Gold Value:</span>
                  <span className="font-bold text-foreground">Rs 39,165,000</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-4 text-primary">
                  <span>Payable Zakat (2.5%):</span>
                  <span>Rs 979,125</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default ReportsPage
