import React from 'react'
import { formatGrams, formatTMR } from '@/lib/gold-math'
import { Scale, CheckCircle2, ShieldCheck } from 'lucide-react'

interface CustomerDisplayScaleCardProps {
  scaleWeightMg: number
  gramsPerTola: number
}

export const CustomerDisplayScaleCard: React.FC<CustomerDisplayScaleCardProps> = ({
  scaleWeightMg,
  gramsPerTola,
}) => {
  return (
    <div className="rounded-2xl border-2 border-emerald-500/40 bg-stone-900/90 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="size-3.5" />
          VERIFIED LIVE SCALE
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-semibold font-sans">
          <Scale className="size-4 text-emerald-400" />
          Electronic Precision Gold Scale
        </div>
        <p className="text-[11px] text-stone-500">Direct reading from digital counter pan</p>
      </div>

      <div className="my-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-6xl sm:text-7xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.35)] tabular-nums">
            {formatGrams(scaleWeightMg, 3)}
          </span>
          <span className="text-3xl font-black text-emerald-500 font-sans">
            Grams
          </span>
        </div>

        <div className="mt-2 text-lg font-mono font-bold text-emerald-200/80 bg-stone-950/70 inline-block px-4 py-1.5 rounded-lg border border-stone-800">
          {formatTMR(scaleWeightMg, gramsPerTola)}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-amber-400" />
          100% Purity Hallmarking Assured
        </span>
        <span className="font-mono text-[11px] text-stone-500">
          Precision: ±0.001g (1 mg)
        </span>
      </div>
    </div>
  )
}
