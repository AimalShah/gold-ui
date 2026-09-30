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
  Sparkles,
  User,
  X,
  Receipt,
  Scale,
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
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-3 md:p-5">
      {/* 98vw Wide Layout Container */}
      <div className="w-[98vw] max-w-[98vw] mx-auto space-y-4">
        {/* Top Control Bar: Transaction Switcher & Reset Button (No mandi rate) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            {/* Clean Transaction Type Switcher */}
            <div className="flex rounded-lg bg-muted/70 p-1 border border-border">
              <button
                type="button"
                onClick={() => setBillType('sale')}
                className={cn(
                  'px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer transition-all',
                  billType === 'sale'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Sale Transaction
              </button>
              <button
                type="button"
                onClick={() => setBillType('purchase')}
                className={cn(
                  'px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer transition-all',
                  billType === 'purchase'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Purchase Transaction
              </button>
            </div>
          </div>

          {/* Right Header items: Reset Form Button (mandi rate removed from top bar) */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (weightMg > 0 || amountReceivedPkr > 0) {
                  setConfirmClearOpen(true)
                } else {
                  doClearForm()
                }
              }}
              className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-destructive border-border cursor-pointer transition-colors"
              title="Clear Form"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              <span>Reset Form</span>
            </Button>
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: DIGITAL SCALE & PRODUCT SPECIFICATIONS (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. DIGITAL WEIGHING SCALE COMPONENT */}
            <ScaleReader onCaptureWeight={handleScaleCapture} currentWeighedWeightMg={weightMg} />

            {/* 2. PRODUCT SPECIFICATIONS & WEIGHTS */}
            <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground tracking-tight">
                      Product & Gold Specifications
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Item description, purity, weights and non-gold deductions
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {carat}K Fine
                </span>
              </div>

              {/* Product Name (Full Width) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground block">
                  Product Description
                </label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. 22 Karat Bridal Necklace Set, Handcrafted Bangles"
                  className="h-11 text-sm font-medium w-full bg-background border-border rounded-lg"
                />
              </div>

              {/* Gold Purity (Full Width Option Cards) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Gold Purity Standard
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Select target karat benchmark
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {karatOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCarat(opt.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all cursor-pointer w-full relative',
                        carat === opt.value
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary'
                          : 'border-border bg-background hover:bg-muted/50 text-foreground'
                      )}
                    >
                      <div className="text-base font-bold tracking-tight">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.purity}</div>
                      {carat === opt.value && (
                        <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gross Weight & Gold Rate (Full Width Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">
                      Gross Weight
                    </label>
                    <span className="text-xs font-mono font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted/60">
                      {formatTMR(weightMg, gramsPerTola)}
                    </span>
                  </div>
                  <WeightInput
                    value={weightMg}
                    onChange={(mg) => setWeightMg(mg)}
                    activeUnit={unitMode}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">
                      Gold Rate / Tola (PKR)
                    </label>
                    <span className="text-xs font-mono text-muted-foreground">
                      24K: {defaultRate.toLocaleString()}
                    </span>
                  </div>
                  <MoneyInput
                    value={goldRatePkr}
                    onChange={(pkr) => setGoldRatePkr(pkr)}
                  />
                </div>
              </div>

              {/* DEDUCTIONS SECTION */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Non-Gold Deductions
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Enter stones, gems, and polish wastage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block">
                      Stone & Gem Deduction
                    </label>
                    <WeightInput
                      value={stoneDeductionMg}
                      onChange={(mg) => setStoneDeductionMg(mg)}
                      activeUnit={unitMode}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block">
                      Wastage & Polish Deduction
                    </label>
                    <WeightInput
                      value={polishDeductionMg}
                      onChange={(mg) => setPolishDeductionMg(mg)}
                      activeUnit={unitMode}
                    />
                  </div>
                </div>

                {/* Net Fine Weight Hero Badge */}
                <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-foreground block">
                      Net Fine Gold Weight
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Calculated pure gold base for pricing
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-primary">
                      {formatGrams(netWeightMg, 3)} Grams
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {formatTMR(netWeightMg, gramsPerTola)}
                    </div>
                  </div>
                </div>
              </div>

              {/* MAKING & CRAFTING CHARGES */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Making & Crafting Charges (PKR)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = chargesMode === 'per_tola' ? 'fix' : 'per_tola'
                      setChargesMode(next)
                    }}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer px-2 py-0.5 rounded bg-primary/10 border border-primary/20"
                  >
                    Mode: {chargesMode === 'per_tola' ? 'Per Tola' : 'Fixed Total'}
                  </button>
                </div>

                <MoneyInput
                  value={chargesPkr}
                  onChange={(pkr) => setChargesPkr(pkr)}
                />

                {/* Quick Labour Buttons */}
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground font-medium">Quick Presets:</span>
                  {[1000, 1500, 2000, 3500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setChargesPkr(amt)}
                      className="px-3 py-1 rounded-md border border-border bg-background hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
                    >
                      PKR {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COMPACT CUSTOMER, SETTLEMENT & CHECKOUT (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. COMPACT CUSTOMER SELECTOR */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Customer</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomerModalOpen(true)}
                  className="h-7 px-2.5 text-xs font-semibold cursor-pointer border-border"
                >
                  <Search className="size-3 mr-1" />
                  <span>Directory</span>
                </Button>
              </div>

              {selectedCustomer ? (
                <div className="p-2.5 rounded-lg border border-border bg-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {selectedCustomer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-foreground truncate">{selectedCustomer.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{selectedCustomer.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded font-mono font-semibold',
                        selectedCustomer.cashBalancePkr > 0
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : selectedCustomer.cashBalancePkr < 0
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      )}
                    >
                      {selectedCustomer.cashBalancePkr === 0
                        ? 'Zero Due'
                        : selectedCustomer.cashBalancePkr > 0
                        ? `Owes PKR ${selectedCustomer.cashBalancePkr.toLocaleString()}`
                        : `Adv PKR ${Math.abs(selectedCustomer.cashBalancePkr).toLocaleString()}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(null)
                        setCustomerSearchInput('')
                      }}
                      className="size-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
                      title="Clear Customer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Walk-in Customer (or type name/phone)"
                    value={customerSearchInput}
                    onChange={(e) => setCustomerSearchInput(e.target.value)}
                    className="h-9 text-xs w-full bg-background"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(null)
                      setCustomerSearchInput('Walk-in Customer')
                    }}
                    className="h-9 px-2.5 text-xs shrink-0 cursor-pointer font-medium"
                  >
                    Walk-in
                  </Button>
                </div>
              )}
            </div>

            {/* 2. COMPACT INVOICE BREAKDOWN & PAYMENT SETTLEMENT */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Invoice & Settlement</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {billType === 'sale' ? 'Sale Invoice' : 'Purchase Voucher'}
                </span>
              </div>

              {/* Clean Financial Breakdown (No redundant weights) */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Gold Metal Value</span>
                  <span className="font-mono text-foreground font-semibold">
                    PKR {Math.round(goldValuePkr).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Making & Crafting</span>
                  <span className="font-mono text-foreground font-semibold">
                    PKR {Math.round(totalAmountPkr - goldValuePkr).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total Invoice Amount Hero Box */}
              <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/25 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-foreground block">
                    Total Amount Due
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Inclusive of gold & making
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono tracking-tight">
                  PKR {Math.round(totalAmountPkr).toLocaleString()}
                </span>
              </div>

              {/* Cash Received Input */}
              <div className="space-y-2 pt-1 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Cash Received (PKR)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmountReceivedPkr(totalAmountPkr)}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Exact (100%)
                  </button>
                </div>

                <MoneyInput
                  value={amountReceivedPkr}
                  onChange={(pkr) => setAmountReceivedPkr(pkr)}
                />

                {/* Quick Cash Chips */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  {[5000, 10000, 50000, 100000].map((add) => (
                    <button
                      key={add}
                      type="button"
                      onClick={() => setAmountReceivedPkr((amountReceivedPkr || 0) + add)}
                      className="text-xs px-2.5 py-1 rounded border border-border bg-muted/40 hover:bg-muted font-medium text-foreground transition-colors cursor-pointer"
                    >
                      +{add >= 1000 ? `${add / 1000}k` : add}
                    </button>
                  ))}
                </div>

                {/* Balance Due / Change */}
                <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between mt-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {balanceDuePkr > 0
                      ? 'Remaining Balance Due:'
                      : balanceDuePkr < 0
                      ? 'Change Due to Customer:'
                      : 'Settlement Status:'}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold font-mono',
                      balanceDuePkr > 0
                        ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                        : balanceDuePkr < 0
                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400 font-bold'
                    )}
                  >
                    {balanceDuePkr === 0
                      ? 'Fully Settled'
                      : `PKR ${Math.abs(Math.round(balanceDuePkr)).toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS (Save and Print) */}
              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveBill}
                  className="h-10 px-4 text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer flex-1"
                >
                  <Check className="size-4 mr-1.5" />
                  <span>Save Transaction</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrintCurrent}
                  className="h-10 px-3.5 text-xs sm:text-sm font-semibold border-border text-foreground hover:bg-muted cursor-pointer shrink-0"
                >
                  <Printer className="size-4 mr-1.5" />
                  <span>Print</span>
                </Button>
              </div>
            </div>
          </div>
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
