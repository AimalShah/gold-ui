import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LedgerEntry, Customer, Expense } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface AccountsTabsContentProps {
  activeTab: 'day_book' | 'cash_book' | 'gold_book' | 'balances' | 'expenses'
  setActiveTab: (tab: 'day_book' | 'cash_book' | 'gold_book' | 'balances' | 'expenses') => void
  ledger: LedgerEntry[]
  customers: Customer[]
  expenses: Expense[]
}

export const AccountsTabsContent: React.FC<AccountsTabsContentProps> = ({
  activeTab,
  setActiveTab,
  ledger,
  customers,
  expenses,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
      <TabsList className="bg-card border border-border p-1 rounded-lg">
        <TabsTrigger value="day_book" className="text-xs font-medium">Day Book (Combined)</TabsTrigger>
        <TabsTrigger value="cash_book" className="text-xs font-medium">Cash Book (PKR)</TabsTrigger>
        <TabsTrigger value="gold_book" className="text-xs font-medium">Gold Book (Au)</TabsTrigger>
        <TabsTrigger value="balances" className="text-xs font-medium">Customer Balances</TabsTrigger>
        <TabsTrigger value="expenses" className="text-xs font-medium">Shop Expenses ({expenses.length})</TabsTrigger>
      </TabsList>

      {/* TAB 1: DAY BOOK */}
      <TabsContent value="day_book" className="pt-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Gold In (g)</th>
                  <th className="px-6 py-4 text-right">Gold Out (g)</th>
                  <th className="px-6 py-4 text-right">Cash In (PKR)</th>
                  <th className="px-6 py-4 text-right">Cash Out (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledger.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground text-xs">{l.date}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{l.ref}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{l.description}</td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                      {l.goldInMg ? `${formatGrams(l.goldInMg)}g` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-destructive">
                      {l.goldOutMg ? `${formatGrams(l.goldOutMg)}g` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                      {l.cashInPkr ? formatMoney(l.cashInPkr) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-destructive">
                      {l.cashOutPkr ? formatMoney(l.cashOutPkr) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* TAB 2: CASH BOOK */}
      <TabsContent value="cash_book" className="pt-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Particulars</th>
                  <th className="px-6 py-4 text-right">Receipt (Cash In)</th>
                  <th className="px-6 py-4 text-right">Payment (Cash Out)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledger.filter((l) => l.cashInPkr > 0 || l.cashOutPkr > 0).map((l) => (
                  <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground text-xs">{l.date}</td>
                    <td className="px-6 py-4 capitalize font-medium">{l.type}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{l.ref}</td>
                    <td className="px-6 py-4 text-foreground">{l.description}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {l.cashInPkr ? formatMoney(l.cashInPkr) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-destructive">
                      {l.cashOutPkr ? formatMoney(l.cashOutPkr) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* TAB 3: GOLD BOOK */}
      <TabsContent value="gold_book" className="pt-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Particulars</th>
                  <th className="px-6 py-4 text-right">Gold In (g)</th>
                  <th className="px-6 py-4 text-right">Gold Out (g)</th>
                  <th className="px-6 py-4 text-right font-bold">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledger.filter((l) => l.goldInMg > 0 || l.goldOutMg > 0).map((l) => (
                  <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground text-xs">{l.date}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{l.ref}</td>
                    <td className="px-6 py-4 text-foreground">{l.description}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {l.goldInMg ? `${formatGrams(l.goldInMg)}g` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-destructive">
                      {l.goldOutMg ? `${formatGrams(l.goldOutMg)}g` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      {formatGrams(l.runningGoldMg)}g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* TAB 4: CUSTOMER BALANCES */}
      <TabsContent value="balances" className="pt-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer Name</th>
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
        </div>
      </TabsContent>

      {/* TAB 5: SHOP EXPENSES */}
      <TabsContent value="expenses" className="pt-4">
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Paid To</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Authorized By</th>
                  <th className="px-6 py-4 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No expense records found for today.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.date}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{e.category}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.paidTo}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.note || '—'}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.user}</td>
                      <td className="px-6 py-4 text-right font-bold text-destructive">
                        {formatMoney(e.amountPkr)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
