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
    <div className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-3.5 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-1.5">
          <Coins className="size-3.5 text-primary" strokeWidth={1.75} />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">Valuation & Crafting Charges</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Mandi: Rs {defaultRate.toLocaleString()}</span>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Gold Rate / Tola (PKR)</label>
        <MoneyInput value={goldRatePkr} onChange={setGoldRatePkr} className="h-9" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Crafting Charges</label>
          <div className="inline-flex rounded-md p-0.5 bg-muted/90 border border-border/60 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setChargesMode('per_tola')}
              className={cn('px-2 py-0.5 rounded cursor-pointer', chargesMode === 'per_tola' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground')}
            >
              / Tola
            </button>
            <button
              type="button"
              onClick={() => setChargesMode('fix')}
              className={cn('px-2 py-0.5 rounded cursor-pointer', chargesMode === 'fix' ? 'bg-card text-foreground shadow-2xs font-bold' : 'text-muted-foreground')}
            >
              Fixed
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <MoneyInput value={chargesPkr} onChange={setChargesPkr} className="h-9 flex-1" />
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setChargesPkr(amt)}
                className="px-1.5 py-1 rounded border border-border/70 bg-card hover:bg-muted text-[10px] font-mono font-medium cursor-pointer"
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
