import React from 'react'
import { Bill, Customer, RawStockLot, InventoryItem, MandiRate } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface ReportsDataViewProps {
  selectedReportId: string
  bills: Bill[]
  customers: Customer[]
  rawStock: RawStockLot[]
  inventoryItems: InventoryItem[]
  mandi: MandiRate
}

export const ReportsDataView: React.FC<ReportsDataViewProps> = ({
  selectedReportId,
  bills,
  customers,
  rawStock,
  inventoryItems,
  mandi,
}) => {
  return (
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
            <h3 className="text-xl font-bold text-foreground">Annual Zakat Assessment Report (2.5%)</h3>
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
  )
}
