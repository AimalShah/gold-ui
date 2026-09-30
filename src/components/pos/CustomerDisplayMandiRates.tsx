import React from 'react'
import { MandiRate } from '@/lib/types'
import { TrendingUp } from 'lucide-react'

interface CustomerDisplayMandiRatesProps {
  mandi: MandiRate
}

export const CustomerDisplayMandiRates: React.FC<CustomerDisplayMandiRatesProps> = ({ mandi }) => {
  return (
    <>
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Today's Sarafa Association Benchmark Rates
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">Updated: Today</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">24K Gold</div>
            <div className="text-sm font-bold text-amber-400 mt-1 font-mono">
              Rs {mandi.pkrPerTola24k.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">/ Tola</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">22K Gold (916)</div>
            <div className="text-sm font-bold text-amber-300 mt-1 font-mono">
              Rs {(mandi.pkrPerTola22k || Math.round(mandi.pkrPerTola24k * (22 / 24))).toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">/ Tola</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">21K Gold</div>
            <div className="text-sm font-bold text-amber-200 mt-1 font-mono">
              Rs {Math.round(mandi.pkrPerTola24k * (21 / 24)).toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">/ Tola</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
            <div className="text-[11px] text-stone-400 uppercase font-semibold">Silver (Chandi)</div>
            <div className="text-sm font-bold text-stone-200 mt-1 font-mono">
              Rs {mandi.pkrPerTolaSilver.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">/ Tola</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center space-y-1">
        <p className="text-base font-medium text-amber-200/90 font-serif leading-relaxed">
          خوش آمدید! آپ کے اعتماد کا شکریہ۔ ہمارے ہاں ہر زیور کا صافی وزن اور مکمل کھرا پن کمپیوٹرائزڈ سلپ پر فراہم کیا جاتا ہے۔
        </p>
        <p className="text-[11px] text-amber-300/70 font-sans">
          "Honesty in weights and measures is our tradition and legacy."
        </p>
      </div>
    </>
  )
}
