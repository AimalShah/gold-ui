import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import {
  calculateTehleel,
  calculateImpurity,
  formatGrams,
  formatTMR,
  formatMoney,
  DEFAULT_GRAMS_PER_TOLA,
} from '@/lib/gold-math'
import { Customer } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Flame, Printer, Save, RotateCcw, X, User, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export const TehleelPage: React.FC = () => {
  const {
    settings,
    mandi,
    addTehleelRecord,
    setCurrentPage,
    unitMode,
    setUnitMode,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Assay Type: COPPER, SILVER, ESILVER, PURE SILVER, TEZABI
  const [metalType, setMetalType] = useState<string>('COPPER')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)

  // Weights (mg) - default from the recording example: 1st weight 31.310g, 2nd weight 27.500g
  const [firstWeightMg, setFirstWeightMg] = useState<number>(31310)
  const [secondWeightMg, setSecondWeightMg] = useState<number>(27500)
  const [cutPerTolaMg, setCutPerTolaMg] = useState<number>(243)
  const [ratePkr, setRatePkr] = useState<number>(mandi.pkrPerTola24k)

  // Impurity & Pure Gold calculation
  const { impurityMg, pureGoldMg } = calculateImpurity(
    firstWeightMg,
    secondWeightMg,
    cutPerTolaMg,
    gramsPerTola
  )

  const { karat, permille, purityPercent } = calculateTehleel(firstWeightMg, pureGoldMg)
  const amountPkr = Math.round((pureGoldMg / (gramsPerTola * 1000)) * ratePkr)

  // Hotkeys: C, S, M, U, Y, Esc, F8, F4, P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if (!isInput) {
        const key = e.key.toUpperCase()
        if (key === 'C') {
          e.preventDefault()
          setMetalType('COPPER')
        } else if (key === 'S') {
          e.preventDefault()
          setMetalType('SILVER')
        } else if (key === 'M') {
          e.preventDefault()
          setMetalType('ESILVER')
        } else if (key === 'U') {
          e.preventDefault()
          setMetalType('TEZABI')
        } else if (key === 'Y') {
          e.preventDefault()
          setMetalType('PURE SILVER')
        } else if (key === 'ESCAPE') {
          e.preventDefault()
          setCurrentPage('billing')
        } else if (key === 'P') {
          e.preventDefault()
          handlePrint()
        }
      }

      if (e.key === 'F8') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'F4') {
        e.preventDefault()
        handleZero()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [metalType, firstWeightMg, secondWeightMg, cutPerTolaMg, ratePkr, pureGoldMg, karat])

  const handleSave = () => {
    if (firstWeightMg <= 0) {
      toast.error("Please enter a valid 1st Weight.")
      return
    }

    const rec = addTehleelRecord({
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Assay',
      metalType: metalType as any,
      firstWeightMg,
      secondWeightMg,
      cutPerTolaMg,
      impurityMg,
      pureGoldMg,
      carat: karat,
      permille,
      purityPercent,
      ratePkr,
      amountPkr,
      notes: `Assay test for ${metalType} base. Pure Gold: ${(pureGoldMg / 1000).toFixed(3)}g`,
    })

    toast.success(`Tehleel test #${rec.testNo} saved (${karat}K / ${permille}‰)!`)
  }

  const handlePrint = () => {
    toast.success(`Printing Gold Karat Assay Certificate (${karat}K)...`)
  }

  const handleZero = () => {
    setFirstWeightMg(0)
    setSecondWeightMg(0)
    setCutPerTolaMg(0)
    toast.info("Tehleel form cleared (F4)")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b bg-card px-4 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
            <h1 className="font-serif font-black text-lg tracking-wider text-amber-900 dark:text-amber-300 uppercase">
              GOLD KARAT / TEHLEEL
            </h1>
          </div>
          <Badge className="bg-amber-600 text-white font-mono text-xs">
            KACHA TOLA
          </Badge>
        </div>

        {/* Customer & Close */}
        <div className="flex items-center gap-3">
          {selectedCustomer ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border text-xs">
              <User className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-bold">{selectedCustomer.name}</span>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-muted-foreground hover:text-red-600 font-bold ml-1"
              >
                ×
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCustomerModalOpen(true)}
              className="h-7 text-xs font-semibold"
            >
              Attach Customer
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrentPage('billing')}
            className="h-8 w-8 p-0"
            title="Back to Main Form (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metal Assay Selector ToggleGroup (Keys C / S / M / U / Y) */}
        <div className="p-3 bg-card rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Assay Metal Base
          </div>

          <ToggleGroup
            type="single"
            value={metalType}
            onValueChange={(val) => val && setMetalType(val)}
            className="flex flex-wrap gap-1"
          >
            <ToggleGroupItem value="COPPER" className="h-8 px-3 text-xs font-bold gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white">
              <span>COPPER</span>
              <HotkeyHint hotkey="C" className="h-3.5 text-[8px]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="SILVER" className="h-8 px-3 text-xs font-bold gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white">
              <span>SILVER</span>
              <HotkeyHint hotkey="S" className="h-3.5 text-[8px]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="ESILVER" className="h-8 px-3 text-xs font-bold gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white">
              <span>MIX GOLD</span>
              <HotkeyHint hotkey="M" className="h-3.5 text-[8px]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="TEZABI" className="h-8 px-3 text-xs font-bold gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white">
              <span>TEZABI</span>
              <HotkeyHint hotkey="U" className="h-3.5 text-[8px]" />
            </ToggleGroupItem>
            <ToggleGroupItem value="PURE SILVER" className="h-8 px-3 text-xs font-bold gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white">
              <span>CHANDI</span>
              <HotkeyHint hotkey="Y" className="h-3.5 text-[8px]" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Tehleel Grid */}
        <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
          <div className="bg-muted/70 px-3 py-2 border-b flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="w-36 uppercase tracking-wider font-sans">Measurement Row</span>
            <div className="grid grid-cols-4 w-full text-right font-mono tracking-wider">
              <span>TOLA</span>
              <span>MASHA</span>
              <span>RATTI</span>
              <span className="text-amber-800 dark:text-amber-300 font-bold">GRAMS</span>
            </div>
          </div>

          <div className="p-3 space-y-2.5">
            {/* ROW 1: 1ST WEIGHT */}
            <WeightInput
              label="1ST WEIGHT"
              tint="tint-row-weight"
              value={firstWeightMg}
              onChange={setFirstWeightMg}
              activeUnit={unitMode}
            />

            {/* ROW 2: 2ND WEIGHT */}
            <WeightInput
              label="2ND WEIGHT"
              tint="tint-row-cut"
              value={secondWeightMg}
              onChange={setSecondWeightMg}
              activeUnit={unitMode}
            />

            {/* ROW 3: CUT / TOLA */}
            <WeightInput
              label="CUT / TOLA"
              tint="tint-row-cut"
              value={cutPerTolaMg}
              onChange={setCutPerTolaMg}
              activeUnit={unitMode}
            />

            {/* ROW 4: IMPURITY (Calculated) */}
            <div className="space-y-0.5">
              <WeightInput
                label="IMPURITY"
                tint="tint-row-polish"
                value={impurityMg}
                onChange={() => {}}
                readOnly={true}
                activeUnit={unitMode}
              />
            </div>

            {/* ROW 5: PURE GOLD (Calculated bold orange) */}
            <div className="pt-1 border-t-2 border-dashed">
              <div className="flex items-center rounded border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-2">
                <div className="w-36 font-sans font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300 px-2">
                  PURE GOLD
                </div>
                <div className="grid grid-cols-4 w-full text-right font-mono font-bold text-sm tracking-tight text-foreground">
                  <div className="px-2">{formatTMR(pureGoldMg, gramsPerTola).split(' ')[0]}</div>
                  <div className="px-2">{formatTMR(pureGoldMg, gramsPerTola).split(' ')[1]}</div>
                  <div className="px-2">{formatTMR(pureGoldMg, gramsPerTola).split(' ')[2]}</div>
                  <div className="px-2 text-xl font-bold text-foreground">
                    {formatGrams(pureGoldMg, 4)} <span className="text-xs font-sans font-medium text-muted-foreground">g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 6: CARAT ROW */}
            <div className="p-3 rounded-lg border border-border bg-muted/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-xs uppercase text-foreground">
                  ASSAY PURITY RESULT
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Ratio: {formatGrams(pureGoldMg)}g / {formatGrams(firstWeightMg)}g × 24
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-foreground">
                    {karat} <span className="text-sm font-sans font-medium text-muted-foreground">Karat</span>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{purityPercent}% Pure</div>
                </div>
                <KaratBadge karat={karat} permille={permille} size="lg" />
              </div>
            </div>

            {/* ROW 7 & 8: RATE & AMOUNT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Gold Rate / Tola (PKR)
                </label>
                <MoneyInput
                  value={ratePkr}
                  onChange={setRatePkr}
                  className="h-10 text-base font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Total Gold Value Amount (PKR)
                </label>
                <div className="h-10 px-3 flex items-center justify-end font-mono font-black text-xl text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-300 dark:border-amber-800">
                  {formatMoney(amountPkr)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-12 border-t bg-card px-4 flex items-center justify-between select-none shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 px-4"
          >
            <Save className="h-4 w-4" />
            SAVE TEST (F8)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="h-8 text-xs font-bold gap-1.5 px-3"
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
            PRINT (P)
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZero}
            className="h-8 text-xs text-red-600 hover:bg-red-50 gap-1.5 px-3"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            ZERO (F4)
          </Button>
        </div>

        {/* Right Unit buttons */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded border text-xs font-mono">
          <button
            type="button"
            onClick={() => setUnitMode('auto')}
            className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'auto' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
          >
            AUTO
          </button>
          <button
            type="button"
            onClick={() => setUnitMode('grams')}
            className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'grams' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
          >
            GRAMS
          </button>
          <button
            type="button"
            onClick={() => setUnitMode('tola')}
            className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'tola' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
          >
            TOLAS
          </button>
        </div>
      </div>

      <CustomerSelectModal
        open={customerModalOpen}
        onOpenChange={setCustomerModalOpen}
        onSelectCustomer={setSelectedCustomer}
        onNewCustomer={() => {}}
      />
    </div>
  )
}
