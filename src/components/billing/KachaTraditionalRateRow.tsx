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
    <div className={cn('grid grid-cols-12 items-center border-b border-border/70', rowBgClass)}>
      {/* Col 1: KACHA Header */}
      <div className="col-span-4 px-3 py-1.5 flex items-center justify-between">
        <span className="font-bold text-foreground text-sm tracking-tight">{label}</span>
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30">
            {badge}
          </span>
        )}
        {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
      </div>

      {/* Col 2: TOLA with 3 small sub-rate boxes [M][R][C] */}
      <div className="col-span-2 border-l border-border/70 py-1">
        <KachaThreeRateInput
          mgPerTola={rateMg}
          onChangeMgPerTola={onChangeRateMg}
          gramsPerTola={gramsPerTola}
        />
      </div>

      {/* Col 3: MASHA */}
      <div className="col-span-2 border-l border-border/70 text-center font-mono font-bold text-base py-1">
        {parts.masha || 0}
      </div>

      {/* Col 4: RATTI */}
      <div className="col-span-2 border-l border-border/70 text-center font-mono font-bold text-base py-1">
        {parts.ratti.toFixed(2)}
      </div>

      {/* Col 5: GRAMS */}
      <div className="col-span-2 border-l border-border/70 text-center font-mono font-bold text-base py-1 text-primary">
        {formatGrams(rateMg, 3)}
      </div>
    </div>
  )
}
