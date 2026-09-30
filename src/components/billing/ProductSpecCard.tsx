import React from 'react'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { Input } from '@/components/ui/input'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatGrams, formatTMR, ChargesMode } from '@/lib/gold-math'

interface ProductSpecCardProps {
  productName: string
  setProductName: (name: string) => void
  carat: number
  setCarat: (carat: number) => void
  weightMg: number
  setWeightMg: (mg: number) => void
  goldRatePkr: number
  setGoldRatePkr: (rate: number) => void
  defaultRate: number
  unitMode: 'auto' | 'grams' | 'tola'
  gramsPerTola: number
  stoneDeductionMg: number
  setStoneDeductionMg: (mg: number) => void
  polishDeductionMg: number
  setPolishDeductionMg: (mg: number) => void
  netWeightMg: number
  chargesMode: ChargesMode
  setChargesMode: (mode: ChargesMode) => void
  chargesPkr: number
  setChargesPkr: (charges: number) => void
}

const karatOptions = [
  { value: 24, label: '24 Karat', purity: 'Pure 99.9%' },
  { value: 22, label: '22 Karat', purity: 'Jewellery 91.6%' },
  { value: 21, label: '21 Karat', purity: 'Gulf Standard 87.5%' },
  { value: 18, label: '18 Karat', purity: 'Diamond Mount 75.0%' },
]

export const ProductSpecCard: React.FC<ProductSpecCardProps> = ({
  productName,
  setProductName,
  carat,
  setCarat,
  weightMg,
  setWeightMg,
  goldRatePkr,
  setGoldRatePkr,
  defaultRate,
  unitMode,
  gramsPerTola,
  stoneDeductionMg,
  setStoneDeductionMg,
  polishDeductionMg,
  setPolishDeductionMg,
  netWeightMg,
  chargesMode,
  setChargesMode,
  chargesPkr,
  setChargesPkr,
}) => {
  return (
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

      {/* Product Name */}
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

      {/* Gold Purity Cards */}
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

      {/* Gross Weight & Gold Rate */}
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
  )
}
