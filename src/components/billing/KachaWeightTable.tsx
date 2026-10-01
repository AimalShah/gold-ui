import React, { useState, useEffect } from 'react'
import { formatTMR, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { KachaTableRowInput } from './KachaTableRowInput'
import { KachaTableSimpleRow } from './KachaTableSimpleRow'
import { KachaTableDeductionRow, DeductionUnit } from './KachaTableDeductionRow'

interface Props {
  weightMg: number
  setWeightMg: (mg: number) => void
  cutMg: number
  setCutMg: (mg: number) => void
  polishMg: number
  setPolishMg: (mg: number) => void
  gramsPerTola?: number
}

const HEADERS = ['KACHA', 'TOLA', 'MASHA', 'RATTI', 'GRAMS']

export const KachaWeightTable: React.FC<Props> = ({
  weightMg, setWeightMg, cutMg, setCutMg, polishMg, setPolishMg, gramsPerTola = DEFAULT_GRAMS_PER_TOLA
}) => {
  const [cutPerTolaMg, setCutPerTolaMg] = useState(0)
  const [cutUnit, setCutUnit] = useState<DeductionUnit>('auto')
  const [polishPerTolaMg, setPolishPerTolaMg] = useState(122)
  const [polishUnit, setPolishUnit] = useState<DeductionUnit>('auto')

  useEffect(() => {
    if (cutUnit === 'auto') {
      setCutMg(Math.round((weightMg / (gramsPerTola * 1000)) * cutPerTolaMg))
    }
  }, [weightMg, cutPerTolaMg, cutUnit, gramsPerTola, setCutMg])

  useEffect(() => {
    if (polishUnit === 'auto') {
      setPolishMg(Math.round((weightMg / (gramsPerTola * 1000)) * polishPerTolaMg))
    }
  }, [weightMg, polishPerTolaMg, polishUnit, gramsPerTola, setPolishMg])

  const netWeightMg = Math.max(0, weightMg - cutMg - polishMg)

  return (
    <div className="rounded-lg border border-border/80 overflow-hidden bg-card shadow-2xs">
      <div className="grid grid-cols-12 w-full items-center border-b border-border/80 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider">
        {HEADERS.map((h, i) => (
          <div
            key={h}
            className={`${i === 0 ? 'col-span-4 text-foreground font-bold px-3 text-left' : 'col-span-2 text-muted-foreground border-l border-border/60 px-2 text-center'} ${i === 4 ? 'text-primary font-bold' : ''} py-2`}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="divide-y divide-border/60 text-xs">
        <KachaTableSimpleRow label="WEIGHT" subtitle="Initial Gross Weight" mg={weightMg} onChangeMg={setWeightMg} gramsPerTola={gramsPerTola} highlightGrams />
        <KachaTableSimpleRow label="CUT/TOLA" subtitle="Deduction rate per tola" mg={cutPerTolaMg} onChangeMg={setCutPerTolaMg} gramsPerTola={gramsPerTola} />
        <KachaTableDeductionRow label="CUT" subtitle="Stone / Kat deduction" unit={cutUnit} onUnitChange={setCutUnit} mg={cutMg} onChangeMg={setCutMg} gramsPerTola={gramsPerTola} />
        <KachaTableSimpleRow label="POLISH PER/TOLA" subtitle="Polish rate per tola" mg={polishPerTolaMg} onChangeMg={setPolishPerTolaMg} gramsPerTola={gramsPerTola} />
        <KachaTableDeductionRow label="POLISH" subtitle="Wastage / Polish deduction" unit={polishUnit} onUnitChange={setPolishUnit} mg={polishMg} onChangeMg={setPolishMg} gramsPerTola={gramsPerTola} />

        {/* ROW 6: LAST TOTAL WEIGHT */}
        <div className="grid grid-cols-12 items-center bg-primary/10 border-t border-primary/25 font-bold">
          <div className="col-span-4 px-3 py-2">
            <span className="font-bold text-primary text-xs uppercase tracking-wider block">LAST TOTAL WEIGHT</span>
            <span className="text-[10px] text-muted-foreground font-mono">{formatTMR(netWeightMg, gramsPerTola)}</span>
          </div>
          <div className="col-span-8 grid grid-cols-4 items-center">
            <KachaTableRowInput mg={netWeightMg} onChangeMg={() => {}} gramsPerTola={gramsPerTola} readOnly />
          </div>
        </div>
      </div>
    </div>
  )
}
