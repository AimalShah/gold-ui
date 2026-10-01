import React from 'react'
import { KachaTableRowInput } from './KachaTableRowInput'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  subtitle?: string
  mg: number
  onChangeMg: (mg: number) => void
  gramsPerTola: number
  highlightGrams?: boolean
  rowBgClass?: string
  readOnly?: boolean
}

export const KachaTableSimpleRow: React.FC<Props> = ({
  label,
  subtitle,
  mg,
  onChangeMg,
  gramsPerTola,
  highlightGrams,
  rowBgClass,
  readOnly = false,
}) => {
  return (
    <div className={cn('grid grid-cols-12 items-center border-b-2 border-border', rowBgClass)}>
      <div className="col-span-4 px-4 py-3.5 flex items-center justify-between">
        <span className="font-black text-foreground text-xl tracking-tight">{label}</span>
        {subtitle && <span className="text-xs text-muted-foreground font-semibold">{subtitle}</span>}
      </div>
      <div className="col-span-8 grid grid-cols-4 items-center">
        <KachaTableRowInput
          mg={mg}
          onChangeMg={onChangeMg}
          gramsPerTola={gramsPerTola}
          highlightGrams={highlightGrams}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}
