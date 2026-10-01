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
    <div className="rounded-lg border-2 border-border overflow-hidden bg-card shadow-sm">
      <KachaTableHeader headers={HEADERS} />

      <div className="divide-y-2 divide-border">
        {/* ROW 1: WEIGHT */}
        <KachaTableSimpleRow
          label="WEIGHT"
          mg={weightMg}
          onChangeMg={setWeightMg}
          gramsPerTola={gramsPerTola}
          highlightGrams
        />

        {/* ROW 2: CUT / TOLA */}
        <KachaTraditionalRateRow
          label="CUT / TOLA"
          rateMg={cutRateMg}
          onChangeRateMg={setCutRateMg}
          gramsPerTola={gramsPerTola}
        />

        {/* ROW 3: CUT */}
        <KachaDeductionTotalRow
          label="CUT"
          subInputLabel="NAG"
          subInputValue={nagCount}
          onSubInputChange={setNagCount}
          mg={cutMg}
          onChangeMg={setCutMg}
          gramsPerTola={gramsPerTola}
        />

        {/* ROW 4: POLISH / TOLA */}
        <KachaTraditionalRateRow
          label="POLISH /"
          badge="TOLA"
          rateMg={polishRateMg}
          onChangeRateMg={setPolishRateMg}
          gramsPerTola={gramsPerTola}
        />

        {/* ROW 5: POLISH */}
        <KachaDeductionTotalRow
          label="POLISH"
          subInputValue={polishNote}
          onSubInputChange={setPolishNote}
          mg={polishMg}
          onChangeMg={setPolishMg}
          gramsPerTola={gramsPerTola}
        />

        {/* ROW 6: TOTAL WT */}
        <KachaTableSimpleRow
          label="TOTAL WT"
          mg={netWeightMg}
          onChangeMg={() => {}}
          gramsPerTola={gramsPerTola}
          highlightGrams
          readOnly
          rowBgClass="bg-muted/40 font-black border-t-2 border-border"
        />
      </div>
    </div>
  )
}
