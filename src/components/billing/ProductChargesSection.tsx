import React from 'react'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { ChargesMode } from '@/lib/gold-math'
import { Coins } from 'lucide-react'
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
  goldRatePkr, setGoldRatePkr, defaultRate, chargesMode, setChargesMode, chargesPkr, setChargesPkr,
}) => {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <Coins className="size-4 text-primary" strokeWidth={2} />
          <span className="text-sm font-bold text-foreground uppercase tracking-wide">Valuation & Charges</span>
        </div>
        <span className="text-xs font-mono font-semibold text-muted-foreground">Mandi: Rs {defaultRate.toLocaleString()}</span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide block">Gold Rate / Tola (PKR)</label>
        <MoneyInput value={goldRatePkr} onChange={setGoldRatePkr} className="h-10 text-base font-bold font-mono" />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide">Crafting Charges</label>
          <div className="inline-flex rounded-md p-0.5 bg-muted/90 border border-border/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChargesMode('per_tola')}
              className={cn('px-2.5 py-1 rounded cursor-pointer transition-colors', chargesMode === 'per_tola' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground')}
            >
              / Tola
            </button>
            <button
              type="button"
              onClick={() => setChargesMode('fix')}
              className={cn('px-2.5 py-1 rounded cursor-pointer transition-colors', chargesMode === 'fix' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground')}
            >
              Fixed
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MoneyInput value={chargesPkr} onChange={setChargesPkr} className="h-10 text-base font-bold font-mono flex-1" />
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setChargesPkr(amt)}
                className="px-2 py-1.5 rounded border border-border bg-card hover:bg-muted text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
