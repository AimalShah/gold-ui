import React, { useState, useEffect } from 'react'
import { toParts, fromParts, formatGrams, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { cn } from '@/lib/utils'

interface Props {
  mg: number
  onChangeMg: (mg: number) => void
  gramsPerTola?: number
  readOnly?: boolean
  highlightGrams?: boolean
}

export const KachaTableRowInput: React.FC<Props> = ({
  mg, onChangeMg, gramsPerTola = DEFAULT_GRAMS_PER_TOLA, readOnly = false, highlightGrams = false,
}) => {
  const parts = toParts(mg, gramsPerTola)
  const [active, setActive] = useState<'tola' | 'masha' | 'ratti' | 'grams' | null>(null)
  const [tStr, setT] = useState(''), [mStr, setM] = useState(''), [rStr, setR] = useState(''), [gStr, setG] = useState('')

  useEffect(() => {
    if (!active) {
      if (mg === 0) { setT(''); setM(''); setR(''); setG(''); return }
      const p = toParts(mg, gramsPerTola)
      setT(p.tola ? p.tola.toString() : '')
      setM(p.masha ? p.masha.toString() : '')
      setR(p.ratti ? p.ratti.toString() : '')
      setG(p.grams ? p.grams.toFixed(4) : '')
    }
  }, [mg, gramsPerTola, active])

  const onTmr = (t: string, m: string, r: string) => {
    const cMg = fromParts({ tola: parseFloat(t) || 0, masha: parseFloat(m) || 0, ratti: parseFloat(r) || 0 }, gramsPerTola)
    onChangeMg(cMg)
    setG(cMg !== 0 ? (cMg / 1000).toFixed(4) : '')
  }

  const onGm = (val: string) => {
    setG(val)
    const cMg = Math.round((parseFloat(val) || 0) * 1000)
    onChangeMg(cMg)
    const p = toParts(cMg, gramsPerTola)
    setT(p.tola ? p.tola.toString() : '')
    setM(p.masha ? p.masha.toString() : '')
    setR(p.ratti ? p.ratti.toString() : '')
  }

  if (readOnly) {
    return (
      <>
        <div className="text-center font-mono font-bold text-sm px-2 py-1.5">{parts.tola}</div>
        <div className="text-center font-mono font-bold text-sm px-2 py-1.5 border-l border-border">{parts.masha}</div>
        <div className="text-center font-mono font-bold text-sm px-2 py-1.5 border-l border-border">{parts.ratti.toFixed(2)}</div>
        <div className="text-center font-mono font-black text-base px-2 py-1.5 text-primary border-l border-border">{formatGrams(mg, 4)}g</div>
      </>
    )
  }

  const cols = [
    { key: 'tola' as const, val: tStr, change: (v: string) => { setT(v); onTmr(v, mStr, rStr) } },
    { key: 'masha' as const, val: mStr, change: (v: string) => { setM(v); onTmr(tStr, v, rStr) } },
    { key: 'ratti' as const, val: rStr, change: (v: string) => { setR(v); onTmr(tStr, mStr, v) } },
  ]

  return (
    <>
      {cols.map((col, idx) => (
        <div key={col.key} className={cn('p-1 text-center', idx > 0 && 'border-l border-border')}>
          <input
            type="number"
            step="any"
            value={col.val}
            placeholder="0"
            onFocus={() => setActive(col.key)}
            onBlur={() => setActive(null)}
            onChange={(e) => col.change(e.target.value)}
            className="w-full text-center font-mono text-sm font-semibold bg-background border border-border/80 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      ))}
      <div className="p-1 text-center border-l border-border">
        <input
          type="number"
          step="any"
          value={gStr}
          placeholder="0.0000"
          onFocus={() => setActive('grams')}
          onBlur={() => setActive(null)}
          onChange={(e) => onGm(e.target.value)}
          className={cn(
            'w-full text-center font-mono text-sm font-bold bg-background border border-border/80 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-primary',
            highlightGrams ? 'text-primary border-primary/40 bg-primary/5' : 'text-foreground'
          )}
        />
      </div>
    </>
  )
}
