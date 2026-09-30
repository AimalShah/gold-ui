import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Customer } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { toast } from 'sonner'

export function useCustomersPage() {
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

  const customerLedger = ledger.filter((l) => l.customerId === selectedCustomer?.id)
  const customerBills = bills.filter((b) => b.customerId === selectedCustomer?.id)
  const customerOrders = orders.filter((o) => o.customerId === selectedCustomer?.id)
  const customerTehleels = tehleelRecords.filter((t) => t.customerId === selectedCustomer?.id)

  return {
    customers,
    selectedCustomer,
    selectedCustomerIdForDetail,
    setSelectedCustomerIdForDetail,
    search,
    setSearch,
    filterType,
    setFilterType,
    filteredCustomers,
    totalReceivableCashPkr,
    totalReceivableGoldMg,
    totalAdvanceCashPkr,
    customerSheetOpen,
    setCustomerSheetOpen,
    editingCustomer,
    formName,
    setFormName,
    formPhone,
    setFormPhone,
    formAltPhone,
    setFormAltPhone,
    formCnic,
    setFormCnic,
    formCity,
    setFormCity,
    formAddress,
    setFormAddress,
    formGroup,
    setFormGroup,
    formOpeningGoldMg,
    setFormOpeningGoldMg,
    formOpeningCashPkr,
    setFormOpeningCashPkr,
    formCreditLimitPkr,
    setFormCreditLimitPkr,
    formSmsAlerts,
    setFormSmsAlerts,
    formNotes,
    setFormNotes,
    txDialogOpen,
    setTxDialogOpen,
    txType,
    txMedium,
    setTxMedium,
    txAmountPkr,
    setTxAmountPkr,
    txWeightMg,
    setTxWeightMg,
    txRef,
    setTxRef,
    txRemarks,
    setTxRemarks,
    openNewCustomer,
    openEditCustomer,
    handleSaveCustomer,
    openCreditDebit,
    handleSaveTx,
    customerLedger,
    customerBills,
    customerOrders,
    customerTehleels,
  }
}
