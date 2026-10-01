import React from 'react'
import { Sparkles } from 'lucide-react'
import { ChargesMode } from '@/lib/gold-math'
import { ProductPuritySection } from './ProductPuritySection'
import { KachaWeightTable } from './KachaWeightTable'
import { ProductChargesSection } from './ProductChargesSection'

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

export const ProductSpecCard: React.FC<ProductSpecCardProps> = (p) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Product & Gold Specifications</h2>
            <p className="text-xs text-muted-foreground">Item description, purity, weights and non-gold deductions</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{p.carat}K Fine</span>
      </div>

      <ProductPuritySection productName={p.productName} setProductName={p.setProductName} carat={p.carat} setCarat={p.setCarat} />

      <div className="space-y-1.5 pt-1">
        <label className="text-sm font-semibold text-foreground block">Weight Matrix & Deductions (Kacha System)</label>
        <KachaWeightTable
          weightMg={p.weightMg}
          setWeightMg={p.setWeightMg}
          cutMg={p.stoneDeductionMg}
          setCutMg={p.setStoneDeductionMg}
          polishMg={p.polishDeductionMg}
          setPolishMg={p.setPolishDeductionMg}
          gramsPerTola={p.gramsPerTola}
        />
      </div>

      <ProductChargesSection
        goldRatePkr={p.goldRatePkr}
        setGoldRatePkr={p.setGoldRatePkr}
        defaultRate={p.defaultRate}
        chargesMode={p.chargesMode}
        setChargesMode={p.setChargesMode}
        chargesPkr={p.chargesPkr}
        setChargesPkr={p.setChargesPkr}
      />
    </div>
  )
}
