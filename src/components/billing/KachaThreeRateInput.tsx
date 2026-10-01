import React, { useState, useEffect } from 'react'
import { getMgPerMasha, getMgPerRatti, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'

interface Props {
  mgPerTola: number
  onChangeMgPerTola: (mg: number) => void
  gramsPerTola?: number
}

export const KachaThreeRateInput: React.FC<Props> = ({
  mgPerTola,
  onChangeMgPerTola,
  gramsPerTola = DEFAULT_GRAMS_PER_TOLA,
}) => {
  const [masha, setMasha] = useState('')
  const [ratti, setRatti] = useState('')
  const [chawal, setChawal] = useState('')

  const mgM = getMgPerMasha(gramsPerTola)
  const mgR = getMgPerRatti(gramsPerTola)
  const mgC = mgR / 8

  useEffect(() => {
    if (mgPerTola === 0) {
      setMasha('')
      setRatti('')
      setChawal('')
      return
    }
    const m = Math.floor(mgPerTola / mgM)
    const remR = mgPerTola - m * mgM
    const r = Math.floor(remR / mgR)
    const c = Math.round((remR - r * mgR) / mgC)
    setMasha(m ? m.toString() : '')
    setRatti(r ? r.toString() : '')
    setChawal(c ? c.toString() : '')
  }, [mgPerTola, mgM, mgR, mgC])

  const update = (mVal: string, rVal: string, cVal: string) => {
    const m = parseFloat(mVal) || 0
    const r = parseFloat(rVal) || 0
    const c = parseFloat(cVal) || 0
    const total = Math.round(m * mgM + r * mgR + c * mgC)
    onChangeMgPerTola(total)
  }

  return (
    <div className="flex items-center justify-center gap-1 px-1 py-0.5">
      <input
        type="number"
        placeholder="M"
        value={masha}
        title="Masha per tola"
        onChange={(e) => { setMasha(e.target.value); update(e.target.value, ratti, chawal) }}
        className="w-8 h-8 text-center text-xs font-mono font-bold bg-background border border-border/80 rounded focus:bg-sky-100 dark:focus:bg-sky-950 focus:border-sky-500 focus:outline-none"
      />
      <input
        type="number"
        placeholder="R"
        value={ratti}
        title="Ratti per tola"
        onChange={(e) => { setRatti(e.target.value); update(masha, e.target.value, chawal) }}
        className="w-8 h-8 text-center text-xs font-mono font-bold bg-background border border-border/80 rounded focus:bg-sky-100 dark:focus:bg-sky-950 focus:border-sky-500 focus:outline-none"
      />
      <input
        type="number"
        placeholder="C"
        value={chawal}
        title="Chawal (points) per tola"
        onChange={(e) => { setChawal(e.target.value); update(masha, ratti, e.target.value) }}
        className="w-8 h-8 text-center text-xs font-mono font-bold bg-background border border-border/80 rounded focus:bg-sky-100 dark:focus:bg-sky-950 focus:border-sky-500 focus:outline-none"
      />
    </div>
  )
}
