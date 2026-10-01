import React from 'react'
import { KachaTableRowInput } from './KachaTableRowInput'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  subInputLabel?: string
  subInputValue?: string
  onSubInputChange?: (val: string) => void
  rowBgClass?: string
  subInputBgClass?: string
  mg: number
  onChangeMg: (mg: number) => void
  gramsPerTola: number
}

export const KachaDeductionTotalRow: React.FC<Props> = ({
  label,
  subInputLabel,
  subInputValue = '',
  onSubInputChange,
  rowBgClass,
  subInputBgClass = 'bg-sky-100/80 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800',
  mg,
  onChangeMg,
  gramsPerTola,
}) => {
  return (
    <div className={cn('grid grid-cols-12 items-center border-b border-border/70', rowBgClass)}>
      {/* Col 1: Label + Nag/Stone count input box */}
      <div className="col-span-4 px-3 py-1.5 flex items-center justify-between gap-2">
        <span className="font-bold text-foreground text-sm tracking-tight">{label}</span>
        {onSubInputChange && (
          <div className="flex items-center gap-1">
            {subInputLabel && (
              <span className="text-[10px] font-semibold text-muted-foreground">{subInputLabel}</span>
            )}
            <input
              type="text"
              placeholder="0"
              value={subInputValue}
              onChange={(e) => onSubInputChange(e.target.value)}
              className={cn(
                'w-12 h-8 text-center text-xs font-mono font-bold border rounded focus:outline-none focus:ring-1 focus:ring-primary',
                subInputBgClass
              )}
            />
          </div>
        )}
      </div>

      {/* Col 2-5: TOLA, MASHA, RATTI, GRAMS */}
      <div className="col-span-8 grid grid-cols-4 items-center">
        <KachaTableRowInput
          mg={mg}
          onChangeMg={onChangeMg}
          gramsPerTola={gramsPerTola}
        />
      </div>
    </div>
  )
}
