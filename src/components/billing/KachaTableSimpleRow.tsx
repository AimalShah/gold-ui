import React from 'react'
import { KachaTableRowInput } from './KachaTableRowInput'

interface Props {
  label: string
  subtitle: string
  mg: number
  onChangeMg: (mg: number) => void
  gramsPerTola: number
  highlightGrams?: boolean
}

export const KachaTableSimpleRow: React.FC<Props> = ({
  label,
  subtitle,
  mg,
  onChangeMg,
  gramsPerTola,
  highlightGrams,
}) => {
  return (
    <div className="grid grid-cols-12 items-center hover:bg-muted/15 transition-colors">
      <div className="col-span-4 px-3 py-1.5">
        <span className="font-semibold text-foreground text-xs uppercase tracking-wide block">{label}</span>
        <span className="text-[10px] text-muted-foreground">{subtitle}</span>
      </div>
      <div className="col-span-8 grid grid-cols-4 items-center">
        <KachaTableRowInput
          mg={mg}
          onChangeMg={onChangeMg}
          gramsPerTola={gramsPerTola}
          highlightGrams={highlightGrams}
        />
      </div>
    </div>
  )
}
