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
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* KACHA TABLE */}
      <KachaWeightTable
        weightMg={p.weightMg}
        setWeightMg={p.setWeightMg}
        cutMg={p.stoneDeductionMg}
        setCutMg={p.setStoneDeductionMg}
        polishMg={p.polishDeductionMg}
        setPolishMg={p.setPolishDeductionMg}
        gramsPerTola={p.gramsPerTola}
      />

      {/* Symmetrical Dual-Panel Layout: Item Purity & Valuation Charges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-1 items-stretch">
        <ProductPuritySection
          productName={p.productName}
          setProductName={p.setProductName}
          carat={p.carat}
          setCarat={p.setCarat}
        />

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
    </div>
  )
}
