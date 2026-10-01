import React from 'react'

interface Props {
  goldRatePkr: number
  setGoldRatePkr: (v: number) => void
  goldValuePkr: number
  carat: number
  setCarat: (v: number) => void
}

const KARATS = [
  { value: 24, label: '24K', purity: '1000' },
  { value: 22, label: '22K', purity: '916' },
  { value: 21, label: '21K', purity: '875' },
  { value: 18, label: '18K', purity: '750' },
]

export const ValuationRateRow: React.FC<Props> = ({
  goldRatePkr, setGoldRatePkr, goldValuePkr, carat, setCarat,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-card divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
      {/* 1: GOLD RATE */}
      <div className="md:col-span-4 p-3 flex items-center justify-between gap-2">
        <label className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">
          GOLD RATE
        </label>
        <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
          <input
            type="number"
            value={goldRatePkr || ''}
            onChange={(e) => setGoldRatePkr(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full text-right text-xl font-mono font-bold bg-background border-2 border-border rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 2: GOLD PRICE */}
      <div className="md:col-span-4 p-3 flex items-center justify-between gap-2 bg-muted/20">
        <span className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">
          GOLD PRICE
        </span>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-mono font-black text-foreground tracking-tight">
            Rs {Math.round(goldValuePkr).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 3: CARAT */}
      <div className="md:col-span-4 p-3 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">
          CARAT
        </span>
        <select
          value={carat}
          onChange={(e) => setCarat(Number(e.target.value))}
          className="h-10 text-base font-black font-mono bg-background border-2 border-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground"
        >
          {KARATS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label} ({k.purity})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
