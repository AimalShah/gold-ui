import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { LedgerBadge } from '@/components/shared/LedgerBadge'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import { cn } from '@/lib/utils'
import { AmountToGoldModal } from '@/components/billing/AmountToGoldModal'
import { FixCaratModal } from '@/components/billing/FixCaratModal'
import { SearchPurchiModal } from '@/components/billing/SearchPurchiModal'
import { PercentCutModal } from '@/components/billing/PercentCutModal'
import { PerGramRateModal } from '@/components/billing/PerGramRateModal'
import { ZakatModal } from '@/components/billing/ZakatModal'
import { InventoryPickerModal } from '@/components/billing/InventoryPickerModal'
import {
  calculateCutTotal,
  calculatePolishTotal,
  calculateTotalWeight,
  calculateGoldValue,
  calculateTotalPrice,
  calculateZakat,
  formatGrams,
  formatTMR,
  formatMoney,
  DEFAULT_GRAMS_PER_TOLA,
  ChargesMode,
} from '@/lib/gold-math'
import { Customer, Bill, InventoryItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Receipt,
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  User,
  ExternalLink,
  Percent,
  Calculator,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'

export const BillingPage: React.FC = () => {
  const {
    settings,
    mandi,
    customers,
    addBill,
    currentUser,
    setHelpOpen,
    setCalcOpen,
    unitMode,
    setUnitMode,
    metalMode,
    setMetalMode,
    updateInventoryStatus,
    setSelectedCustomerIdForDetail,
    setCurrentPage,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerIdInput, setCustomerIdInput] = useState<string>('')
  const [billType, setBillType] = useState<'sale' | 'purchase' | 'general'>('sale')
  const [attachedInventoryItem, setAttachedInventoryItem] = useState<InventoryItem | null>(null)

  // Deductions toggle
  const [showDeductions, setShowDeductions] = useState<boolean>(false)

  // Weights (mg)
  const [weightMg, setWeightMg] = useState<number>(0)
  const [cutPerTolaMg, setCutPerTolaMg] = useState<number>(settings.defaultCutPerTolaMg || 243)
  const [cutTotalMg, setCutTotalMg] = useState<number>(0)
  const [cutHelpers, setCutHelpers] = useState({ mashaCut: 0, rattiCut: 2, totalCutFraction: 0 })

  const [polishPerTolaMg, setPolishPerTolaMg] = useState<number>(settings.defaultPolishPerTolaMg || 122)
  const [polishTotalMg, setPolishTotalMg] = useState<number>(0)
  const [polishHelpers, setPolishHelpers] = useState({ mashaCut: 0, rattiCut: 1, totalCutFraction: 0 })

  // Rates & Charges
  const defaultRate = metalMode === 'silver' ? mandi.pkrPerTolaSilver : mandi.pkrPerTola24k
  const [goldRatePkr, setGoldRatePkr] = useState<number>(defaultRate)
  const [carat, setCarat] = useState<number>(24)
  const [chargesMode, setChargesMode] = useState<ChargesMode>(settings.defaultChargesMode || 'per_tola')
  const [chargesPkr, setChargesPkr] = useState<number>(0)
  const [wasoolPkr, setWasoolPkr] = useState<number>(0)

  // Modals state
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [amountModalOpen, setAmountModalOpen] = useState(false)
  const [fixCaratModalOpen, setFixCaratModalOpen] = useState(false)
  const [searchPurchiModalOpen, setSearchPurchiModalOpen] = useState(false)
  const [percentCutModalOpen, setPercentCutModalOpen] = useState(false)
  const [perGramRateModalOpen, setPerGramRateModalOpen] = useState(false)
  const [zakatModalOpen, setZakatModalOpen] = useState(false)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [lastSavedBill, setLastSavedBill] = useState<Bill | null>(null)

  // Calculated derived values
  const totalWeightMg = calculateTotalWeight(weightMg, cutTotalMg, polishTotalMg)
  const goldValuePkr = calculateGoldValue(totalWeightMg, goldRatePkr, carat, gramsPerTola)
  const totalPricePkr = calculateTotalPrice(goldValuePkr, chargesPkr, chargesMode, totalWeightMg, gramsPerTola)
  const balancePkr = totalPricePkr - wasoolPkr
  const zakatPkr = calculateZakat(totalPricePkr, (settings.zakatPercent || 2.5) / 100)

  // Sync cut & polish totals whenever gross weight or per-tola rates change
  useEffect(() => {
    if (weightMg > 0) {
      setCutTotalMg(calculateCutTotal(weightMg, cutPerTolaMg, gramsPerTola))
      setPolishTotalMg(calculatePolishTotal(weightMg, polishPerTolaMg, gramsPerTola))
    } else {
      setCutTotalMg(0)
      setPolishTotalMg(0)
    }
  }, [weightMg, cutPerTolaMg, polishPerTolaMg, gramsPerTola])

  // Sync default rate on metal mode switch
  useEffect(() => {
    setGoldRatePkr(metalMode === 'silver' ? mandi.pkrPerTolaSilver : mandi.pkrPerTola24k)
  }, [metalMode, mandi.pkrPerTola24k, mandi.pkrPerTolaSilver])

  // Customer ID input change
  const handleCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomerIdInput(val)
    const match = customers.find((c) => c.id.toLowerCase() === val.toLowerCase() || c.phone.endsWith(val))
    if (match) {
      setSelectedCustomer(match)
    }
  }

  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomer(cust)
    setCustomerIdInput(cust.id)
    toast.success(`Selected customer: ${cust.name}`)
  }

  // Keyboard navigation & hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)

      // Alt key overrides or outside input shortcuts
      if (!isInput || e.altKey) {
        const key = e.key.toUpperCase()

        if (key === 'A') {
          e.preventDefault()
          setAmountModalOpen(true)
        } else if (key === 'C') {
          e.preventDefault()
          setCustomerModalOpen(true)
        } else if (key === 'F' && !e.ctrlKey) {
          e.preventDefault()
          setFixCaratModalOpen(true)
        } else if (key === 'G' && !e.ctrlKey) {
          e.preventDefault()
          setUnitMode('grams')
          toast.info("Switched to Grams mode (G)")
        } else if (key === 'W' && !e.ctrlKey) {
          e.preventDefault()
          setUnitMode('tola')
          toast.info("Switched to Tola mode (W)")
        } else if (key === 'I' && !e.ctrlKey) {
          e.preventDefault()
          setCustomerModalOpen(true)
        } else if (key === 'K' && !e.ctrlKey) {
          e.preventDefault()
          setFixCaratModalOpen(true)
        } else if (key === 'P' && !e.ctrlKey) {
          e.preventDefault()
          handlePrintCurrent()
        } else if (key === 'S' && !e.ctrlKey) {
          e.preventDefault()
          setSearchPurchiModalOpen(true)
        } else if (key === 'T' && !e.ctrlKey) {
          e.preventDefault()
          cycleChargesMode()
        } else if (key === 'Z' && !e.ctrlKey) {
          e.preventDefault()
          setZakatModalOpen(true)
        }
      }

      // Function keys
      if (e.key === 'F1') {
        e.preventDefault()
        setHelpOpen(true)
      } else if (e.key === 'F2' && !e.ctrlKey) {
        e.preventDefault()
        setCalcOpen(true)
      } else if (e.key === 'F4') {
        e.preventDefault()
        handleZeroForm()
      } else if (e.key === 'F7') {
        e.preventDefault()
        setUnitMode('auto')
        toast.info("Switched to Auto unit mode (F7)")
      } else if (e.key === 'F8') {
        e.preventDefault()
        handleSaveBill()
      } else if (e.key === 'F9') {
        e.preventDefault()
        setMetalMode(metalMode === 'gold' ? 'silver' : 'gold')
        toast.info(`Switched to ${metalMode === 'gold' ? 'Silver' : 'Gold'} mode (F9)`)
      }

      // Combinations
      if (e.shiftKey && e.key === '%') {
        e.preventDefault()
        setPercentCutModalOpen(true)
      } else if (e.ctrlKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        setPerGramRateModalOpen(true)
      } else if (e.ctrlKey && e.key === 'F2') {
        e.preventDefault()
        setBillType('general')
        setSelectedCustomer(null)
        setCustomerIdInput('')
        toast.info("General Walk-in Bill mode activated (Ctrl+F2)")
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [metalMode, weightMg, goldRatePkr, totalWeightMg, totalPricePkr])

  const cycleChargesMode = () => {
    const modes: ChargesMode[] = ['per_tola', 'labour', 'fix']
    const nextIdx = (modes.indexOf(chargesMode) + 1) % modes.length
    setChargesMode(modes[nextIdx])
    toast.info(`Labour mode: ${modes[nextIdx] === 'per_tola' ? 'Charges /Tola' : modes[nextIdx] === 'labour' ? 'Labour' : 'Fixed Charges'}`)
  }

  const handleZeroForm = () => {
    if (weightMg > 0 || wasoolPkr > 0) {
      setConfirmClearOpen(true)
    } else {
      doClearForm()
    }
  }

  const doClearForm = () => {
    setWeightMg(0)
    setCutTotalMg(0)
    setPolishTotalMg(0)
    setChargesPkr(0)
    setWasoolPkr(0)
    setAttachedInventoryItem(null)
    setBillType('sale')
    toast.info("Form cleared (ZERO F4)")
  }

  const handleSaveBill = () => {
    if (weightMg <= 0) {
      toast.error("Please enter a valid Gold Weight before saving.")
      return
    }

    // Credit sale validation: requires customer if Wasool != Total Price
    if (wasoolPkr < totalPricePkr && !selectedCustomer) {
      toast.error("Credit sale detected: Please select or enter a Customer ID to record ledger balance.")
      setCustomerModalOpen(true)
      return
    }

    const saved = addBill({
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: metalMode,
      items: [
        {
          id: `item-${Date.now()}`,
          description: attachedInventoryItem
            ? `${attachedInventoryItem.name} (${attachedInventoryItem.tagSku})`
            : `${metalMode.toUpperCase()} Jewellery (${carat}K)`,
          weightMg,
          cutPerTolaMg,
          cutTotalMg,
          polishPerTolaMg,
          polishTotalMg,
          totalWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr,
          inventoryItemId: attachedInventoryItem?.id,
        },
      ],
      totalWeightMg,
      cutTotalMg,
      polishTotalMg,
      netWeightMg: totalWeightMg,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr,
      wasoolPkr: wasoolPkr || totalPricePkr, // if not entered, assume cash wasool
      balancePkr: wasoolPkr > 0 ? totalPricePkr - wasoolPkr : 0,
      zakatPkr,
      user: currentUser.name,
      notes: attachedInventoryItem ? `Stock item ${attachedInventoryItem.tagSku} deducted from inventory.` : undefined,
    })

    if (attachedInventoryItem) {
      updateInventoryStatus(attachedInventoryItem.id, 'sold')
    }

    setLastSavedBill(saved)
    toast.success(`Bill #${saved.billNo} saved successfully! Ledger updated.`)
    setPrintPreviewOpen(true)
  }

  const handlePrintCurrent = () => {
    const currentBillRepresentation: Bill = {
      id: 'current-preview',
      billNo: (10080 + 3).toString(),
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: metalMode,
      items: [
        {
          id: 'item-preview',
          description: attachedInventoryItem
            ? `${attachedInventoryItem.name} (${attachedInventoryItem.tagSku})`
            : `${metalMode.toUpperCase()} Jewellery (${carat}K)`,
          weightMg,
          cutPerTolaMg,
          cutTotalMg,
          polishPerTolaMg,
          polishTotalMg,
          totalWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr,
        },
      ],
      totalWeightMg: weightMg || 11664,
      cutTotalMg,
      polishTotalMg,
      netWeightMg: totalWeightMg || 11664,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr: totalPricePkr || goldRatePkr,
      wasoolPkr: wasoolPkr || totalPricePkr || goldRatePkr,
      balancePkr,
      zakatPkr,
      user: currentUser.name,
    }
    setLastSavedBill(currentBillRepresentation)
    setPrintPreviewOpen(true)
  }

  const handleAttachInventoryItem = (item: InventoryItem) => {
    setAttachedInventoryItem(item)
    setWeightMg(item.grossWeightMg)
    setCarat(item.karat)
    setChargesPkr(item.makingChargesPkr)
    setChargesMode(item.makingChargesMode === 'per_tola' ? 'per_tola' : 'fix')
    toast.success(`Attached item ${item.tagSku} (${item.name})`)
  }

  // Gold price mini-table calculation
  const pricePerMasha = Math.round(goldRatePkr / 12)
  const pricePerRatti = Math.round(goldRatePkr / 96)
  const pricePerGram = Math.round(goldRatePkr / gramsPerTola)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* SECTION A: Header Strip */}
      <div className="px-4 py-2 border-b border-border bg-card flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-foreground uppercase">
              {settings.shopName}
            </span>
            <Badge variant="outline" className="font-mono text-xs uppercase bg-muted text-foreground border-border">
              {metalMode.toUpperCase()} BILLING
            </Badge>
          </div>

          {/* Customer Chip / Selector */}
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            {selectedCustomer ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-muted/60 border border-border text-xs">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-bold text-foreground">{selectedCustomer.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">({selectedCustomer.id})</span>
                <LedgerBadge
                  goldBalanceMg={selectedCustomer.goldBalanceMg}
                  cashBalancePkr={selectedCustomer.cashBalancePkr}
                  showLabels={false}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedCustomerIdForDetail(selectedCustomer.id)
                    setCurrentPage('customers')
                  }}
                  className="h-5 px-1.5 text-[10px] text-foreground font-semibold hover:bg-muted"
                  title="View full dual ledger statement"
                >
                  Detail
                  <ExternalLink className="h-2.5 w-2.5 ml-1" />
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null)
                    setCustomerIdInput('')
                  }}
                  className="text-muted-foreground hover:text-foreground text-xs ml-1 font-bold"
                  title="Clear selected customer"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCustomerModalOpen(true)}
                  className="h-7 text-xs font-semibold gap-1.5 border-dashed"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Select Customer (I)
                </Button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>ID:</span>
                  <Input
                    type="text"
                    placeholder="1001"
                    value={customerIdInput}
                    onChange={handleCustomerIdChange}
                    className="h-7 w-20 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {attachedInventoryItem && (
            <Badge variant="secondary" className="text-xs bg-muted text-foreground border-border gap-1.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Item: {attachedInventoryItem.tagSku}
              <button
                type="button"
                onClick={() => setAttachedInventoryItem(null)}
                className="text-muted-foreground hover:text-foreground font-bold ml-1"
              >
                ×
              </button>
            </Badge>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setInventoryModalOpen(true)}
            className="h-7 text-xs font-semibold gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
            Add Item (Stock)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSearchPurchiModalOpen(true)}
            className="h-7 text-xs gap-1 font-semibold"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            Purchi (S)
          </Button>
        </div>
      </div>

      {/* Main Content: Spacious, uncluttered, breathable layout */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* CARD 1: Metal Weight & Deductions */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  1. Metal Weight Breakdown
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enter gross scale weight in grams or tola-masha-ratti parts
                </p>
              </div>

              {/* Deductions Toggle Button */}
              <button
                type="button"
                onClick={() => setShowDeductions(!showDeductions)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
                title="Toggle Cut and Polish deductions breakdown"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Kat & Polish Deductions</span>
                {(cutTotalMg > 0 || polishTotalMg > 0) && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-foreground text-background font-mono font-bold">
                    -{formatGrams(cutTotalMg + polishTotalMg, 3)}g
                  </span>
                )}
                {showDeductions ? (
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Table Header Labels */}
            <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground px-2">
              <span className="w-40 font-sans uppercase tracking-wider text-[11px]">Row Specification</span>
              <div className="grid grid-cols-4 w-full text-right tracking-wider text-[11px]">
                <span>TOLA (12M)</span>
                <span>MASHA (8R)</span>
                <span>RATTI (0.1215g)</span>
                <span className="text-foreground">GRAMS (Base)</span>
              </div>
            </div>

            {/* ROW 1: GROSS WEIGHT */}
            <WeightInput
              label="GROSS WEIGHT"
              tint="tint-row-weight"
              value={weightMg}
              onChange={setWeightMg}
              activeUnit={unitMode}
            />

            {/* Collapsible Deductions Section */}
            {showDeductions && (
              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-3 animate-in fade-in-50 duration-200">
                <div className="text-[11px] font-mono uppercase font-bold text-muted-foreground flex items-center justify-between border-b border-border/60 pb-1.5">
                  <span>Deduction Breakdown (Per-Tola & Totals)</span>
                  <span>Shift+% For Percent Cut</span>
                </div>

                {/* ROW 2: CUT / TOLA */}
                <WeightInput
                  label="CUT / TOLA"
                  tint="tint-row-cut"
                  value={cutPerTolaMg}
                  onChange={setCutPerTolaMg}
                  showHelpers={true}
                  helperValues={cutHelpers}
                  onHelperChange={setCutHelpers}
                  activeUnit={unitMode}
                />

                {/* ROW 3: TOTAL CUT */}
                <WeightInput
                  label="TOTAL CUT"
                  tint="tint-row-cut"
                  value={cutTotalMg}
                  onChange={setCutTotalMg}
                  activeUnit={unitMode}
                />

                {/* ROW 4: POLISH / TOLA */}
                <WeightInput
                  label="POLISH / TOLA"
                  tint="tint-row-polish"
                  value={polishPerTolaMg}
                  onChange={setPolishPerTolaMg}
                  showHelpers={true}
                  helperValues={polishHelpers}
                  onHelperChange={setPolishHelpers}
                  activeUnit={unitMode}
                />

                {/* ROW 5: TOTAL POLISH */}
                <WeightInput
                  label="TOTAL POLISH"
                  tint="tint-row-polish"
                  value={polishTotalMg}
                  onChange={setPolishTotalMg}
                  activeUnit={unitMode}
                />
              </div>
            )}

            {/* ROW 6: NET WEIGHT READOUT (HERO SPECIFICATION) */}
            <div className="pt-2">
              <div className="flex items-center rounded-xl border-2 border-amber-600/50 bg-amber-500/8 dark:bg-amber-500/10 p-3.5 shadow-xs">
                <div className="w-40 font-sans px-2 flex flex-col justify-center shrink-0 border-r border-amber-500/20 pr-3 mr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-600" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">CALCULATED NET WT</span>
                  </div>
                  <span className="text-[10px] text-amber-700/70 dark:text-amber-400/70 mt-0.5">صافی وزن (بعد کٹ و پالش)</span>
                </div>
                <div className="grid grid-cols-4 w-full text-right items-center divide-x divide-amber-500/20">
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-sans text-muted-foreground block">Tola</span>
                    <span className="text-base font-bold text-foreground">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[0]}</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-sans text-muted-foreground block">Masha</span>
                    <span className="text-base font-bold text-foreground">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[1]}</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[10px] uppercase font-sans text-muted-foreground block">Ratti</span>
                    <span className="text-base font-bold text-foreground">{formatTMR(totalWeightMg, gramsPerTola).split(' ')[2]}</span>
                  </div>
                  <div className="px-3 bg-amber-500/15 rounded-lg py-1">
                    <span className="text-[10px] uppercase font-sans font-bold text-amber-800 dark:text-amber-300 block">Net Grams</span>
                    <span className="text-2xl font-black text-amber-950 dark:text-amber-200 tracking-tight">
                      {formatGrams(totalWeightMg, 4)} <span className="text-xs font-sans font-medium text-amber-700 dark:text-amber-400">g</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER GRID: Spacious 2-Column Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* COLUMN 1: Rates, Purity & Charges */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    2. Valuation & Purity
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select metal purity, market rate, and labour charges
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPerGramRateModalOpen(true)}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1"
                >
                  Ctrl+G Per-Gram
                </button>
              </div>

              {/* PURITY & CARAT PRESETS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>GOLD CARAT / PURITY</span>
                    <HotkeyHint hotkey="F / K" className="h-3.5 text-[8px]" />
                  </label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {(carat / 24 * 100).toFixed(1)}% pure gold
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 22, 21, 18].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCarat(k)}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                        carat === k
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-2xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                      )}
                    >
                      {k}K {k === 24 ? '(Pure)' : k === 22 ? '(Std)' : k === 21 ? '(Gulf)' : '(Dia)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* GOLD RATE / TOLA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>{metalMode.toUpperCase()} RATE / TOLA</span>
                    <HotkeyHint hotkey="R" className="h-3.5 text-[8px]" />
                  </label>
                  <span className="text-xs text-muted-foreground font-mono">
                    Mandi Benchmark: Rs {mandi.pkrPerTola24k.toLocaleString()}
                  </span>
                </div>
                <MoneyInput
                  value={goldRatePkr}
                  onChange={setGoldRatePkr}
                  tintClass="tint-row-rate"
                  className="h-11 text-lg font-bold"
                />
              </div>

              {/* CHARGES / LABOUR */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={cycleChargesMode}
                    className="font-semibold text-foreground hover:underline flex items-center gap-1.5 cursor-pointer"
                    title="Press T to cycle between Charges/Tola, Labour, and Fixed Charges"
                  >
                    <span>MAKING CHARGES / LABOUR</span>
                    <HotkeyHint hotkey="T" className="h-3.5 text-[8px]" />
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">
                    Mode: {chargesMode === 'per_tola' ? `${((totalWeightMg / (gramsPerTola * 1000))).toFixed(2)} Tolas` : 'Flat Amount'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border bg-muted p-1 text-xs font-mono shrink-0">
                    <button
                      type="button"
                      onClick={() => setChargesMode('per_tola')}
                      className={cn(
                        "px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer",
                        chargesMode === 'per_tola' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      /Tola
                    </button>
                    <button
                      type="button"
                      onClick={() => setChargesMode('labour')}
                      className={cn(
                        "px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer",
                        chargesMode === 'labour' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Labour
                    </button>
                    <button
                      type="button"
                      onClick={() => setChargesMode('fix')}
                      className={cn(
                        "px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer",
                        chargesMode === 'fix' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Fixed
                    </button>
                  </div>

                  <MoneyInput
                    value={chargesPkr}
                    onChange={setChargesPkr}
                    tintClass="tint-row-charges"
                    className="h-11 flex-1 text-base font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* COLUMN 2: Checkout & Total Net Price */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6 flex flex-col justify-between">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    3. Total Settlement
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Final invoice amount, cash received, and remaining dues
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZakatModalOpen(true)}
                  className="h-7 text-xs font-semibold gap-1"
                >
                  <span>Zakat: {formatMoney(zakatPkr)}</span>
                  <HotkeyHint hotkey="Z" className="h-3 text-[8px]" />
                </Button>
              </div>

              {/* Large Numeric Readout: TOTAL INVOICE */}
              <div className="p-6 rounded-xl bg-stone-950 text-white border border-amber-500/40 dark:bg-stone-900 dark:border-amber-500/40 space-y-2 shadow-md">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-amber-200/80">
                  <span>TOTAL NET INVOICE</span>
                  <span className="text-xs text-amber-200/60 font-sans">
                    {formatGrams(totalWeightMg, 4)}g × {carat}K @ Rs {goldRatePkr.toLocaleString()}
                  </span>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-amber-400 tabular-nums tracking-tight">
                  {formatMoney(totalPricePkr)}
                </div>
              </div>

              {/* CASH RECEIVED (WASOOL) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-foreground">
                    WASOOL (CASH RECEIVED NOW)
                  </label>
                  <button
                    type="button"
                    onClick={() => setWasoolPkr(totalPricePkr)}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline font-semibold font-mono cursor-pointer"
                  >
                    Quick Full Paid (Equal)
                  </button>
                </div>
                <MoneyInput
                  value={wasoolPkr}
                  onChange={setWasoolPkr}
                  tintClass="tint-row-wasool"
                  className="h-11 text-lg font-bold"
                />
              </div>

              {/* Dues & Balance summary with clear visual hierarchy */}
              <div className={cn(
                "p-4 rounded-xl border flex items-center justify-between transition-all",
                balancePkr > 0
                  ? "bg-destructive/5 border-destructive/30"
                  : "bg-muted/40 border-border"
              )}>
                <div className="space-y-1">
                  <span className="text-[11px] font-sans text-muted-foreground uppercase font-semibold block">
                    Cash Paid (وصول رقم):
                  </span>
                  <div className="font-mono font-bold text-base text-foreground">
                    {formatMoney(wasoolPkr)}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-1.5">
                    {balancePkr > 0 ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-sans uppercase bg-destructive/10 text-destructive">
                        Due / Udhar
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-sans uppercase bg-foreground/10 text-foreground">
                        Settled ✓
                      </span>
                    )}
                    <span className="text-[11px] font-sans text-muted-foreground uppercase font-semibold">
                      {balancePkr > 0 ? 'Remaining Balance (بقایا):' : 'Status:'}
                    </span>
                  </div>
                  <div className={cn(
                    "font-mono font-black tracking-tight",
                    balancePkr > 0 ? "text-xl text-destructive" : "text-base text-foreground"
                  )}>
                    {balancePkr > 0 ? formatMoney(balancePkr) : 'Nil (Full Payment)'}
                  </div>
                </div>
              </div>

              {/* Live Gold Price Barometer */}
              <div className="border border-border rounded-lg divide-x divide-border grid grid-cols-4 text-center text-xs font-mono bg-muted/20 py-2">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-sans">1 Tola</div>
                  <div className="font-bold text-foreground">Rs {goldRatePkr.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-sans">1 Masha</div>
                  <div className="font-semibold text-foreground">Rs {pricePerMasha.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-sans">1 Ratti</div>
                  <div className="font-semibold text-foreground">Rs {pricePerRatti.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-sans font-bold">1 Gram</div>
                  <div className="font-bold text-foreground">Rs {pricePerGram.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION D: Spacious Action Bar (Bottom) */}
      <div className="h-16 border-t border-border bg-card px-6 flex items-center justify-between select-none shrink-0 z-10 shadow-2xs">
        {/* Left Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="default"
            onClick={handleSaveBill}
            className="h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm gap-2 shadow-xs px-6 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            SAVE BILL
            <kbd className="pointer-events-none inline-flex h-4 items-center rounded bg-amber-800 text-amber-100 px-1 text-[10px] font-semibold ml-0.5">
              F8
            </kbd>
          </Button>

          <Button
            size="default"
            variant="outline"
            onClick={handlePrintCurrent}
            className="h-10 text-xs font-bold gap-2 px-4 cursor-pointer"
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
            PRINT INVOICE
            <HotkeyHint hotkey="P" className="h-4 text-[10px]" />
          </Button>

          <Button
            size="default"
            variant="ghost"
            onClick={handleZeroForm}
            className="h-10 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 px-3 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ZERO FORM
            <HotkeyHint hotkey="F4" className="h-4 text-[10px]" />
          </Button>
        </div>

        {/* Centre: Unit Mode buttons in Monochrome */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setUnitMode('auto')
              toast.info("Unit mode: Auto (F7)")
            }}
            className={cn(
              "px-3 py-1 rounded-md font-bold text-xs transition-colors cursor-pointer",
              unitMode === 'auto' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            AUTO (F7)
          </button>
          <button
            type="button"
            onClick={() => {
              setUnitMode('grams')
              toast.info("Unit mode: Grams (G)")
            }}
            className={cn(
              "px-3 py-1 rounded-md font-bold text-xs transition-colors cursor-pointer",
              unitMode === 'grams' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            GRAM (G)
          </button>
          <button
            type="button"
            onClick={() => {
              setUnitMode('tola')
              toast.info("Unit mode: Tola (W)")
            }}
            className={cn(
              "px-3 py-1 rounded-md font-bold text-xs transition-colors cursor-pointer",
              unitMode === 'tola' ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            TOLA (W)
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={metalMode === 'silver' ? 'secondary' : 'outline'}
            onClick={() => {
              const next = metalMode === 'gold' ? 'silver' : 'gold'
              setMetalMode(next)
              toast.info(`Switched to ${next.toUpperCase()} mode (F9)`)
            }}
            className="h-8 text-xs font-bold font-mono gap-1"
          >
            {metalMode === 'gold' ? 'GOLD MODE' : 'SILVER MODE'}
            <HotkeyHint hotkey="F9" className="h-4 text-[9px]" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setHelpOpen(true)}
            className="h-8 text-xs text-muted-foreground gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            Help (F1)
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <CustomerSelectModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onSelectCustomer={handleSelectCustomer}
        onNewCustomer={() => {
          setCurrentPage('customers')
        }}
      />

      <AmountToGoldModal
        open={amountModalOpen}
        onOpenChange={setAmountModalOpen}
        currentRate={goldRatePkr}
        onApplyWeight={setWeightMg}
      />

      <FixCaratModal
        open={fixCaratModalOpen}
        onOpenChange={setFixCaratModalOpen}
        currentCarat={carat}
        onApplyCarat={setCarat}
      />

      <SearchPurchiModal
        open={searchPurchiModalOpen}
        onOpenChange={setSearchPurchiModalOpen}
        onSelectBill={(bill) => {
          setSelectedCustomer(customers.find((c) => c.id === bill.customerId) || null)
          setWeightMg(bill.totalWeightMg)
          setCutTotalMg(bill.cutTotalMg)
          setPolishTotalMg(bill.polishTotalMg)
          setGoldRatePkr(bill.goldRatePkr)
          setCarat(bill.carat)
          setChargesPkr(bill.chargesPkr)
          setWasoolPkr(bill.wasoolPkr)
          setChargesMode(bill.chargesMode)
          setLastSavedBill(bill)
          toast.success(`Loaded Bill #${bill.billNo}`)
        }}
      />

      <PercentCutModal
        open={percentCutModalOpen}
        onOpenChange={setPercentCutModalOpen}
        currentWeightMg={weightMg}
        onApplyCut={setCutTotalMg}
      />

      <PerGramRateModal
        open={perGramRateModalOpen}
        onOpenChange={setPerGramRateModalOpen}
        currentRate={goldRatePkr}
        onApplyTolaRate={setGoldRatePkr}
      />

      <ZakatModal
        open={zakatModalOpen}
        onOpenChange={setZakatModalOpen}
        totalPricePkr={totalPricePkr}
        zakatPercent={settings.zakatPercent}
      />

      <InventoryPickerModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onSelectItem={handleAttachInventoryItem}
      />

      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear Current Billing Form (F4)?"
        description="Are you sure you want to reset all weights, cut, polish and prices? Unsaved entries will be lost."
        confirmText="Yes, Clear Form"
        variant="destructive"
        onConfirm={doClearForm}
      />

      <PrintPreviewDialog
        open={printPreviewOpen}
        onOpenChange={setPrintPreviewOpen}
        bill={lastSavedBill}
      />
    </div>
  )
}
