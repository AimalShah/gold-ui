import React from 'react'
import { KachaTableRowInput } from './KachaTableRowInput'

export type DeductionUnit = 'auto' | 'grams' | 'ratti' | 'masha' | 'tola'

interface Props {
  label: string
  subtitle: string
  unit: DeductionUnit
  onUnitChange: (unit: DeductionUnit) => void
  mg: number
  onChangeMg: (mg: number) => void
  gramsPerTola: number
}

export const KachaTableDeductionRow: React.FC<Props> = ({
  label,
  subtitle,
  unit,
  onUnitChange,
  mg,
  onChangeMg,
  gramsPerTola,
}) => {
  return (
    <div className="grid grid-cols-12 items-center bg-muted/10 hover:bg-muted/20 transition-colors">
      <div className="col-span-4 px-3 py-2 flex items-center justify-between gap-1.5">
        <div>
          <span className="font-bold text-foreground text-xs uppercase tracking-wide block">{label}</span>
          <span className="text-[10px] text-muted-foreground">{subtitle}</span>
        </div>
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as DeductionUnit)}
          className="text-[11px] font-semibold bg-background border border-border rounded px-1.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="auto">Auto (/Tola)</option>
          <option value="grams">Grams (g)</option>
          <option value="ratti">Ratti (r)</option>
          <option value="masha">Masha (m)</option>
          <option value="tola">Tola (t)</option>
        </select>
      </div>
      <div className="col-span-8 grid grid-cols-4 items-center">
        <KachaTableRowInput
          mg={mg}
          onChangeMg={(newMg) => {
            onUnitChange('grams')
            onChangeMg(newMg)
          }}
          gramsPerTola={gramsPerTola}
        />
      </div>
    </div>
  )
}
