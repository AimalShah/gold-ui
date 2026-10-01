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
  subInputBgClass = 'bg-background border-border text-foreground',
  mg,
  onChangeMg,
  gramsPerTola,
}) => {
  return (
    <div className={cn('grid grid-cols-12 items-center border-b-2 border-border', rowBgClass)}>
      {/* Col 1: Label + Nag/Stone count input box */}
      <div className="col-span-4 px-3 py-2 flex items-center justify-between gap-2">
        <span className="font-black text-foreground text-xl tracking-tight">{label}</span>
        {onSubInputChange && (
          <div className="flex items-center gap-1.5">
            {subInputLabel && (
              <span className="text-xs font-bold text-muted-foreground uppercase">{subInputLabel}</span>
            )}
            <input
              type="text"
              placeholder="0"
              value={subInputValue}
              onChange={(e) => onSubInputChange(e.target.value)}
              className={cn(
                'w-14 h-10 text-center text-xl font-mono font-bold border-2 rounded focus:outline-none focus:ring-2 focus:ring-primary',
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
