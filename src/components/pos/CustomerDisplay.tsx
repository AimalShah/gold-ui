import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CustomerDisplayState } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { Badge } from '@/components/ui/badge'
import {
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Receipt,
  Store,
  Clock,
  CheckCircle2,
  ExternalLink,
  Minimize2,
  Maximize2,
  X,
} from 'lucide-react'

interface CustomerDisplayProps {
  isPiP?: boolean
  onClose?: () => void
}

export const CustomerDisplay: React.FC<CustomerDisplayProps> = ({
  isPiP = false,
  onClose,
}) => {
  const { customerDisplayState, settings, mandi } = useApp()
  const [displayState, setDisplayState] = useState<CustomerDisplayState>(customerDisplayState)
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString())

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Listen to cross-window BroadcastChannel and localStorage for instant sync
  useEffect(() => {
    setDisplayState(customerDisplayState)

    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('islam_jewellers_cfd')
      channel.onmessage = (event) => {
        if (event.data) {
          setDisplayState(event.data)
        }
      }
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'islam_jewellers_cfd_state' && e.newValue) {
        try {
          setDisplayState(JSON.parse(e.newValue))
        } catch (err) {}
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      channel?.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [customerDisplayState])

  return (
    <div className={`flex flex-col bg-stone-950 text-white font-sans select-none overflow-hidden ${isPiP ? 'h-full w-full' : 'min-h-screen w-screen'}`}>
      {/* Top Header Bar */}
      <header className="h-16 px-6 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Store className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase font-serif">
                {settings.shopName || 'ISLAM JEWELLERS'}
              </h1>
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30 font-sans">
                Sarafa Hallmarked
              </Badge>
            </div>
            <p className="text-xs text-stone-400 font-sans">
              Trusted Pure Gold & Custom Handcrafted Jewellery
            </p>
          </div>
        </div>

        {/* Center Live Rates Pill */}
        <div className="hidden md:flex items-center gap-4 bg-stone-950/80 px-4 py-1.5 rounded-full border border-stone-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-400 font-sans text-[11px] uppercase">Today's Mandi:</span>
            <span className="text-amber-300 font-bold">24K Rs {mandi.pkrPerTola24k.toLocaleString()}/Tola</span>
          </div>
          <span className="text-stone-700">|</span>
          <div className="text-stone-300">
            22K Rs {(mandi.pkrPerTola22k || Math.round(mandi.pkrPerTola24k * (22 / 24))).toLocaleString()}
          </div>
        </div>

        {/* Right Status & Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400 bg-stone-950 px-3 py-1 rounded-lg border border-stone-800">
            <Clock className="size-3.5 text-emerald-400" />
            <span>{currentTime}</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Customer Display"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Display Body (Two High-Impact Columns) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LIVE SCALE & AUTHENTICITY (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* 1. VERIFIED DIGITAL SCALE READOUT */}
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

            {/* Huge Weight Readout */}
            <div className="my-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-6xl sm:text-7xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.35)] tabular-nums">
                  {formatGrams(displayState.scaleWeightMg, 3)}
                </span>
                <span className="text-3xl font-black text-emerald-500 font-sans">
                  Grams
                </span>
              </div>
              
              {/* Tola-Masha-Ratti conversion display */}
              <div className="mt-2 text-lg font-mono font-bold text-emerald-200/80 bg-stone-950/70 inline-block px-4 py-1.5 rounded-lg border border-stone-800">
                {formatTMR(displayState.scaleWeightMg, gramsPerTola)}
              </div>
            </div>

            {/* Purity & Transparency Guarantee Banner */}
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

          {/* 2. SARAFA MANDI RATES DISPLAY BOARD */}
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

          {/* 3. Urdu Welcome & Ethical Sarafa Creed */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center space-y-1">
            <p className="text-base font-medium text-amber-200/90 font-serif leading-relaxed">
              خوش آمدید! آپ کے اعتماد کا شکریہ۔ ہمارے ہاں ہر زیور کا صافی وزن اور مکمل کھرا پن کمپیوٹرائزڈ سلپ پر فراہم کیا جاتا ہے۔
            </p>
            <p className="text-[11px] text-amber-300/70 font-sans">
              "Honesty in weights and measures is our tradition and legacy."
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE ITEM & TOTAL SETTLEMENT (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Active Item Under Weighing */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Current Item On Counter
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {displayState.activeItem?.description || 'Gold Jewellery Item'}
                </h2>
              </div>
              <KaratBadge karat={displayState.activeItem?.carat || 22} size="md" />
            </div>

            {/* Weights Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Gross Weight</span>
                <span className="text-lg font-bold font-mono text-white mt-1 block">
                  {formatGrams(displayState.activeItem?.grossWeightMg || displayState.scaleWeightMg, 3)}g
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  {formatTMR(displayState.activeItem?.grossWeightMg || displayState.scaleWeightMg, gramsPerTola)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Deductions (Nag/Kat)</span>
                <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                  - {formatGrams(displayState.activeItem?.deductionsMg || 0, 3)}g
                </span>
                <span className="text-[10px] text-stone-500">Stones / Polish</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Net Pure Gold</span>
                <span className="text-lg font-bold font-mono text-emerald-300 mt-1 block">
                  {formatGrams(displayState.activeItem?.netWeightMg || displayState.scaleWeightMg, 3)}g
                </span>
                <span className="text-[10px] text-emerald-400/70 font-mono">
                  {formatTMR(displayState.activeItem?.netWeightMg || displayState.scaleWeightMg, gramsPerTola)}
                </span>
              </div>
            </div>
          </div>

          {/* GRAND INVOICE SETTLEMENT CARD */}
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-stone-900/90 p-6 space-y-6 flex-1 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Total Invoice Settlement
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  Customer: <strong className="text-white">{displayState.customerName}</strong>
                </span>
              </div>

              {/* Big Grand Total Box */}
              <div className="my-6 p-6 rounded-2xl bg-emerald-600 text-white shadow-xl space-y-1">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-emerald-100">
                  <span>TOTAL NET AMOUNT PAYABLE</span>
                  <span className="font-mono">
                    Net: {formatGrams(displayState.totalNetMg || displayState.scaleWeightMg, 3)}g
                  </span>
                </div>
                <div className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums font-mono">
                  {formatMoney(displayState.totalAmountPkr)}
                </div>
              </div>

              {/* Cash Paid and Balance Due details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-xs font-medium text-stone-400 uppercase block">Cash Paid (Wasool)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                    {formatMoney(displayState.wasoolPkr)}
                  </span>
                </div>

                <div className={`p-4 rounded-xl border ${displayState.balancePkr < 0 ? 'bg-amber-950/40 border-amber-500/40' : displayState.balancePkr > 0 ? 'bg-destructive/15 border-destructive/40' : 'bg-stone-950 border-stone-800'}`}>
                  <span className="text-xs font-medium text-stone-400 uppercase block">
                    {displayState.balancePkr < 0 ? 'Change Return (Baqaya)' : displayState.balancePkr > 0 ? 'Remaining Balance Due' : 'Status: Fully Paid'}
                  </span>
                  <span className={`text-2xl font-bold font-mono mt-1 block ${displayState.balancePkr < 0 ? 'text-amber-300' : displayState.balancePkr > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {displayState.balancePkr < 0 ? formatMoney(Math.abs(displayState.balancePkr)) : formatMoney(displayState.balancePkr)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Guarantee */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
              <span>Official Computerized Memo</span>
              <span className="font-mono text-emerald-400">Islam Jewellers POS • Terminal 01</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
