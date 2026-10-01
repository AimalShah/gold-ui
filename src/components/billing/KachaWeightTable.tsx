import React, { useState, useEffect } from 'react'
import { DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { KachaTableHeader } from './KachaTableHeader'
import { KachaTableSimpleRow } from './KachaTableSimpleRow'
import { KachaTraditionalRateRow } from './KachaTraditionalRateRow'
import { KachaDeductionTotalRow } from './KachaDeductionTotalRow'

interface Props {
  weightMg: number; setWeightMg: (mg: number) => void
  cutMg: number; setCutMg: (mg: number) => void
  polishMg: number; setPolishMg: (mg: number) => void
  gramsPerTola?: number
}

const HEADERS = ['KACHA', 'TOLA', 'MASHA', 'RATTI', 'GRAMS']

export const KachaWeightTable: React.FC<Props> = ({
  weightMg, setWeightMg, cutMg, setCutMg, polishMg, setPolishMg, gramsPerTola = DEFAULT_GRAMS_PER_TOLA
}) => {
  const [cutRateMg, setCutRateMg] = useState(0), [polishRateMg, setPolishRateMg] = useState(122)
  const [nagCount, setNagCount] = useState(''), [polishNote, setPolishNote] = useState('')

  useEffect(() => {
    if (cutRateMg > 0) setCutMg(Math.round((weightMg / (gramsPerTola * 1000)) * cutRateMg))
  }, [weightMg, cutRateMg, gramsPerTola, setCutMg])

  useEffect(() => {
    if (polishRateMg > 0) setPolishMg(Math.round((weightMg / (gramsPerTola * 1000)) * polishRateMg))
  }, [weightMg, polishRateMg, gramsPerTola, setPolishMg])

  const netWeightMg = Math.max(0, weightMg - cutMg - polishMg)

  return (
    <div className="rounded-lg border-2 border-border/90 overflow-hidden bg-card shadow-sm">
      <KachaTableHeader headers={HEADERS} />

      <div className="divide-y divide-border/70">
        <KachaTableSimpleRow
          label="WEIGHT"
          mg={weightMg}
          onChangeMg={setWeightMg}
          gramsPerTola={gramsPerTola}
          highlightGrams
          rowBgClass="bg-emerald-500/10 dark:bg-emerald-950/20"
        />

        <KachaTraditionalRateRow
          label="CUT / TOLA"
          rateMg={cutRateMg}
          onChangeRateMg={setCutRateMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-sky-500/10 dark:bg-sky-950/20"
        />

        <KachaDeductionTotalRow
          label="CUT"
          subInputLabel="NAG"
          subInputValue={nagCount}
          onSubInputChange={setNagCount}
          mg={cutMg}
          onChangeMg={setCutMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-sky-500/10 dark:bg-sky-950/20"
        />

        <KachaTraditionalRateRow
          label="POLISH /"
          badge="TOLA"
          rateMg={polishRateMg}
          onChangeRateMg={setPolishRateMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-amber-500/10 dark:bg-amber-950/20"
        />

        <KachaDeductionTotalRow
          label="POLISH"
          subInputValue={polishNote}
          onSubInputChange={setPolishNote}
          subInputBgClass="bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800"
          mg={polishMg}
          onChangeMg={setPolishMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-amber-500/10 dark:bg-amber-950/20"
        />

        <KachaTableSimpleRow
          label="TOTAL WT"
          mg={netWeightMg}
          onChangeMg={() => {}}
          gramsPerTola={gramsPerTola}
          highlightGrams
          readOnly
          rowBgClass="bg-primary/20 dark:bg-primary/25 border-t-2 border-primary/50 font-black text-primary"
        />
      </div>
    </div>
  )
}
