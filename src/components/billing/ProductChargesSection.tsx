import React from 'react'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { ChargesMode } from '@/lib/gold-math'

interface Props {
  goldRatePkr: number
  setGoldRatePkr: (rate: number) => void
  defaultRate: number
  chargesMode: ChargesMode
  setChargesMode: (mode: ChargesMode) => void
  chargesPkr: number
  setChargesPkr: (charges: number) => void
}

const PRESETS = [1000, 1500, 2000, 3500]

export const ProductChargesSection: React.FC<Props> = ({
  goldRatePkr,
  setGoldRatePkr,
  defaultRate,
  chargesMode,
  setChargesMode,
  chargesPkr,
  setChargesPkr,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Gold Rate / Tola (PKR)
          </label>
          <span className="text-xs font-mono text-muted-foreground">
            24K: {defaultRate.toLocaleString()}
          </span>
        </div>
        <MoneyInput value={goldRatePkr} onChange={setGoldRatePkr} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Making Charges (PKR)
          </label>
          <button
            type="button"
            onClick={() => setChargesMode(chargesMode === 'per_tola' ? 'fix' : 'per_tola')}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer px-2 py-0.5 rounded bg-primary/10 border border-primary/20"
          >
            Mode: {chargesMode === 'per_tola' ? 'Per Tola' : 'Fixed Total'}
          </button>
        </div>
        <MoneyInput value={chargesPkr} onChange={setChargesPkr} />
        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground font-medium">Presets:</span>
          {PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setChargesPkr(amt)}
              className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
