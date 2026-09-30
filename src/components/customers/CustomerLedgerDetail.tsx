import React from 'react'
import { Customer, LedgerEntry, Bill, Order } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  MapPin,
  Edit,
} from 'lucide-react'

interface CustomerLedgerDetailProps {
  selectedCustomer: Customer | null
  customerLedger: LedgerEntry[]
  customerBills: Bill[]
  customerOrders: Order[]
  onCredit: () => void
  onDebit: () => void
  onEdit: (c: Customer) => void
}

export const CustomerLedgerDetail: React.FC<CustomerLedgerDetailProps> = ({
  selectedCustomer,
  customerLedger,
  customerBills,
  customerOrders,
  onCredit,
  onDebit,
  onEdit,
}) => {
  if (!selectedCustomer) {
    return (
      <div className="lg:col-span-8 rounded-lg border border-border bg-card p-6 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs min-h-[500px]">
        <Users className="size-12 stroke-1 text-muted-foreground/60 mb-2" />
        <h3 className="font-semibold text-foreground">No customer selected</h3>
        <p className="text-xs mt-1">Click a customer account from the left directory to view full details.</p>
      </div>
    )
  }

  return (
    <div className="lg:col-span-8 rounded-lg border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{selectedCustomer.name}</h2>
              <Badge variant="secondary">{selectedCustomer.group}</Badge>
              <Badge variant="outline" className="font-mono text-xs">{selectedCustomer.id}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1.5">
              <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {selectedCustomer.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {selectedCustomer.address}, {selectedCustomer.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onCredit}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
            >
              <ArrowDownLeft className="size-4" /> Credit (+)
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDebit}
              className="gap-1.5 font-medium text-xs"
            >
              <ArrowUpRight className="size-4" /> Debit (−)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(selectedCustomer)}
              className="gap-1 text-xs"
            >
              <Edit className="size-3.5" /> Edit
            </Button>
          </div>
        </div>

        {/* Dual Balance Cards Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground">Gold Balance</span>
            <div className={`text-lg font-bold mt-1 ${selectedCustomer.goldBalanceMg > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
              {formatGrams(selectedCustomer.goldBalanceMg, 3)} g
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">{formatTMR(selectedCustomer.goldBalanceMg)}</span>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground">Cash Balance</span>
            <div className={`text-lg font-bold mt-1 ${selectedCustomer.cashBalancePkr > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
              {formatMoney(selectedCustomer.cashBalancePkr)}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {selectedCustomer.cashBalancePkr > 0 ? 'Customer Owes Shop' : 'Account Balanced'}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground">Credit Limit</span>
            <div className="text-lg font-semibold text-foreground mt-1">
              {formatMoney(selectedCustomer.creditLimitPkr)}
            </div>
            <span className="text-[11px] text-muted-foreground">Limit Approved</span>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <span className="text-[11px] uppercase font-semibold text-muted-foreground">Last Transaction</span>
            <div className="text-lg font-semibold text-foreground mt-1">
              {selectedCustomer.lastTransactionDate}
            </div>
            <span className="text-[11px] text-muted-foreground">{customerBills.length} Invoices</span>
          </div>
        </div>

        {/* Customer History Tabs: Ledger, Bills, Orders */}
        <Tabs defaultValue="ledger" className="w-full">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="ledger" className="text-xs font-medium">Roznamcha / Ledger ({customerLedger.length})</TabsTrigger>
            <TabsTrigger value="bills" className="text-xs font-medium">Invoices Archive ({customerBills.length})</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs font-medium">Workshop Orders ({customerOrders.length})</TabsTrigger>
          </TabsList>

          {/* Ledger Tab */}
          <TabsContent value="ledger" className="pt-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Ref</th>
                    <th className="px-4 py-3">Narration</th>
                    <th className="px-4 py-3 text-right">Gold In</th>
                    <th className="px-4 py-3 text-right">Gold Out</th>
                    <th className="px-4 py-3 text-right">Cash In</th>
                    <th className="px-4 py-3 text-right">Cash Out</th>
                    <th className="px-4 py-3 text-right font-bold">Gold Bal</th>
                    <th className="px-4 py-3 text-right font-bold">Cash Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customerLedger.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        No ledger entries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    customerLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/40">
                        <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{row.ref}</td>
                        <td className="px-4 py-3 text-foreground truncate max-w-[200px]">{row.description}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">{row.goldInMg ? `${formatGrams(row.goldInMg)}g` : '—'}</td>
                        <td className="px-4 py-3 text-right text-destructive font-medium">{row.goldOutMg ? `${formatGrams(row.goldOutMg)}g` : '—'}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium">{row.cashInPkr ? formatMoney(row.cashInPkr) : '—'}</td>
                        <td className="px-4 py-3 text-right text-destructive font-medium">{row.cashOutPkr ? formatMoney(row.cashOutPkr) : '—'}</td>
                        <td className="px-4 py-3 text-right font-bold text-foreground">{formatGrams(row.runningGoldMg)}g</td>
                        <td className="px-4 py-3 text-right font-bold text-foreground">{formatMoney(row.runningCashPkr)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Bills Tab */}
          <TabsContent value="bills" className="pt-4">
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Bill #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Net Wt</th>
                    <th className="px-4 py-3 text-right">Rate</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customerBills.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-semibold text-foreground">#{b.billNo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatGrams(b.netWeightMg)}g</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">Rs {b.goldRatePkr.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{formatMoney(b.totalPricePkr)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-medium">{formatMoney(b.wasoolPkr)}</td>
                      <td className="px-4 py-3 text-right font-bold text-destructive">{formatMoney(b.balancePkr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="pt-4 space-y-3">
            {customerOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">#{ord.orderNo}</span>
                    <span className="font-semibold text-foreground">{ord.itemDescription}</span>
                    <Badge variant="outline">{ord.status}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">Weight: {formatGrams(ord.weightRequiredMg)}g ({ord.carat}K) · Due: {ord.deliveryDate}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground block">{formatMoney(ord.makingChargesPkr)}</span>
                  <span className="text-[11px] text-muted-foreground">Making Fee</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
