import React from 'react'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { formatGrams, formatTMR } from '@/lib/gold-math'

interface ActiveItem {
  description: string
  carat: number
  grossWeightMg: number
  deductionsMg: number
  netWeightMg: number
}

interface CustomerDisplayItemCardProps {
  activeItem?: ActiveItem | null
  scaleWeightMg: number
  gramsPerTola: number
}

export const CustomerDisplayItemCard: React.FC<CustomerDisplayItemCardProps> = ({
  activeItem,
  scaleWeightMg,
  gramsPerTola,
}) => {
  const gross = activeItem?.grossWeightMg || scaleWeightMg
  const deductions = activeItem?.deductionsMg || 0
  const net = activeItem?.netWeightMg || scaleWeightMg

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Current Item On Counter
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">
            {activeItem?.description || 'Gold Jewellery Item'}
          </h2>
        </div>
        <KaratBadge karat={activeItem?.carat || 22} size="md" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Gross Weight</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block">
            {formatGrams(gross, 3)}g
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            {formatTMR(gross, gramsPerTola)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Deductions (Nag/Kat)</span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
            - {formatGrams(deductions, 3)}g
          </span>
          <span className="text-[10px] text-stone-500">Stones / Polish</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block">Net Pure Gold</span>
          <span className="text-lg font-bold font-mono text-emerald-300 mt-1 block">
            {formatGrams(net, 3)}g
          </span>
          <span className="text-[10px] text-emerald-400/70 font-mono">
            {formatTMR(net, gramsPerTola)}
          </span>
        </div>
      </div>
    </div>
  )
}
