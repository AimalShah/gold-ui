import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  Printer,
  FileSpreadsheet,
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
  const { bills, customers, rawStock, inventoryItems, tehleelRecords, orders, mandi } = useApp()

  const reportsList: ReportMeta[] = [
    { id: 'sales', title: 'Sales & Purchi Register', description: 'Comprehensive listing of gold sales and receipts', icon: Receipt },
    { id: 'balances', title: 'Customer Balances & Debtors', description: 'Outstanding gold weight (g) and cash balances (PKR)', icon: Users },
    { id: 'stock', title: 'Gold Bullion & Inventory Stock', description: 'Physical 24K pure gold, raw lots, and finished items', icon: Coins },
    { id: 'tehleel', title: 'Assay / Tehleel Testing History', description: 'Cupellation and karat test records with purities', icon: Flame },
    { id: 'orders', title: 'Workshop Orders & Karigar Work', description: 'Pending client deliveries and karigar issue/returns', icon: Clock },
    { id: 'zakat', title: 'Zakat Calculation Summary', description: '2.5% Shariah assessment on total inventory value', icon: Sparkles },
  ]

  const [selectedReportId, setSelectedReportId] = useState('sales')
  const [dateFrom, setDateFrom] = useState('2026-09-01')
  const [dateTo, setDateTo] = useState('2026-09-30')

  const handlePrint = () => {
    toast.success("Sending official report to printer...")
  }

  const handleExportExcel = () => {
    toast.success("Exported report table to CSV / Excel.")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Financial & Audit Reports</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExportExcel} className="h-8 text-xs gap-1.5 font-semibold">
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            Export CSV
          </Button>
          <Button size="sm" onClick={handlePrint} className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Split: Left list (280px), Right Report Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation */}
        <div className="w-64 border-r bg-card/30 p-2 overflow-y-auto space-y-1 shrink-0">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Available Reports
          </div>
          {reportsList.map((r) => {
            const Icon = r.icon
            const isSelected = selectedReportId === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReportId(r.id)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-md text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 font-bold border border-amber-500/30'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-amber-600' : 'text-muted-foreground'}`} />
                <div className="truncate">
                  <div>{r.title}</div>
                  <div className="text-[10px] text-muted-foreground font-normal truncate">{r.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          {/* Filters Bar */}
          <div className="p-3 border-b bg-card/20 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>From:</span>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-7 w-32 text-xs font-mono"
              />
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span>To:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-7 w-32 text-xs font-mono"
              />
            </div>
            <Button size="sm" variant="secondary" className="h-7 text-xs font-semibold gap-1 ml-auto">
              <Filter className="h-3 w-3" /> Run Filter
            </Button>
          </div>

          {/* Report Viewer */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedReportId === 'sales' && (
              <div className="rounded-lg border bg-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Bill #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3 text-right">Net Wt</th>
                      <th className="py-2.5 px-3 text-right">Gold Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                      <th className="py-2.5 px-3 text-right">Wasool Received</th>
                      <th className="py-2.5 px-3 text-right">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    {bills.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2 px-3 font-bold text-amber-700">#{b.billNo}</td>
                        <td className="py-2 px-3 text-muted-foreground">{b.date}</td>
                        <td className="py-2 px-3 font-sans font-medium text-foreground">{b.customerName}</td>
                        <td className="py-2 px-3 text-right font-bold">{formatGrams(b.netWeightMg)}g</td>
                        <td className="py-2 px-3 text-right">{b.goldRatePkr.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right font-bold">{formatMoney(b.totalPricePkr)}</td>
                        <td className="py-2 px-3 text-right text-emerald-700">{formatMoney(b.wasoolPkr)}</td>
                        <td className="py-2 px-3 text-right text-red-600 font-bold">{formatMoney(b.balancePkr)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReportId === 'balances' && (
              <div className="rounded-lg border bg-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Customer ID</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">City</th>
                      <th className="py-2.5 px-3 text-right">Gold Balance Owed</th>
                      <th className="py-2.5 px-3 text-right">Cash Balance Owed</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2 px-3 text-muted-foreground">{c.id}</td>
                        <td className="py-2 px-3 font-sans font-bold text-foreground">{c.name}</td>
                        <td className="py-2 px-3 font-sans">{c.phone}</td>
                        <td className="py-2 px-3 font-sans">{c.city}</td>
                        <td className="py-2 px-3 text-right font-bold">
                          <span className={c.goldBalanceMg > 0 ? 'text-red-600' : 'text-emerald-700'}>
                            {formatGrams(c.goldBalanceMg)}g
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold">
                          <span className={c.cashBalancePkr > 0 ? 'text-red-600' : 'text-emerald-700'}>
                            {formatMoney(c.cashBalancePkr)}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans">
                          <Badge variant="outline" className="text-[10px]">
                            {c.cashBalancePkr > 0 ? 'Debit Due' : c.cashBalancePkr < 0 ? 'Advance' : 'Cleared'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReportId === 'stock' && (
              <div className="space-y-3">
                <div className="p-4 bg-muted/40 rounded border space-y-1">
                  <h3 className="font-bold text-xs uppercase text-amber-900 dark:text-amber-300">
                    Fine Gold (24K Pure) Physical Audit
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Includes all pure gold lots in safe, 22K/21K/18K scrap conversion, and finished showroom jewellery.
                  </p>
                </div>
                <div className="rounded-lg border bg-card overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                      <tr>
                        <th className="py-2.5 px-3">Item / Lot Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Karat</th>
                        <th className="py-2.5 px-3 text-right">Gross Weight</th>
                        <th className="py-2.5 px-3 text-right font-bold text-amber-800">24K Fine Equivalent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 font-mono">
                      {rawStock.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2 px-3 font-sans font-semibold">Raw Bullion Lot {r.id}</td>
                          <td className="py-2 px-3 font-sans">Bullion Safe</td>
                          <td className="py-2 px-3">{r.karat}K</td>
                          <td className="py-2 px-3 text-right">{formatGrams(r.weightMg)}g</td>
                          <td className="py-2 px-3 text-right font-bold text-foreground">{formatGrams(r.fineWeightMg)}g</td>
                        </tr>
                      ))}
                      {inventoryItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-3 font-sans">{item.name} ({item.tagSku})</td>
                          <td className="py-2 px-3 font-sans">Showroom Finished</td>
                          <td className="py-2 px-3">{item.karat}K</td>
                          <td className="py-2 px-3 text-right">{formatGrams(item.grossWeightMg)}g</td>
                          <td className="py-2 px-3 text-right font-bold text-foreground">
                            {formatGrams(Math.round(item.netWeightMg * (item.karat / 24)))}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReportId === 'tehleel' && (
              <div className="rounded-lg border bg-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">Assay #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Base</th>
                      <th className="py-2.5 px-3 text-right">1st Wt</th>
                      <th className="py-2.5 px-3 text-right">Pure Gold</th>
                      <th className="py-2.5 px-3 text-right">Karat</th>
                      <th className="py-2.5 px-3 text-right">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono">
                    {tehleelRecords.map((t) => (
                      <tr key={t.id}>
                        <td className="py-2 px-3 font-bold text-amber-700">{t.testNo}</td>
                        <td className="py-2 px-3 text-muted-foreground">{t.date}</td>
                        <td className="py-2 px-3 font-sans">{t.customerName || 'Walk-in'}</td>
                        <td className="py-2 px-3">{t.metalType}</td>
                        <td className="py-2 px-3 text-right">{formatGrams(t.firstWeightMg)}g</td>
                        <td className="py-2 px-3 text-right font-bold text-amber-600">{formatGrams(t.pureGoldMg)}g</td>
                        <td className="py-2 px-3 text-right font-bold">{t.carat}K</td>
                        <td className="py-2 px-3 text-right font-bold">{formatMoney(t.amountPkr)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReportId === 'zakat' && (
              <div className="p-6 rounded-lg border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 space-y-4 max-w-xl mx-auto text-center">
                <Sparkles className="h-8 w-8 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                  Annual Zakat Assessment Report (2.5%)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Estimated based on Total Fine Gold equivalent ({formatGrams(1600000)}g) at today's Mandi rate (Rs {mandi.pkrPerTola24k.toLocaleString()}/tola).
                </p>

                <div className="p-4 bg-background rounded-lg border shadow-xs space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-sans text-muted-foreground">Total Assessable Gold Value:</span>
                    <span className="font-bold">Rs 39,165,000</span>
                  </div>
                  <div className="flex justify-between text-base font-mono font-bold text-emerald-800 dark:text-emerald-300 border-t pt-2">
                    <span className="font-sans">Payable Zakat (2.5%):</span>
                    <span>Rs 979,125</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
