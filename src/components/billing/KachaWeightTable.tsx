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
    if (polishRateMg > 0) setPolishMg(Math.round((weightMg / (gramsPerTola * 1000)) * polishRateMg))
  }, [weightMg, cutRateMg, polishRateMg, gramsPerTola, setCutMg, setPolishMg])

  const netWeightMg = Math.max(0, weightMg - cutMg - polishMg)

  return (
    <div className="rounded-lg border-2 border-slate-500 dark:border-slate-700 overflow-hidden bg-card shadow-sm">
      <KachaTableHeader headers={HEADERS} />

      <div className="divide-y-2 divide-slate-300 dark:divide-slate-800">
        {/* ROW 1: WEIGHT (Solid Mint Green) */}
        <KachaTableSimpleRow
          label="WEIGHT"
          mg={weightMg}
          onChangeMg={setWeightMg}
          gramsPerTola={gramsPerTola}
          highlightGrams
          rowBgClass="bg-[#bbf7d0] dark:bg-[#064e3b] text-slate-900 dark:text-emerald-50"
        />

        {/* ROW 2: CUT / TOLA (Solid Sky Blue) */}
        <KachaTraditionalRateRow
          label="CUT / TOLA"
          rateMg={cutRateMg}
          onChangeRateMg={setCutRateMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-[#bae6fd] dark:bg-[#0c4a6e] text-slate-900 dark:text-sky-50"
        />

        {/* ROW 3: CUT (Solid Sky Blue) */}
        <KachaDeductionTotalRow
          label="CUT" subInputLabel="NAG" subInputValue={nagCount} onSubInputChange={setNagCount}
          subInputBgClass="bg-white dark:bg-slate-900 border-sky-400 dark:border-sky-600 text-slate-900 dark:text-sky-100"
          mg={cutMg} onChangeMg={setCutMg} gramsPerTola={gramsPerTola}
          rowBgClass="bg-[#bae6fd] dark:bg-[#0c4a6e] text-slate-900 dark:text-sky-50"
        />

        {/* ROW 4: POLISH / TOLA (Solid Peach / Amber) */}
        <KachaTraditionalRateRow
          label="POLISH /"
          badge="TOLA"
          rateMg={polishRateMg}
          onChangeRateMg={setPolishRateMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-[#fde68a] dark:bg-[#78350f] text-slate-900 dark:text-amber-50"
        />

        {/* ROW 5: POLISH (Solid Peach / Amber) */}
        <KachaDeductionTotalRow
          label="POLISH"
          subInputValue={polishNote}
          onSubInputChange={setPolishNote}
          subInputBgClass="bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-600 text-slate-900 dark:text-amber-100"
          mg={polishMg}
          onChangeMg={setPolishMg}
          gramsPerTola={gramsPerTola}
          rowBgClass="bg-[#fde68a] dark:bg-[#78350f] text-slate-900 dark:text-amber-50"
        />

        {/* ROW 6: TOTAL WT (Solid Master Total) */}
        <KachaTableSimpleRow
          label="TOTAL WT"
          mg={netWeightMg}
          onChangeMg={() => {}}
          gramsPerTola={gramsPerTola}
          highlightGrams
          readOnly
          rowBgClass="bg-[#e2e8f0] dark:bg-[#0f172a] text-slate-950 dark:text-amber-300 border-t-4 border-slate-600 dark:border-amber-500 font-black"
        />
      </div>
    </div>
  )
}
