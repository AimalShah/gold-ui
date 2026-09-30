import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import { ScaleReader } from '@/components/pos/ScaleReader'
import { cn } from '@/lib/utils'
import {
  calculateGoldValue,
  calculateTotalPrice,
  formatGrams,
  formatTMR,
  DEFAULT_GRAMS_PER_TOLA,
  ChargesMode,
} from '@/lib/gold-math'
import { Customer, Bill } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Printer,
  RotateCcw,
  Search,
  Check,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

export const BillingPage: React.FC = () => {
  const {
    settings,
    mandi,
    addBill,
    currentUser,
    unitMode,
    setCurrentPage,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchInput, setCustomerSearchInput] = useState<string>('')
  const [billType, setBillType] = useState<'sale' | 'purchase'>('sale')

  // Item Details
  const [productName, setProductName] = useState<string>('22 Karat Gold Jewellery')
  const [carat, setCarat] = useState<number>(22)
  const [weightMg, setWeightMg] = useState<number>(11664) // 1 tola default (11.664g)
  const [stoneDeductionMg, setStoneDeductionMg] = useState<number>(0)
  const [polishDeductionMg, setPolishDeductionMg] = useState<number>(122)

  // Rate & Charges
  const defaultRate = mandi.pkrPerTola24k
  const [goldRatePkr, setGoldRatePkr] = useState<number>(defaultRate)
  const [chargesMode, setChargesMode] = useState<ChargesMode>('per_tola')
  const [chargesPkr, setChargesPkr] = useState<number>(1500)

  // Payment
  const [amountReceivedPkr, setAmountReceivedPkr] = useState<number>(0)

  // Modals state
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [lastSavedBill, setLastSavedBill] = useState<Bill | null>(null)

  // Derived Calculations
  const netWeightMg = Math.max(0, weightMg - stoneDeductionMg - polishDeductionMg)
  const goldValuePkr = calculateGoldValue(netWeightMg, goldRatePkr, carat, gramsPerTola)
  const totalAmountPkr = calculateTotalPrice(goldValuePkr, chargesPkr, chargesMode, netWeightMg, gramsPerTola)
  const balanceDuePkr = totalAmountPkr - amountReceivedPkr

  // Select customer helper
  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomer(cust)
    setCustomerSearchInput(cust.name)
    toast.success(`Customer selected: ${cust.name}`)
  }

  // Handle Capture from Scale
  const handleScaleCapture = (capturedMg: number) => {
    setWeightMg(capturedMg)
    toast.success(`Weight updated from scale: ${(capturedMg / 1000).toFixed(3)}g`)
  }

  // Clear Form
  const doClearForm = () => {
    setWeightMg(0)
    setStoneDeductionMg(0)
    setPolishDeductionMg(0)
    setChargesPkr(0)
    setAmountReceivedPkr(0)
    setSelectedCustomer(null)
    setCustomerSearchInput('')
    setProductName('22 Karat Gold Jewellery')
    toast.info('Form cleared')
  }

  // Save Transaction
  const handleSaveBill = () => {
    if (weightMg <= 0) {
      toast.error('Please enter or capture a valid weight before saving.')
      return
    }

    if (amountReceivedPkr < totalAmountPkr && !selectedCustomer) {
      toast.error('Unpaid balance remaining. Please select a customer account to record ledger debt.')
      setCustomerModalOpen(true)
      return
    }

    const saved = addBill({
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: 'gold',
      items: [
        {
          id: `item-${Date.now()}`,
          description: productName,
          weightMg,
          cutPerTolaMg: stoneDeductionMg,
          cutTotalMg: stoneDeductionMg,
          polishPerTolaMg: polishDeductionMg,
          polishTotalMg: polishDeductionMg,
          totalWeightMg: netWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr: totalAmountPkr,
        },
      ],
      totalWeightMg: weightMg,
      cutTotalMg: stoneDeductionMg,
      polishTotalMg: polishDeductionMg,
      netWeightMg,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr: totalAmountPkr,
      wasoolPkr: amountReceivedPkr || totalAmountPkr,
      balancePkr: amountReceivedPkr > 0 ? totalAmountPkr - amountReceivedPkr : 0,
      zakatPkr: Math.round(totalAmountPkr * 0.025),
      user: currentUser.name,
    })

    setLastSavedBill(saved)
    toast.success(`Invoice #${saved.billNo} saved successfully.`)
  }

  const handlePrintCurrent = () => {
    const currentBillRepresentation: Bill = {
      id: 'current-preview',
      billNo: (10080 + 3).toString(),
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: 'gold',
      items: [
        {
          id: 'item-preview',
          description: productName,
          weightMg,
          cutPerTolaMg: stoneDeductionMg,
          cutTotalMg: stoneDeductionMg,
          polishPerTolaMg: polishDeductionMg,
          polishTotalMg: polishDeductionMg,
          totalWeightMg: netWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr: totalAmountPkr,
        },
      ],
      totalWeightMg: weightMg,
      cutTotalMg: stoneDeductionMg,
      polishTotalMg: polishDeductionMg,
      netWeightMg,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr: totalAmountPkr,
      wasoolPkr: amountReceivedPkr || totalAmountPkr,
      balancePkr: amountReceivedPkr > 0 ? totalAmountPkr - amountReceivedPkr : 0,
      zakatPkr: Math.round(totalAmountPkr * 0.025),
      user: currentUser.name,
    }
    setLastSavedBill(currentBillRepresentation)
    setPrintPreviewOpen(true)
  }

  const karatOptions = [
    { value: 24, label: '24 Karat', purity: 'Pure 99.9%' },
    { value: 22, label: '22 Karat', purity: 'Jewellery 91.6%' },
    { value: 21, label: '21 Karat', purity: 'Gulf Standard 87.5%' },
    { value: 18, label: '18 Karat', purity: 'Diamond Mount 75.0%' },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Point of sale</p><h1 className="text-2xl font-bold tracking-tight">Create transaction</h1><p className="mt-1 text-sm text-muted-foreground">Capture the item, confirm the value, and collect payment.</p></div>
          <div className="flex items-center gap-2"><div className="flex rounded-lg border bg-card p-1">{(['sale', 'purchase'] as const).map((type) => <button key={type} type="button" onClick={() => setBillType(type)} className={cn('rounded-md px-4 py-2 text-sm font-semibold capitalize', billType === type ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>{type}</button>)}</div><Button variant="outline" size="sm" onClick={() => weightMg > 0 || amountReceivedPkr > 0 ? setConfirmClearOpen(true) : doClearForm()} className="h-10 gap-2"><RotateCcw /> Clear</Button></div>
        </header>
                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <section className="flex flex-col gap-2">
            <ScaleReader onCaptureWeight={handleScaleCapture} currentWeighedWeightMg={weightMg} />
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wide text-[#17213b]">Item details</h2>
                  <p className="text-sm text-muted-foreground">What are you selling or buying today?</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{carat}K gold</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="product-description" className="text-sm font-semibold">Item name</label>
                  <Input id="product-description" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Gold necklace" className="h-12 text-base" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Purity</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {karatOptions.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setCarat(opt.value)} className={cn('rounded-lg border p-3 text-left transition-colors', carat === opt.value ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary' : 'hover:bg-muted')}>
                        <div className="font-bold">{opt.value}K</div>
                        <div className="text-xs text-muted-foreground">{opt.purity.replace('Jewellery ', '').replace('Pure ', '')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><label className="text-sm font-semibold">Weight</label><WeightInput value={weightMg} onChange={setWeightMg} activeUnit={unitMode} /><span className="text-xs text-muted-foreground">{formatTMR(weightMg, gramsPerTola)} · {formatGrams(weightMg, 3)}g</span></div>
                  <div className="flex flex-col gap-2"><label className="text-sm font-semibold">Gold rate per tola</label><MoneyInput value={goldRatePkr} onChange={setGoldRatePkr} /><span className="text-xs text-muted-foreground">Today&apos;s 24K rate: PKR {defaultRate.toLocaleString()}</span></div>
                </div>

                <div className="rounded-lg border bg-muted/40 p-4">
                  <div className="mb-3 flex items-center justify-between"><div><h3 className="font-semibold">Deductions</h3><p className="text-xs text-muted-foreground">Optional stones and polish</p></div><span className="font-mono font-bold text-primary">{formatGrams(netWeightMg, 3)}g net</span></div>
                  <div className="grid gap-3 sm:grid-cols-2"><div className="flex flex-col gap-2"><label className="text-xs font-medium text-muted-foreground">Stones / gems</label><WeightInput value={stoneDeductionMg} onChange={setStoneDeductionMg} activeUnit={unitMode} /></div><div className="flex flex-col gap-2"><label className="text-xs font-medium text-muted-foreground">Polish / wastage</label><WeightInput value={polishDeductionMg} onChange={setPolishDeductionMg} activeUnit={unitMode} /></div></div>
                </div>

                <div className="flex flex-col gap-2"><div className="flex items-center justify-between"><label className="text-sm font-semibold">Making charges</label><button type="button" onClick={() => setChargesMode(chargesMode === 'per_tola' ? 'fix' : 'per_tola')} className="text-xs font-semibold text-primary">{chargesMode === 'per_tola' ? 'Per tola' : 'Fixed total'}</button></div><MoneyInput value={chargesPkr} onChange={setChargesPkr} /><div className="flex flex-wrap gap-2">{[1000, 1500, 2000, 3500].map((amt) => <button key={amt} type="button" onClick={() => setChargesPkr(amt)} className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">PKR {amt.toLocaleString()}</button>)}</div></div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5 xl:sticky xl:top-6">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold">Customer</h2><p className="text-xs text-muted-foreground">Who is this transaction for?</p></div><Button variant="outline" size="sm" onClick={() => setCustomerModalOpen(true)} className="gap-2"><Search /> Find</Button></div>
              {selectedCustomer ? <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3"><div><p className="font-semibold">{selectedCustomer.name}</p><p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p></div><button type="button" onClick={() => { setSelectedCustomer(null); setCustomerSearchInput('') }} className="text-xs text-destructive">Remove</button></div> : <div className="flex gap-2"><Input aria-label="Customer name" placeholder="Walk-in customer" value={customerSearchInput} onChange={(e) => setCustomerSearchInput(e.target.value)} className="h-10" /><Button variant="outline" onClick={() => setCustomerSearchInput('Walk-in')}>Walk-in</Button></div>}
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Payment</h2><p className="text-xs text-muted-foreground">Review and collect payment</p></div><span className="text-xs text-muted-foreground">{billType === 'sale' ? 'Sale' : 'Purchase'}</span></div>
              <div className="flex flex-col gap-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Gold value</span><span className="font-mono font-semibold">PKR {Math.round(goldValuePkr).toLocaleString()}</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Making charges</span><span className="font-mono font-semibold">PKR {Math.round(totalAmountPkr - goldValuePkr).toLocaleString()}</span></div><div className="rounded-lg bg-primary/10 p-4"><p className="text-sm font-semibold">Total to collect</p><p className="mt-1 text-3xl font-bold text-primary">PKR {Math.round(totalAmountPkr).toLocaleString()}</p></div><div className="flex items-center justify-between"><label htmlFor="amount-received" className="text-sm font-semibold">Amount received</label><button type="button" onClick={() => setAmountReceivedPkr(totalAmountPkr)} className="text-xs font-semibold text-primary">Exact amount</button></div><MoneyInput value={amountReceivedPkr} onChange={setAmountReceivedPkr} /><div className="flex flex-wrap gap-2">{[5000, 10000, 50000, 100000].map((add) => <button key={add} type="button" onClick={() => setAmountReceivedPkr((amountReceivedPkr || 0) + add)} className="rounded-md border bg-muted/40 px-2.5 py-1.5 text-xs hover:bg-muted">+{add >= 1000 ? `${add / 1000}k` : add}</button>)}</div><div className={cn('flex items-center justify-between rounded-lg border p-3 text-sm font-semibold', balanceDuePkr > 0 ? 'bg-rose-500/10 text-rose-600' : balanceDuePkr < 0 ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600')}><span>{balanceDuePkr > 0 ? 'Balance due' : balanceDuePkr < 0 ? 'Change to customer' : 'Payment status'}</span><span>{balanceDuePkr === 0 ? 'Fully paid' : `PKR ${Math.abs(Math.round(balanceDuePkr)).toLocaleString()}`}</span></div><div className="flex gap-2 pt-2"><Button onClick={handleSaveBill} className="h-12 flex-1 gap-2 text-base font-bold"><Check /> Save sale</Button><Button variant="outline" onClick={handlePrintCurrent} className="h-12 gap-2"><Printer /> Print</Button></div></div>
            </div>
          </aside>
        </div>
      </div>

      {/* MODALS */}
      <CustomerSelectModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onSelectCustomer={handleSelectCustomer}
        onNewCustomer={() => {
          setCustomerModalOpen(false)
          setCurrentPage('customers')
        }}
      />
      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear Current Transaction?"
        description="Are you sure you want to clear the weight, deductions, and payment details?"
        onConfirm={doClearForm}
        confirmText="Clear Form"
        variant="destructive"
      />
      <PrintPreviewDialog
        open={printPreviewOpen}
        onOpenChange={setPrintPreviewOpen}
        bill={lastSavedBill}
      />
    </div>
  )
}

export default BillingPage
