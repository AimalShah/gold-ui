import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MoneyInput } from '@/components/shared/MoneyInput'
import {
  BookOpen,
  Plus,
  Lock,
  Printer,
  FileSpreadsheet,
  Calendar,
  Wallet,
  Coins,
  Receipt,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'

export const AccountsPage: React.FC = () => {
  const { ledger, customers, expenses, addExpense, currentUser } = useApp()

  const [activeTab, setActiveTab] = useState<'day_book' | 'cash_book' | 'gold_book' | 'balances' | 'expenses'>('day_book')
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [dayClosed, setDayClosed] = useState(false)

  // Expense form state
  const [expCategory, setExpCategory] = useState<any>('Staff Tea / Meal')
  const [expAmount, setExpAmount] = useState(1500)
  const [expPaidTo, setExpPaidTo] = useState('')
  const [expNote, setExpNote] = useState('')

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (expAmount <= 0) {
      toast.error("Please enter a valid expense amount.")
      return
    }

    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      amountPkr: expAmount,
      paidTo: expPaidTo || 'Cash Payment',
      note: expNote,
      user: currentUser.name,
    })

    toast.success(`Expense of ${formatMoney(expAmount)} recorded in Cash Book!`)
    setExpenseDialogOpen(false)
    setExpPaidTo('')
    setExpNote('')
  }

  const handleDayClose = () => {
    setDayClosed(true)
    toast.success("Day Book successfully balanced and locked for today. No modifications permitted.")
  }

  // Calculate Totals
  const totalGoldIn = ledger.reduce((sum, l) => sum + (l.goldInMg || 0), 0)
  const totalGoldOut = ledger.reduce((sum, l) => sum + (l.goldOutMg || 0), 0)
  const totalCashIn = ledger.reduce((sum, l) => sum + (l.cashInPkr || 0), 0)
  const totalCashOut = ledger.reduce((sum, l) => sum + (l.cashOutPkr || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amountPkr, 0)
  const netCashInHand = totalCashIn - totalCashOut - totalExpenses

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Day Book, Dual Cash & Gold Accounting (F6)</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpenseDialogOpen(true)}
            className="h-8 text-xs gap-1.5 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Expense
          </Button>

          <Button
            size="sm"
            onClick={handleDayClose}
            disabled={dayClosed}
            className={`h-8 text-xs font-semibold gap-1.5 ${dayClosed ? 'bg-muted text-muted-foreground' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            <Lock className="h-3.5 w-3.5" />
            {dayClosed ? 'Day Closed (Locked)' : 'Day Close (Lock)'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b bg-card/30">
          <TabsList className="h-10 bg-transparent p-0 gap-4">
            <TabsTrigger value="day_book" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Day Book (Combined)
            </TabsTrigger>
            <TabsTrigger value="cash_book" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Cash Book
            </TabsTrigger>
            <TabsTrigger value="gold_book" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Gold Book (Au)
            </TabsTrigger>
            <TabsTrigger value="balances" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Customer Balances
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Shop Expenses ({expenses.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Day Book */}
        <TabsContent value="day_book" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border bg-card shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Cash Received</span>
              <div className="text-lg font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatMoney(totalCashIn)}
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Cash Disbursed</span>
              <div className="text-lg font-mono font-bold text-red-600">
                {formatMoney(totalCashOut)}
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Gold Received (In)</span>
              <div className="text-lg font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatGrams(totalGoldIn)}g
              </div>
            </div>
            <div className="p-3 rounded-lg border bg-card shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Gold Given (Out)</span>
              <div className="text-lg font-mono font-bold text-red-600">
                {formatGrams(totalGoldOut)}g
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Ref #</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Gold In (g)</th>
                  <th className="py-2.5 px-3 text-right text-red-600">Gold Out (g)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Cash In (PKR)</th>
                  <th className="py-2.5 px-3 text-right text-red-600">Cash Out (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {ledger.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 px-3">{l.date}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{l.ref}</td>
                    <td className="py-2.5 px-3 font-sans text-foreground">{l.description}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">{l.goldInMg ? formatGrams(l.goldInMg) : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{l.goldOutMg ? formatGrams(l.goldOutMg) : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">{l.cashInPkr ? formatMoney(l.cashInPkr) : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{l.cashOutPkr ? formatMoney(l.cashOutPkr) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 2: Cash Book */}
        <TabsContent value="cash_book" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="p-4 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">Net Cash In Vault / Drawer</span>
              <p className="text-[11px] text-muted-foreground">Total cash collections minus payments and daily shop expenses</p>
            </div>
            <div className="text-2xl font-mono font-black text-emerald-900 dark:text-emerald-100">
              {formatMoney(netCashInHand)}
            </div>
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Particulars</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Receipt (In)</th>
                  <th className="py-2.5 px-3 text-right text-red-600">Payment (Out)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {ledger.filter(l => l.cashInPkr > 0 || l.cashOutPkr > 0).map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-3">{l.date}</td>
                    <td className="py-2.5 px-3 font-sans capitalize">{l.type}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{l.ref}</td>
                    <td className="py-2.5 px-3 font-sans">{l.description}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">{l.cashInPkr ? formatMoney(l.cashInPkr) : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{l.cashOutPkr ? formatMoney(l.cashOutPkr) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: Gold Book */}
        <TabsContent value="gold_book" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Particulars</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Gold In (g)</th>
                  <th className="py-2.5 px-3 text-right text-red-600">Gold Out (g)</th>
                  <th className="py-2.5 px-3 text-right font-bold">Running Balance (g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {ledger.filter(l => l.goldInMg > 0 || l.goldOutMg > 0).map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 px-3">{l.date}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{l.ref}</td>
                    <td className="py-2.5 px-3 font-sans">{l.description}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">{l.goldInMg ? formatGrams(l.goldInMg) : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{l.goldOutMg ? formatGrams(l.goldOutMg) : '—'}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatGrams(l.runningGoldMg)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 4: Customer Balances */}
        <TabsContent value="balances" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3 text-right">Gold Balance (g)</th>
                  <th className="py-2.5 px-3 text-right">Cash Balance (PKR)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-bold text-muted-foreground">{c.id}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-foreground">{c.name}</td>
                    <td className="py-2.5 px-3 font-sans">{c.phone}</td>
                    <td className="py-2.5 px-3 font-sans">{c.city}</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      <span className={c.goldBalanceMg > 0 ? 'text-red-600' : c.goldBalanceMg < 0 ? 'text-emerald-700' : 'text-muted-foreground'}>
                        {formatGrams(c.goldBalanceMg)}g
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      <span className={c.cashBalancePkr > 0 ? 'text-red-600' : c.cashBalancePkr < 0 ? 'text-emerald-700' : 'text-muted-foreground'}>
                        {formatMoney(c.cashBalancePkr)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <Badge variant="outline" className="text-[10px]">
                        {c.cashBalancePkr > 0 ? 'Debit' : c.cashBalancePkr < 0 ? 'Credit' : 'Nil'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 5: Expenses */}
        <TabsContent value="expenses" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                  <th className="py-2.5 px-3">Paid To</th>
                  <th className="py-2.5 px-3">Note</th>
                  <th className="py-2.5 px-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-mono">{e.date}</td>
                    <td className="py-2.5 px-3 font-semibold">{e.category}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-red-600">{formatMoney(e.amountPkr)}</td>
                    <td className="py-2.5 px-3">{e.paidTo}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">{e.note}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{e.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Expense Modal */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold text-amber-900 dark:text-amber-300">
              Record Shop Expense
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddExpense} className="space-y-3.5 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Expense Category *</Label>
              <Select value={expCategory} onValueChange={setExpCategory}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Staff Tea / Meal">Staff Tea / Meal</SelectItem>
                  <SelectItem value="Shop Maintenance">Shop Maintenance</SelectItem>
                  <SelectItem value="Karigar Labour">Karigar Labour</SelectItem>
                  <SelectItem value="Utilities">Utilities (Electricity/Gas)</SelectItem>
                  <SelectItem value="Packaging">Packaging (Boxes/Bags)</SelectItem>
                  <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Amount (PKR) *</Label>
              <MoneyInput
                value={expAmount}
                onChange={setExpAmount}
                autoFocus
                className="h-9 font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Paid To / Recipient</Label>
              <Input
                value={expPaidTo}
                onChange={(e) => setExpPaidTo(e.target.value)}
                placeholder="e.g. Al-Madina Hotel, LESCO"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Notes / Description</Label>
              <Input
                value={expNote}
                onChange={(e) => setExpNote(e.target.value)}
                placeholder="e.g. Monthly office supplies"
                className="h-8 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setExpenseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                Record Expense
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
