import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Customer, LedgerEntry } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { LedgerBadge } from '@/components/shared/LedgerBadge'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
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
  Receipt,
  FileText,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Edit,
  Hammer,
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
    setCurrentPage,
    selectedCustomerIdForDetail,
    setSelectedCustomerIdForDetail,
  } = useApp()

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Selected customer for View / Detail
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerIdForDetail) || null

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
      // Customer Credit (+) = customer gives cash to shop, reducing dues (cashIn)
      // Customer Debit (-) = customer withdraws cash, increasing dues (cashOut)
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

    toast.success(`Recorded ${isCredit ? 'Credit' : 'Debit'} of ${txMedium === 'cash' ? formatMoney(txAmountPkr) : `${formatGrams(txWeightMg)}g`}!`)
    setTxDialogOpen(false)
  }

  // Filtered customer-specific entries
  const customerLedger = ledger.filter((l) => l.customerId === selectedCustomer?.id)
  const customerBills = bills.filter((b) => b.customerId === selectedCustomer?.id)
  const customerOrders = orders.filter((o) => o.customerId === selectedCustomer?.id)
  const customerTehleels = tehleelRecords.filter((t) => t.customerId === selectedCustomer?.id)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Action Toolbar */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-foreground" />
          <h1 className="font-bold text-sm text-foreground">Customers & Dual Ledger Register</h1>
          <Badge variant="secondary" className="text-xs font-mono ml-2">
            {customers.length} Accounts
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={openNewCustomer}
            className="h-8 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs gap-1.5 shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            New Customer
          </Button>
        </div>
      </div>

      {/* Split view: Left List (35%), Right Customer View / Ledger (65%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Customers List */}
        <div className="w-[360px] lg:w-[420px] border-r flex flex-col h-full bg-card/20 shrink-0">
          {/* Search & Filter Toolbar */}
          <div className="p-3 border-b space-y-2 bg-card/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search name, phone, city, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs font-sans"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-7 text-xs flex-1">
                  <SelectValue placeholder="Filter balance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="owes_gold">Owes Gold Balance</SelectItem>
                  <SelectItem value="owes_cash">Owes Cash Balance</SelectItem>
                  <SelectItem value="advance">Advance (Credit)</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id
              const owesGold = c.goldBalanceMg > 0
              const owesCash = c.cashBalancePkr > 0

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerIdForDetail(c.id)}
                  className={`p-3 cursor-pointer transition-colors text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-l-4 border-amber-600 text-foreground'
                      : 'hover:bg-muted/60 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground truncate max-w-[200px]">
                      {c.name}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted text-foreground">
                      {c.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{c.phone}</span>
                    <span>{c.city}</span>
                  </div>

                  {/* Dual balance chips */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-sans uppercase text-muted-foreground">Gold:</span>
                      <span className={owesGold ? "text-red-600 font-bold" : c.goldBalanceMg < 0 ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                        {formatGrams(c.goldBalanceMg)}g
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-sans uppercase text-muted-foreground">Cash:</span>
                      <span className={owesCash ? "text-red-600 font-bold" : c.cashBalancePkr < 0 ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                        {formatMoney(c.cashBalancePkr)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Customer View / Detail (I+V) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          {selectedCustomer ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Customer Header Summary Card */}
              <div className="p-4 border-b bg-card/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{selectedCustomer.name}</h2>
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedCustomer.id}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {selectedCustomer.group}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedCustomer.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedCustomer.address}, {selectedCustomer.city}</span>
                      {selectedCustomer.cnic && <span>CNIC: {selectedCustomer.cnic}</span>}
                    </div>
                  </div>

                  {/* Top Action Buttons for this customer */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => openCreditDebit('credit')}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold"
                      title="Customer Payment Received (I+C)"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      Credit (+)
                      <HotkeyHint hotkey="I+C" className="h-3.5 text-[8px] bg-emerald-800 text-white border-emerald-500" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => openCreditDebit('debit')}
                      className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white gap-1 font-semibold"
                      title="Customer Gold / Cash Given (I+D)"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Debit (−)
                      <HotkeyHint hotkey="I+D" className="h-3.5 text-[8px] bg-red-800 text-white border-red-500" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditCustomer(selectedCustomer)}
                      className="h-8 text-xs gap-1 font-semibold"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Balances Banner */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t">
                  <div className="p-2.5 rounded-md bg-muted/40 border">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Gold Balance</div>
                    <div className={`text-base font-mono font-bold ${selectedCustomer.goldBalanceMg > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {formatGrams(selectedCustomer.goldBalanceMg, 3)} g
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">{formatTMR(selectedCustomer.goldBalanceMg)}</div>
                  </div>

                  <div className="p-2.5 rounded-md bg-muted/40 border">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Cash Balance</div>
                    <div className={`text-base font-mono font-bold ${selectedCustomer.cashBalancePkr > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {formatMoney(selectedCustomer.cashBalancePkr)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {selectedCustomer.cashBalancePkr > 0 ? 'Customer Owes Shop' : selectedCustomer.cashBalancePkr < 0 ? 'Advance Cash Held' : 'Account Balanced'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-md bg-muted/40 border">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Credit Limit</div>
                    <div className="text-base font-mono font-semibold text-foreground">
                      {formatMoney(selectedCustomer.creditLimitPkr)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">SMS Alerts: {selectedCustomer.smsAlerts ? 'Active' : 'Off'}</div>
                  </div>

                  <div className="p-2.5 rounded-md bg-muted/40 border">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Last Transaction</div>
                    <div className="text-base font-mono font-semibold text-foreground">
                      {selectedCustomer.lastTransactionDate}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{customerBills.length} Bills • {customerOrders.length} Orders</div>
                  </div>
                </div>
              </div>

              {/* Tabs for Customer Details: Ledger, Bills, Orders, Tehleel, Notes */}
              <div className="flex-1 flex flex-col overflow-hidden p-4">
                <Tabs defaultValue="ledger" className="flex-1 flex flex-col overflow-hidden">
                  <TabsList className="h-9 w-fit mb-3">
                    <TabsTrigger value="ledger" className="text-xs">Ledger (Dual Statement)</TabsTrigger>
                    <TabsTrigger value="bills" className="text-xs">Bills History ({customerBills.length})</TabsTrigger>
                    <TabsTrigger value="orders" className="text-xs">Workshop Orders ({customerOrders.length})</TabsTrigger>
                    <TabsTrigger value="tehleel" className="text-xs">Tehleel Tests ({customerTehleels.length})</TabsTrigger>
                    <TabsTrigger value="notes" className="text-xs">Customer Notes</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Dual Currency Ledger */}
                  <TabsContent value="ledger" className="flex-1 overflow-y-auto mt-0 border rounded-md">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                        <tr>
                          <th className="py-3 px-3.5">Date</th>
                          <th className="py-3 px-3.5">Ref #</th>
                          <th className="py-3 px-3.5">Description</th>
                          <th className="py-3 px-3.5 text-right font-medium">Gold In (g)</th>
                          <th className="py-3 px-3.5 text-right font-medium">Gold Out (g)</th>
                          <th className="py-3 px-3.5 text-right font-medium">Cash In (PKR)</th>
                          <th className="py-3 px-3.5 text-right font-medium">Cash Out (PKR)</th>
                          <th className="py-3 px-3.5 text-right font-bold">Gold Bal (g)</th>
                          <th className="py-3 px-3.5 text-right font-bold">Cash Bal (Rs)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-mono">
                        {customerLedger.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground font-sans">
                              No ledger entries recorded yet for this customer.
                            </td>
                          </tr>
                        ) : (
                          customerLedger.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                              <td className="py-3 px-3.5">{row.date}</td>
                              <td className="py-3 px-3.5 font-bold text-foreground">{row.ref}</td>
                              <td className="py-3 px-3.5 font-sans text-foreground max-w-[220px] truncate">{row.description}</td>
                              <td className="py-3 px-3.5 text-right font-medium">{row.goldInMg ? formatGrams(row.goldInMg) : '—'}</td>
                              <td className="py-3 px-3.5 text-right font-medium">{row.goldOutMg ? formatGrams(row.goldOutMg) : '—'}</td>
                              <td className="py-3 px-3.5 text-right font-medium">{row.cashInPkr ? formatMoney(row.cashInPkr) : '—'}</td>
                              <td className="py-3 px-3.5 text-right font-medium">{row.cashOutPkr ? formatMoney(row.cashOutPkr) : '—'}</td>
                              <td className="py-3 px-3.5 text-right font-bold">{formatGrams(row.runningGoldMg)}</td>
                              <td className="py-3 px-3.5 text-right font-bold">{formatMoney(row.runningCashPkr)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </TabsContent>

                  {/* Tab 2: Bills */}
                  <TabsContent value="bills" className="flex-1 overflow-y-auto mt-0 border rounded-md">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                        <tr>
                          <th className="py-2 px-3">Bill #</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3 text-right">Net Wt</th>
                          <th className="py-2 px-3 text-right">Rate</th>
                          <th className="py-2 px-3 text-right">Total</th>
                          <th className="py-2 px-3 text-right">Wasool</th>
                          <th className="py-2 px-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-mono">
                        {customerBills.map((b) => (
                          <tr key={b.id} className="hover:bg-muted/40">
                            <td className="py-2 px-3 font-bold text-amber-700">#{b.billNo}</td>
                            <td className="py-2 px-3">{b.date}</td>
                            <td className="py-2 px-3 text-right font-semibold">{formatGrams(b.netWeightMg)}g</td>
                            <td className="py-2 px-3 text-right">{b.goldRatePkr.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right font-bold">{formatMoney(b.totalPricePkr)}</td>
                            <td className="py-2 px-3 text-right text-emerald-700">{formatMoney(b.wasoolPkr)}</td>
                            <td className="py-2 px-3 text-right text-red-600 font-bold">{formatMoney(b.balancePkr)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TabsContent>

                  {/* Tab 3: Orders */}
                  <TabsContent value="orders" className="flex-1 overflow-y-auto mt-0 border rounded-md p-3 space-y-2">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3 rounded border flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-700">#{ord.orderNo}</span>
                            <span className="font-semibold text-foreground">{ord.itemDescription}</span>
                            <Badge variant="outline" className="text-[10px]">{ord.status}</Badge>
                          </div>
                          <div className="text-muted-foreground text-[11px]">
                            Weight: {formatGrams(ord.weightRequiredMg)}g ({ord.carat}K) • Due: {ord.deliveryDate} • Karigar: {ord.karigarName || 'Unassigned'}
                          </div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <div>Advance Cash: {formatMoney(ord.advanceCashPkr)}</div>
                          <div>Making: {formatMoney(ord.makingChargesPkr)}</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Tab 4: Tehleel */}
                  <TabsContent value="tehleel" className="flex-1 overflow-y-auto mt-0 border rounded-md">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                        <tr>
                          <th className="py-2 px-3">Test #</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3 text-right">1st Wt</th>
                          <th className="py-2 px-3 text-right">Pure Gold</th>
                          <th className="py-2 px-3 text-right">Purity Karat</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-mono">
                        {customerTehleels.map((t) => (
                          <tr key={t.id} className="hover:bg-muted/40">
                            <td className="py-2 px-3 font-bold text-amber-700">{t.testNo}</td>
                            <td className="py-2 px-3">{t.date}</td>
                            <td className="py-2 px-3 text-right">{formatGrams(t.firstWeightMg)}g</td>
                            <td className="py-2 px-3 text-right font-bold text-amber-600">{formatGrams(t.pureGoldMg)}g</td>
                            <td className="py-2 px-3 text-right font-bold">{t.carat}K ({t.permille}‰)</td>
                            <td className="py-2 px-3 text-right">{formatMoney(t.amountPkr)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TabsContent>

                  {/* Tab 5: Notes */}
                  <TabsContent value="notes" className="p-4 border rounded-md text-xs space-y-2 mt-0">
                    <Label className="text-xs font-semibold">Special Customer Terms & Remarks</Label>
                    <p className="p-3 bg-muted/40 rounded border text-muted-foreground font-mono">
                      {selectedCustomer.notes || 'No special terms entered for this account.'}
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-base text-foreground">No Customer Selected</h3>
              <p className="text-xs max-w-sm mt-1">
                Select a customer from the left list, or click "+ New Customer" to register a new account.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: New / Edit Customer Sheet */}
      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="text-base font-bold text-amber-900 dark:text-amber-300">
              {editingCustomer ? `Edit Customer — ${editingCustomer.id}` : 'Create New Customer Account'}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Fill in customer profile and opening dual ledger balances (Gold & Cash).
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveCustomer} className="space-y-3.5 py-4 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sheikh Tariq Mahmood"
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Alternate Phone</Label>
                <Input
                  value={formAltPhone}
                  onChange={(e) => setFormAltPhone(e.target.value)}
                  placeholder="042-3712345"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">CNIC Number</Label>
                <Input
                  value={formCnic}
                  onChange={(e) => setFormCnic(e.target.value)}
                  placeholder="35201-xxxxxxx-x"
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">City</Label>
                <Input
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="Lahore / Karachi"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Address / Shop</Label>
              <Input
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="e.g. Sarafa Bazar, Shop #12"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Customer Group</Label>
                <Select value={formGroup} onValueChange={setFormGroup}>
                  <SelectTrigger className="h-8 text-xs">
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

              <div className="space-y-1">
                <Label className="text-xs">Credit Limit (PKR)</Label>
                <MoneyInput
                  value={formCreditLimitPkr}
                  onChange={setFormCreditLimitPkr}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Opening Balances (Only for new customer) */}
            {!editingCustomer && (
              <div className="p-3 bg-muted/40 rounded border space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Opening Dual Balances (Optional)
                </h4>
                <div className="space-y-1">
                  <Label className="text-xs">Opening Gold Balance (Tola/Masha/Ratti/Grams)</Label>
                  <WeightInput
                    value={formOpeningGoldMg}
                    onChange={setFormOpeningGoldMg}
                    allowNegative={true}
                    compact={true}
                  />
                  <p className="text-[10px] text-muted-foreground">Positive = customer owes gold; Negative = shop owes</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Opening Cash Balance (PKR)</Label>
                  <MoneyInput
                    value={formOpeningCashPkr}
                    onChange={setFormOpeningCashPkr}
                    allowNegative={true}
                    className="h-8 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Positive = customer owes cash; Negative = advance credit</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold cursor-pointer">SMS Transaction Alerts</Label>
                <p className="text-[10px] text-muted-foreground">Send auto SMS on bills and ledger receipts</p>
              </div>
              <Switch checked={formSmsAlerts} onCheckedChange={setFormSmsAlerts} />
            </div>

            <SheetFooter className="pt-4 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setCustomerSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                {editingCustomer ? 'Save Changes' : 'Create Account'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* MODAL 2: Credit (+) / Debit (−) Dialog (I+C, I+D) */}
      <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className={`text-base font-bold flex items-center gap-2 ${txType === 'credit' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600'}`}>
              {txType === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
              {txType === 'credit' ? 'Customer Credit (+) Voucher' : 'Customer Debit (−) Voucher'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Customer: <strong>{selectedCustomer?.name}</strong> ({selectedCustomer?.id})
            </p>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            {/* Medium Toggle: Cash or Gold */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Transaction Medium</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxMedium('cash')}
                  className={`p-2 rounded border text-center font-bold text-xs transition-colors ${
                    txMedium === 'cash' ? 'bg-amber-500 text-white border-amber-600' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Cash (PKR)
                </button>
                <button
                  type="button"
                  onClick={() => setTxMedium('gold')}
                  className={`p-2 rounded border text-center font-bold text-xs transition-colors ${
                    txMedium === 'gold' ? 'bg-amber-500 text-white border-amber-600' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  Gold Weight (Au)
                </button>
              </div>
            </div>

            {txMedium === 'cash' ? (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Cash Amount (PKR)</Label>
                <MoneyInput
                  value={txAmountPkr}
                  onChange={setTxAmountPkr}
                  autoFocus
                  className="h-10 text-base font-bold"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Gold Weight (Tola / Masha / Ratti / Grams)</Label>
                <WeightInput
                  value={txWeightMg}
                  onChange={setTxWeightMg}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Reference / Voucher #</Label>
                <Input
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Remarks / Narration</Label>
              <Input
                value={txRemarks}
                onChange={(e) => setTxRemarks(e.target.value)}
                placeholder="e.g. Account settlement / token advance"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setTxDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveTx}
              className={`font-semibold ${txType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              Save Voucher (F8)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
