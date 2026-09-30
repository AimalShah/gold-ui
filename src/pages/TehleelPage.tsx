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
import { PageTitle } from '@/components/shared/PageTitle'
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
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* PageTitle Header */}
          <PageTitle
            title="Gold Karat / Tehleel (Assay)"
            description="Laboratory acid fire-assay purity testing, impurity deductions, and net 24K conversion"
          >
            <div className="flex items-center gap-2">
              {selectedCustomer ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{selectedCustomer.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(null)}
                    className="text-muted-foreground hover:text-destructive font-bold ml-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCustomerModalOpen(true)}
                  className="h-8 text-xs font-semibold"
                >
                  <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Attach Customer
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage('billing')}
                className="h-8 text-xs font-semibold"
              >
                Back to Billing (Esc)
              </Button>
            </div>
          </PageTitle>

          {/* Metal Assay Selector ToggleGroup (Keys C / S / M / U / Y) */}
          <div className="p-4 bg-card rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assay Metal Base
            </div>

            <ToggleGroup
              type="single"
              value={metalType}
              onValueChange={(val) => val && setMetalType(val)}
              className="flex flex-wrap gap-1.5"
            >
              <ToggleGroupItem value="COPPER" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span>COPPER</span>
                <HotkeyHint hotkey="C" className="h-3.5 text-[8px]" />
              </ToggleGroupItem>
              <ToggleGroupItem value="SILVER" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span>SILVER</span>
                <HotkeyHint hotkey="S" className="h-3.5 text-[8px]" />
              </ToggleGroupItem>
              <ToggleGroupItem value="ESILVER" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span>MIX GOLD</span>
                <HotkeyHint hotkey="M" className="h-3.5 text-[8px]" />
              </ToggleGroupItem>
              <ToggleGroupItem value="TEZABI" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span>TEZABI</span>
                <HotkeyHint hotkey="U" className="h-3.5 text-[8px]" />
              </ToggleGroupItem>
              <ToggleGroupItem value="PURE SILVER" className="h-8 px-3 text-xs font-semibold gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span>CHANDI</span>
                <HotkeyHint hotkey="Y" className="h-3.5 text-[8px]" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Tehleel Grid Card */}
          <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="w-36 uppercase tracking-wider font-sans">Measurement Row</span>
              <div className="grid grid-cols-4 w-full text-right font-mono tracking-wider">
                <span>TOLA</span>
                <span>MASHA</span>
                <span>RATTI</span>
                <span className="text-foreground font-bold">GRAMS</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
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

              {/* ROW 5: PURE GOLD (Calculated) */}
              <div className="pt-2 border-t border-dashed border-border">
                <div className="flex items-center rounded-xl border border-primary/30 bg-primary/5 p-3">
                  <div className="w-36 font-sans font-bold text-sm uppercase tracking-wider text-primary px-2">
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
              <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Gold Rate / Tola (PKR)
                  </label>
                  <MoneyInput
                    value={ratePkr}
                    onChange={setRatePkr}
                    className="h-10 text-base font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Total Gold Value Amount (PKR)
                  </label>
                  <div className="h-10 px-4 flex items-center justify-end font-mono font-bold text-xl text-foreground bg-muted/40 rounded-lg border border-border">
                    {formatMoney(amountPkr)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="default"
                onClick={handleSave}
                className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 px-4"
              >
                <Save className="h-4 w-4" />
                SAVE TEST (F8)
              </Button>
              <Button
                size="default"
                variant="outline"
                onClick={handlePrint}
                className="h-9 text-xs font-bold gap-1.5 px-3"
              >
                <Printer className="h-4 w-4 text-muted-foreground" />
                PRINT (P)
              </Button>
              <Button
                size="default"
                variant="ghost"
                onClick={handleZero}
                className="h-9 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 px-3"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                ZERO (F4)
              </Button>
            </div>

            {/* Right Unit buttons */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setUnitMode('auto')}
                className={`px-2.5 py-1 rounded font-bold text-xs transition-colors ${unitMode === 'auto' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                AUTO
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('grams')}
                className={`px-2.5 py-1 rounded font-bold text-xs transition-colors ${unitMode === 'grams' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                GRAMS
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('tola')}
                className={`px-2.5 py-1 rounded font-bold text-xs transition-colors ${unitMode === 'tola' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                TOLAS
              </button>
            </div>
          </div>
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
