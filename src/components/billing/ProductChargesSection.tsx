import React from 'react'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { ChargesMode } from '@/lib/gold-math'
import { cn } from '@/lib/utils'

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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            Gold Market Rate / Tola (PKR)
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">
            Mandi: Rs {defaultRate.toLocaleString()}
          </span>
        </div>
        <MoneyInput value={goldRatePkr} onChange={setGoldRatePkr} />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            Crafting & Making Charges
          </label>
          <div className="inline-flex rounded-md p-0.5 bg-muted/80 border border-border/60 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setChargesMode('per_tola')}
              className={cn(
                'px-2 py-0.5 rounded transition-all cursor-pointer',
                chargesMode === 'per_tola'
                  ? 'bg-card text-foreground shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              / Tola
            </button>
            <button
              type="button"
              onClick={() => setChargesMode('fix')}
              className={cn(
                'px-2 py-0.5 rounded transition-all cursor-pointer',
                chargesMode === 'fix'
                  ? 'bg-card text-foreground shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Fixed
            </button>
          </div>
        </div>
        <MoneyInput value={chargesPkr} onChange={setChargesPkr} />
        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium">Quick:</span>
          {PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setChargesPkr(amt)}
              className="px-2 py-0.5 rounded border border-border/70 bg-card hover:bg-muted/60 text-[10px] font-mono font-medium transition-colors cursor-pointer"
            >
              Rs {amt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
