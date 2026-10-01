import React from 'react'
import { ChargesMode } from '@/lib/gold-math'
import { ValuationRateRow } from './ValuationRateRow'
import { ValuationChargesRow } from './ValuationChargesRow'
import { ValuationWasoolRow } from './ValuationWasoolRow'

interface Props {
  goldRatePkr: number
  setGoldRatePkr: (v: number) => void
  goldValuePkr: number
  chargesMode: ChargesMode
  setChargesMode: (m: ChargesMode) => void
  chargesPkr: number
  setChargesPkr: (v: number) => void
  totalAmountPkr: number
  amountReceivedPkr: number
  setAmountReceivedPkr: (v: number) => void
  balanceDuePkr: number
  carat: number
  setCarat: (v: number) => void
  productName: string
  setProductName: (v: string) => void
}

export const BillingValuationGrid: React.FC<Props> = (p) => {
  return (
    <div className="rounded-lg border-2 border-border overflow-hidden bg-card shadow-sm divide-y-2 divide-border">
      {/* ROW 1: GOLD RATE | GOLD PRICE | CARAT */}
      <ValuationRateRow
        goldRatePkr={p.goldRatePkr}
        setGoldRatePkr={p.setGoldRatePkr}
        goldValuePkr={p.goldValuePkr}
        carat={p.carat}
        setCarat={p.setCarat}
      />

      {/* ROW 2: CHARGES /F | TOTAL PRICE | DETAIL */}
      <ValuationChargesRow
        chargesMode={p.chargesMode}
        setChargesMode={p.setChargesMode}
        chargesPkr={p.chargesPkr}
        setChargesPkr={p.setChargesPkr}
        totalAmountPkr={p.totalAmountPkr}
        productName={p.productName}
        setProductName={p.setProductName}
      />

      {/* ROW 3: WASOOL | BAQAYA | QUICK CASH */}
      <ValuationWasoolRow
        totalAmountPkr={p.totalAmountPkr}
        amountReceivedPkr={p.amountReceivedPkr}
        setAmountReceivedPkr={p.setAmountReceivedPkr}
        balanceDuePkr={p.balanceDuePkr}
      />
    </div>
  )
}
