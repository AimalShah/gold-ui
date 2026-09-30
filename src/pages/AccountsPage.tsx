import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
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
  Wallet,
  Receipt,
  Scale,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
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
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Page Header */}
      <PageTitle
        description="Daily Roznamcha, dual cash book, gold bullion journal, and shop expenses."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpenseDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" /> Add Expense
            </Button>
            <Button
              size="lg"
              variant={dayClosed ? "secondary" : "default"}
              onClick={handleDayClose}
              disabled={dayClosed}
              className="gap-2 font-medium"
            >
              <Lock className="size-4" />
              {dayClosed ? 'Day Book Locked' : 'Close & Lock Day'}
            </Button>
          </div>
        }
      >
        Day Book & Accounts
      </PageTitle>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Cash In (Received)</span>
            <ArrowDownLeft className="size-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{formatMoney(totalCashIn)}</p>
          <span className="text-xs text-muted-foreground">Daily Inflow</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Cash Out (Disbursed)</span>
            <ArrowUpRight className="size-5 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-destructive mt-2">{formatMoney(totalCashOut)}</p>
          <span className="text-xs text-muted-foreground">Daily Outflow</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Net Vault Cash</span>
            <Wallet className="size-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{formatMoney(netCashInHand)}</p>
          <span className="text-xs text-muted-foreground">After Shop Expenses</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Gold Net Movement</span>
            <Scale className="size-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatGrams(Math.abs(totalGoldIn - totalGoldOut))}g
          </p>
          <span className="text-xs text-muted-foreground font-mono">In: {formatGrams(totalGoldIn)}g · Out: {formatGrams(totalGoldOut)}g</span>
        </Card>
      </div>

      {/* 3. Tabbed Ledger Sheets */}
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
                  {ledger.filter(l => l.cashInPkr > 0 || l.cashOutPkr > 0).map((l) => (
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
                  {ledger.filter(l => l.goldInMg > 0 || l.goldOutMg > 0).map((l) => (
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
                      <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{c.phone}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{c.city}</td>
                      <td className="px-6 py-4 text-right font-bold">
                        <span className={c.goldBalanceMg > 0 ? 'text-destructive' : c.goldBalanceMg < 0 ? 'text-emerald-600' : 'text-muted-foreground'}>
                          {formatGrams(c.goldBalanceMg)}g
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        <span className={c.cashBalancePkr > 0 ? 'text-destructive' : c.cashBalancePkr < 0 ? 'text-emerald-600' : 'text-muted-foreground'}>
                          {formatMoney(c.cashBalancePkr)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={c.cashBalancePkr > 0 ? 'destructive' : c.cashBalancePkr < 0 ? 'success' : 'outline'}>
                          {c.cashBalancePkr > 0 ? 'Debit' : c.cashBalancePkr < 0 ? 'Credit' : 'Nil'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: EXPENSES */}
        <TabsContent value="expenses" className="pt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Amount (PKR)</th>
                    <th className="px-6 py-4">Paid To</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.date}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{e.category}</td>
                      <td className="px-6 py-4 text-right font-bold text-destructive">{formatMoney(e.amountPkr)}</td>
                      <td className="px-6 py-4 text-foreground">{e.paidTo}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.note}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{e.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Record Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-foreground">
              Record Shop Expense
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddExpense} className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Expense Category *</Label>
              <Select value={expCategory} onValueChange={setExpCategory}>
                <SelectTrigger className="h-10">
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

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Amount (PKR) *</Label>
              <MoneyInput
                value={expAmount}
                onChange={setExpAmount}
                autoFocus
                className="h-11 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Paid To / Recipient</Label>
              <Input
                value={expPaidTo}
                onChange={(e) => setExpPaidTo(e.target.value)}
                placeholder="e.g. Al-Madina Hotel, LESCO"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Notes / Description</Label>
              <Input
                value={expNote}
                onChange={(e) => setExpNote(e.target.value)}
                placeholder="e.g. Monthly office supplies"
                className="h-10"
              />
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setExpenseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Record Expense
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AccountsPage
