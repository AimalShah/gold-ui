import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  totalAmountPkr: number
  amountReceivedPkr: number
  setAmountReceivedPkr: (v: number) => void
  balanceDuePkr: number
}

const CASH_CHIPS = [5000, 10000, 50000, 100000]

export const ValuationWasoolRow: React.FC<Props> = ({
  totalAmountPkr, amountReceivedPkr, setAmountReceivedPkr, balanceDuePkr,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-card divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
      {/* 1: WASOOL */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-black text-foreground uppercase tracking-wide">WASOOL</span>
          <button
            type="button"
            onClick={() => setAmountReceivedPkr(totalAmountPkr)}
            className="text-[11px] font-black px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-primary border border-border cursor-pointer"
            title="Set exact 100% wasool"
          >
            EXACT
          </button>
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 max-w-[200px]">
          <input
            type="number"
            value={amountReceivedPkr || ''}
            onChange={(e) => setAmountReceivedPkr(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full text-right text-xl font-mono font-bold bg-background border-2 border-border rounded px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 2: BAQAYA */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-2 bg-muted/20">
        <span className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">
          BAQAYA
        </span>
        <div className="text-right font-mono font-black text-xl sm:text-2xl min-w-0">
          {balanceDuePkr === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400">CHUKTI (NIL)</span>
          ) : balanceDuePkr > 0 ? (
            <span className="text-rose-600 dark:text-rose-400">
              Rs {Math.round(balanceDuePkr).toLocaleString()}
            </span>
          ) : (
            <span className="text-sky-600 dark:text-sky-400">
              Return: Rs {Math.abs(Math.round(balanceDuePkr)).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 3: QUICK CASH CHIPS */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-1.5">
        <span className="text-xs font-bold text-muted-foreground uppercase shrink-0">QUICK:</span>
        <div className="flex items-center gap-1 flex-wrap justify-end min-w-0">
          {CASH_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setAmountReceivedPkr((amountReceivedPkr || 0) + chip)}
              className="px-2.5 py-1.5 rounded border-2 border-border bg-background hover:bg-muted font-mono font-bold text-xs cursor-pointer transition-colors"
            >
              +{chip >= 1000 ? `${chip / 1000}k` : chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
