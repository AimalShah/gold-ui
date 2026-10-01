import React from 'react'
import { ChargesMode } from '@/lib/gold-math'
import { cn } from '@/lib/utils'

interface Props {
  chargesMode: ChargesMode
  setChargesMode: (m: ChargesMode) => void
  chargesPkr: number
  setChargesPkr: (v: number) => void
  totalAmountPkr: number
  productName: string
  setProductName: (v: string) => void
}

const PRESETS = ['Necklace Set', 'Bangles / Kangan', 'Gold Ring', 'Chain / Mala', 'Earrings / Tops', 'Kara / Bracelet']

export const ValuationChargesRow: React.FC<Props> = ({
  chargesMode, setChargesMode, chargesPkr, setChargesPkr, totalAmountPkr, productName, setProductName,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-card divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
      {/* 1: CHARGES /F */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-black text-foreground uppercase tracking-wide">CHARGES</span>
          <button
            type="button"
            onClick={() => setChargesMode(chargesMode === 'per_tola' ? 'fix' : 'per_tola')}
            className={cn('px-2 py-0.5 rounded text-xs font-black border transition-colors cursor-pointer',
              chargesMode === 'per_tola' ? 'bg-muted text-foreground border-border' : 'bg-primary text-primary-foreground border-primary'
            )}
            title="Toggle /Tola or Fixed (/F)"
          >{chargesMode === 'per_tola' ? '/TOLA' : '/FIX'}</button>
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 max-w-[200px]">
          <input
            type="number"
            value={chargesPkr || ''}
            onChange={(e) => setChargesPkr(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full text-right text-xl font-mono font-bold bg-background border-2 border-border rounded px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 2: TOTAL PRICE */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-2 bg-emerald-500/10">
        <span className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">TOTAL PRICE</span>
        <div className="text-right min-w-0">
          <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            Rs {Math.round(totalAmountPkr).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 3: DETAIL */}
      <div className="min-w-0 md:col-span-4 p-4 sm:p-5 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-foreground uppercase tracking-wide shrink-0">DETAIL</span>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <select
            value={PRESETS.includes(productName) ? productName : 'custom'}
            onChange={(e) => setProductName(e.target.value === 'custom' ? '' : e.target.value)}
            className="h-11 w-24 sm:w-28 text-xs font-bold bg-background border-2 border-border rounded px-1.5 text-foreground cursor-pointer shrink-0"
          >
            <option value="">Preset...</option>
            {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
            <option value="custom">Custom</option>
          </select>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Item details..."
            className="h-11 min-w-0 flex-1 text-xs sm:text-sm font-semibold bg-background border-2 border-border rounded px-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  )
}
