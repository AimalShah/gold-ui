import React from 'react'
import { ChargesMode } from '@/lib/gold-math'
import { KachaWeightTable } from './KachaWeightTable'
import { BillingValuationGrid } from './BillingValuationGrid'

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
  goldValuePkr: number
  totalAmountPkr: number
  amountReceivedPkr: number
  setAmountReceivedPkr: (amt: number) => void
  balanceDuePkr: number
}

export const ProductSpecCard: React.FC<ProductSpecCardProps> = (p) => {
  return (
    <div className="space-y-4">
      {/* 1: KACHA WEIGHT TABLE */}
      <KachaWeightTable
        weightMg={p.weightMg}
        setWeightMg={p.setWeightMg}
        cutMg={p.stoneDeductionMg}
        setCutMg={p.setStoneDeductionMg}
        polishMg={p.polishDeductionMg}
        setPolishMg={p.setPolishDeductionMg}
        gramsPerTola={p.gramsPerTola}
      />

      {/* 2: TRADITIONAL VALUATION GRID */}
      <BillingValuationGrid
        goldRatePkr={p.goldRatePkr}
        setGoldRatePkr={p.setGoldRatePkr}
        goldValuePkr={p.goldValuePkr}
        chargesMode={p.chargesMode}
        setChargesMode={p.setChargesMode}
        chargesPkr={p.chargesPkr}
        setChargesPkr={p.setChargesPkr}
        totalAmountPkr={p.totalAmountPkr}
        amountReceivedPkr={p.amountReceivedPkr}
        setAmountReceivedPkr={p.setAmountReceivedPkr}
        balanceDuePkr={p.balanceDuePkr}
        carat={p.carat}
        setCarat={p.setCarat}
        productName={p.productName}
        setProductName={p.setProductName}
      />
    </div>
  )
}
