import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Store, Clock, X } from 'lucide-react'
import { MandiRate } from '@/lib/types'

interface CustomerDisplayHeaderProps {
  shopName: string
  mandi: MandiRate
  currentTime: string
  onClose?: () => void
}

export const CustomerDisplayHeader: React.FC<CustomerDisplayHeaderProps> = ({
  shopName,
  mandi,
  currentTime,
  onClose,
}) => {
  return (
    <header className="h-16 px-6 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Store className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white uppercase font-serif">
              {shopName || 'ISLAM JEWELLERS'}
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
  )
}
