import React from 'react'
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
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-tight uppercase">
            Product & Gold Specifications
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Item description, purity hallmark, gross weight, and deductions
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/25 text-primary text-xs font-bold font-mono">
          <span>{p.carat}K</span>
          <span className="text-[10px] font-sans font-medium opacity-80">Hallmark</span>
        </div>
      </div>

      <ProductPuritySection
        productName={p.productName}
        setProductName={p.setProductName}
        carat={p.carat}
        setCarat={p.setCarat}
      />

      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground uppercase tracking-wide">
            Weight Ledger & Deductions (Kacha System)
          </label>
          <span className="text-[11px] text-muted-foreground font-mono">
            1 Tola = {p.gramsPerTola}g
          </span>
        </div>
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
