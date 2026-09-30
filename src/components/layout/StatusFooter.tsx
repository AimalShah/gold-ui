import React from 'react'
import { useApp } from '@/context/AppContext'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Activity, Database, ShieldCheck } from 'lucide-react'

export const StatusFooter: React.FC = () => {
  const { mandi, settings, setMandiDialogOpen } = useApp()

  return (
    <footer className="h-7 border-t border-stone-800 bg-stone-950 text-stone-400 dark:bg-black dark:border-stone-800 px-3 flex items-center justify-between text-[11px] select-none shrink-0 z-20">
      {/* Left: Mandi Live Market Strip */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMandiDialogOpen(true)}
          className="flex items-center gap-2 hover:text-stone-200 transition-colors cursor-pointer"
          title="Click to view/refresh Mandi Rates (F11)"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-bold text-amber-400 tracking-wider">MANDI:</span>
          <span>Gold: <strong className="text-stone-200">${mandi.goldUsdOz.toFixed(2)}/oz</strong></span>
          <span className="text-stone-700">·</span>
          <span>USD: <strong className="text-stone-200">{mandi.usdPkr.toFixed(2)} PKR</strong></span>
          <span className="text-stone-700">·</span>
          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/40 tracking-tight">
            24K: PKR {mandi.pkrPerTola24k.toLocaleString()}/tola
          </span>
          <span className="text-stone-700">·</span>
          <span>Silver: <strong className="text-stone-200">Rs {mandi.pkrPerTolaSilver.toLocaleString()}/tola</strong></span>
          <kbd className="pointer-events-none inline-flex h-4 items-center rounded border border-stone-700 bg-stone-900 px-1 text-[9px] text-amber-300/80">
            F11
          </kbd>
        </button>
      </div>

      {/* Right: Units, Backup status, App version */}
      <div className="flex items-center gap-3 text-zinc-500 text-[10px]">
        <div className="flex items-center gap-1">
          <span>1 Tola =</span>
          <strong className="text-zinc-300 font-mono">{settings.gramsPerTola} g</strong>
        </div>
        <span className="text-zinc-800">·</span>
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3 text-zinc-400" />
          <span>Backup: <strong className="text-zinc-300">05:00 PM</strong></span>
        </div>
        <span className="text-zinc-800">·</span>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-zinc-400" />
          <span className="text-zinc-400 font-medium">Gold King Pro v2.4</span>
        </div>
      </div>
    </footer>
  )
}
