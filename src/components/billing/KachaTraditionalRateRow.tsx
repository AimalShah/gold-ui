import React from 'react'
import { toParts, formatGrams, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { KachaThreeRateInput } from './KachaThreeRateInput'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  subtitle?: string
  badge?: string
  rowBgClass?: string
  rateMg: number
  onChangeRateMg: (mg: number) => void
  gramsPerTola?: number
}

export const KachaTraditionalRateRow: React.FC<Props> = ({
  label,
  subtitle,
  badge,
  rowBgClass,
  rateMg,
  onChangeRateMg,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA,
}) => {
  const parts = toParts(rateMg, gramsPerTola)

  return (
    <div className={cn('grid grid-cols-12 items-center border-b-2 border-border', rowBgClass)}>
      {/* Col 1: KACHA Header */}
      <div className="col-span-4 px-3 py-2 flex items-center justify-between">
        <span className="font-black text-foreground text-xl tracking-tight">{label}</span>
        {badge && (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {badge}
          </span>
        )}
        {subtitle && <span className="text-xs text-muted-foreground font-semibold">{subtitle}</span>}
      </div>

      {/* Col 2: TOLA with 3 sub-rate boxes */}
      <div className="col-span-2 border-l-2 border-border py-1.5">
        <KachaThreeRateInput
          mgPerTola={rateMg}
          onChangeMgPerTola={onChangeRateMg}
          gramsPerTola={gramsPerTola}
        />
      </div>

      {/* Col 3: MASHA */}
      <div className="col-span-2 border-l-2 border-border text-center font-mono font-black text-xl py-2">
        {parts.masha || 0}
      </div>

      {/* Col 4: RATTI */}
      <div className="col-span-2 border-l-2 border-border text-center font-mono font-black text-xl py-2">
        {parts.ratti.toFixed(2)}
      </div>

      {/* Col 5: GRAMS */}
      <div className="col-span-2 border-l-2 border-border text-center font-mono font-black text-xl py-2 text-primary">
        {formatGrams(rateMg, 3)}
      </div>
    </div>
  )
}
