import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Customer, LedgerEntry } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Users,
  Search,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  MapPin,
  Edit,
  Download,
  CreditCard,
  Scale,
} from 'lucide-react'
import { toast } from 'sonner'

export const CustomersPage: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    ledger,
    addLedgerEntry,
    bills,
    orders,
    tehleelRecords,
    selectedCustomerIdForDetail,
    setSelectedCustomerIdForDetail,
  } = useApp()

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Selected customer for View / Detail
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerIdForDetail) || customers[0] || null

  // Customer Form Sheet
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formAltPhone, setFormAltPhone] = useState('')
  const [formCnic, setFormCnic] = useState('')
  const [formCity, setFormCity] = useState('Lahore')
  const [formAddress, setFormAddress] = useState('')
  const [formGroup, setFormGroup] = useState('Retailer')
  const [formOpeningGoldMg, setFormOpeningGoldMg] = useState(0)
  const [formOpeningCashPkr, setFormOpeningCashPkr] = useState(0)
  const [formCreditLimitPkr, setFormCreditLimitPkr] = useState(500000)
  const [formSmsAlerts, setFormSmsAlerts] = useState(true)
  const [formNotes, setFormNotes] = useState('')

  // Credit / Debit Dialog
  const [txDialogOpen, setTxDialogOpen] = useState(false)
  const [txType, setTxType] = useState<'credit' | 'debit'>('credit')
  const [txMedium, setTxMedium] = useState<'cash' | 'gold'>('cash')
  const [txAmountPkr, setTxAmountPkr] = useState(0)
  const [txWeightMg, setTxWeightMg] = useState(0)
  const [txRef, setTxRef] = useState('')
  const [txRemarks, setTxRemarks] = useState('')

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (filterType === 'owes_gold') return c.goldBalanceMg > 0
    if (filterType === 'owes_cash') return c.cashBalancePkr > 0
    if (filterType === 'advance') return c.cashBalancePkr < 0 || c.goldBalanceMg < 0
    if (filterType === 'inactive') return !c.active
    return true
  })

  // Summary Metrics
  const totalReceivableCashPkr = customers.filter(c => c.cashBalancePkr > 0).reduce((sum, c) => sum + c.cashBalancePkr, 0)
  const totalReceivableGoldMg = customers.filter(c => c.goldBalanceMg > 0).reduce((sum, c) => sum + c.goldBalanceMg, 0)
  const totalAdvanceCashPkr = Math.abs(customers.filter(c => c.cashBalancePkr < 0).reduce((sum, c) => sum + c.cashBalancePkr, 0))

  const openNewCustomer = () => {
    setEditingCustomer(null)
    setFormName('')
    setFormPhone('')
    setFormAltPhone('')
    setFormCnic('')
    setFormCity('Lahore')
    setFormAddress('')
    setFormGroup('Retailer')
    setFormOpeningGoldMg(0)
    setFormOpeningCashPkr(0)
    setFormCreditLimitPkr(500000)
    setFormSmsAlerts(true)
    setFormNotes('')
    setCustomerSheetOpen(true)
  }

  const openEditCustomer = (c: Customer) => {
    setEditingCustomer(c)
    setFormName(c.name)
    setFormPhone(c.phone)
    setFormAltPhone(c.altPhone || '')
    setFormCnic(c.cnic || '')
    setFormCity(c.city)
    setFormAddress(c.address)
    setFormGroup(c.group)
    setFormOpeningGoldMg(c.goldBalanceMg)
    setFormOpeningCashPkr(c.cashBalancePkr)
    setFormCreditLimitPkr(c.creditLimitPkr)
    setFormSmsAlerts(c.smsAlerts)
    setFormNotes(c.notes || '')
    setCustomerSheetOpen(true)
  }

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formPhone.trim()) {
      toast.error("Customer name and phone number are required.")
      return
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formName,
        phone: formPhone,
        altPhone: formAltPhone,
        cnic: formCnic,
        city: formCity,
        address: formAddress,
        group: formGroup,
        creditLimitPkr: formCreditLimitPkr,
        smsAlerts: formSmsAlerts,
        notes: formNotes,
      })
      toast.success(`Updated customer: ${formName}`)
    } else {
      const created = addCustomer({
        name: formName,
        phone: formPhone,
        altPhone: formAltPhone,
        cnic: formCnic,
        city: formCity,
        address: formAddress,
        group: formGroup,
        goldBalanceMg: formOpeningGoldMg,
        cashBalancePkr: formOpeningCashPkr,
        creditLimitPkr: formCreditLimitPkr,
        creditLimitGoldMg: 116640,
        smsAlerts: formSmsAlerts,
        active: true,
        notes: formNotes,
      })
      toast.success(`Customer created: ${created.name} (${created.id})`)
      setSelectedCustomerIdForDetail(created.id)
    }

    setCustomerSheetOpen(false)
  }

  const openCreditDebit = (type: 'credit' | 'debit') => {
    if (!selectedCustomer) return
    setTxType(type)
    setTxMedium('cash')
    setTxAmountPkr(0)
    setTxWeightMg(0)
    setTxRef(`REC-${Math.floor(100 + Math.random() * 900)}`)
    setTxRemarks('')
    setTxDialogOpen(true)
  }

  const handleSaveTx = () => {
    if (!selectedCustomer) return

    const isCredit = txType === 'credit'
    let goldChange = 0
    let cashChange = 0

    if (txMedium === 'cash') {
      if (txAmountPkr <= 0) {
        toast.error("Please enter a valid cash amount.")
        return
      }
      cashChange = isCredit ? -txAmountPkr : txAmountPkr
    } else {
      if (txWeightMg <= 0) {
        toast.error("Please enter a valid gold weight.")
        return
      }
      goldChange = isCredit ? -txWeightMg : txWeightMg
    }

    const updatedCash = selectedCustomer.cashBalancePkr + cashChange
    const updatedGold = selectedCustomer.goldBalanceMg + goldChange

    updateCustomer(selectedCustomer.id, {
      cashBalancePkr: updatedCash,
      goldBalanceMg: updatedGold,
      lastTransactionDate: new Date().toISOString().split('T')[0],
    })

    addLedgerEntry({
      customerId: selectedCustomer.id,
      date: new Date().toISOString().split('T')[0],
      ref: txRef || 'VOUCHER',
      type: txType,
      description: `${isCredit ? 'Credit (+)' : 'Debit (−)'} ${txMedium === 'cash' ? `Cash: ${formatMoney(txAmountPkr)}` : `Gold: ${formatGrams(txWeightMg)}g`} — ${txRemarks || 'Account Settlement'}`,
      goldInMg: isCredit && txMedium === 'gold' ? txWeightMg : 0,
      goldOutMg: !isCredit && txMedium === 'gold' ? txWeightMg : 0,
      cashInPkr: isCredit && txMedium === 'cash' ? txAmountPkr : 0,
      cashOutPkr: !isCredit && txMedium === 'cash' ? txAmountPkr : 0,
      runningGoldMg: updatedGold,
      runningCashPkr: updatedCash,
    })

    toast.success(`Recorded ${isCredit ? 'Credit' : 'Debit'} voucher successfully!`)
    setTxDialogOpen(false)
  }

  // Filtered customer-specific entries
  const customerLedger = ledger.filter((l) => l.customerId === selectedCustomer?.id)
  const customerBills = bills.filter((b) => b.customerId === selectedCustomer?.id)
  const customerOrders = orders.filter((o) => o.customerId === selectedCustomer?.id)
  const customerTehleels = tehleelRecords.filter((t) => t.customerId === selectedCustomer?.id)

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Page Header */}
      <PageTitle
        description="Customer account management, dual-currency (Gold & Cash) balance ledgers, and credit limits."
        action={
          <Button
            size="lg"
            onClick={openNewCustomer}
            className="gap-2 font-medium"
          >
            <UserPlus className="size-4" /> Add Customer
          </Button>
        }
      >
        Customers & Dual Ledger
      </PageTitle>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Total Customers</span>
            <Users className="size-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{customers.length} Accounts</p>
          <span className="text-xs text-muted-foreground">Registered Sarafa Retailers</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Total Cash Dues</span>
            <CreditCard className="size-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-destructive mt-2">{formatMoney(totalReceivableCashPkr)}</p>
          <span className="text-xs text-muted-foreground">Owed by 18 Accounts</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Total Gold Owed</span>
            <Scale className="size-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{formatGrams(totalReceivableGoldMg)}g</p>
          <span className="text-xs text-muted-foreground font-mono">{formatTMR(totalReceivableGoldMg)}</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Advance Deposits</span>
            <ArrowDownLeft className="size-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{formatMoney(totalAdvanceCashPkr)}</p>
          <span className="text-xs text-muted-foreground">Client Cash Held</span>
        </Card>
      </div>

      {/* 3. Action & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:basis-[50%]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name, phone, city, account ID..."
              className="h-11 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-11 md:basis-[30%]">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customer Accounts</SelectItem>
              <SelectItem value="owes_gold">Owes Gold Balance</SelectItem>
              <SelectItem value="owes_cash">Owes Cash Balance</SelectItem>
              <SelectItem value="advance">Advance (Credit)</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full md:basis-[20%]"
            onClick={() => {
              setSearch('')
              setFilterType('all')
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* 4. Split Workspace: Customer List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: Customer Accounts List */}
        <div className="lg:col-span-4 rounded-lg border border-border bg-card overflow-hidden flex flex-col h-full shadow-xs">
          <div className="p-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
            <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
              Customer Directory ({filteredCustomers.length})
            </span>
          </div>

          <div className="divide-y divide-border overflow-y-auto max-h-[600px]">
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id
              const owesGold = c.goldBalanceMg > 0
              const owesCash = c.cashBalancePkr > 0

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerIdForDetail(c.id)}
                  className={`p-4 cursor-pointer transition-colors text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-accent/60 border-l-4 border-primary text-foreground'
                      : 'hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground truncate max-w-[180px]">
                      {c.name}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {c.group}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.phone}</span>
                    <span>{c.city}</span>
                  </div>

                  {/* Dual Balances */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-border/60 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Gold:</span>
                      <span className={owesGold ? "text-destructive font-semibold" : c.goldBalanceMg < 0 ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                        {formatGrams(c.goldBalanceMg)}g
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-muted-foreground block">Cash:</span>
                      <span className={owesCash ? "text-destructive font-semibold" : c.cashBalancePkr < 0 ? "text-emerald-600 font-semibold" : "text-muted-foreground"}>
                        {formatMoney(c.cashBalancePkr)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Detailed Ledger View */}
        <div className="lg:col-span-8 rounded-lg border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
          {selectedCustomer ? (
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
                    onClick={() => openCreditDebit('credit')}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs"
                  >
                    <ArrowDownLeft className="size-4" /> Credit (+)
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openCreditDebit('debit')}
                    className="gap-1.5 font-medium text-xs"
                  >
                    <ArrowUpRight className="size-4" /> Debit (−)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditCustomer(selectedCustomer)}
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
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Users className="size-12 stroke-1 text-muted-foreground/60 mb-2" />
              <h3 className="font-semibold text-foreground">No customer selected</h3>
              <p className="text-xs mt-1">Click a customer account from the left directory to view full details.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Create / Edit Customer Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="text-lg font-bold text-foreground">
              {editingCustomer ? `Edit Customer — ${editingCustomer.id}` : 'Create New Customer Account'}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Fill in customer profile and opening dual ledger balances (Gold & Cash).
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveCustomer} className="space-y-4 py-4 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sheikh Tariq Mahmood"
                className="h-10"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Alternate Phone</Label>
                <Input
                  value={formAltPhone}
                  onChange={(e) => setFormAltPhone(e.target.value)}
                  placeholder="042-3712345"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City</Label>
                <Input
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="Lahore / Karachi"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Customer Group</Label>
                <Select value={formGroup} onValueChange={setFormGroup}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retailer">Retailer</SelectItem>
                    <SelectItem value="Wholesaler / Dealer">Wholesaler / Dealer</SelectItem>
                    <SelectItem value="Walk-in VIP">Walk-in VIP</SelectItem>
                    <SelectItem value="Workshop Karigar">Workshop Karigar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Shop / Residential Address</Label>
              <Input
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="e.g. Sarafa Bazar, Shop #12"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Credit Limit (PKR)</Label>
              <MoneyInput
                value={formCreditLimitPkr}
                onChange={setFormCreditLimitPkr}
                className="h-10"
              />
            </div>

            {/* Opening Balances */}
            {!editingCustomer && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground block">
                  Opening Dual Balances (Optional)
                </span>
                <div className="space-y-1">
                  <Label className="text-xs">Opening Gold Balance</Label>
                  <WeightInput
                    value={formOpeningGoldMg}
                    onChange={setFormOpeningGoldMg}
                    allowNegative={true}
                    compact={true}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Opening Cash Balance (PKR)</Label>
                  <MoneyInput
                    value={formOpeningCashPkr}
                    onChange={setFormOpeningCashPkr}
                    allowNegative={true}
                    className="h-10"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">SMS Transaction Alerts</Label>
                <p className="text-[11px] text-muted-foreground">Send auto SMS on bills and ledger receipts</p>
              </div>
              <Switch checked={formSmsAlerts} onCheckedChange={setFormSmsAlerts} />
            </div>

            <SheetFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setCustomerSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                {editingCustomer ? 'Save Changes' : 'Create Account'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* MODAL 2: Credit / Debit Voucher Dialog */}
      <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className={`text-base font-bold flex items-center gap-2 ${txType === 'credit' ? 'text-emerald-600' : 'text-destructive'}`}>
              {txType === 'credit' ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
              {txType === 'credit' ? 'Customer Credit (+) Voucher' : 'Customer Debit (−) Voucher'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Customer: <strong>{selectedCustomer?.name}</strong> ({selectedCustomer?.id})
            </p>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Transaction Medium</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={txMedium === 'cash' ? 'default' : 'outline'}
                  onClick={() => setTxMedium('cash')}
                  className="font-semibold"
                >
                  Cash (PKR)
                </Button>
                <Button
                  type="button"
                  variant={txMedium === 'gold' ? 'default' : 'outline'}
                  onClick={() => setTxMedium('gold')}
                  className="font-semibold"
                >
                  Gold Weight (Au)
                </Button>
              </div>
            </div>

            {txMedium === 'cash' ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Cash Amount (PKR)</Label>
                <MoneyInput
                  value={txAmountPkr}
                  onChange={setTxAmountPkr}
                  autoFocus
                  className="h-11 text-base font-bold"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Gold Weight</Label>
                <WeightInput
                  value={txWeightMg}
                  onChange={setTxWeightMg}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Reference #</Label>
                <Input
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Narration / Remarks</Label>
              <Input
                value={txRemarks}
                onChange={(e) => setTxRemarks(e.target.value)}
                placeholder="e.g. Account settlement / token advance"
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" onClick={() => setTxDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTx}
              className={`font-semibold ${txType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-destructive text-white'}`}
            >
              Save Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default CustomersPage
