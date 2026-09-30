import React from 'react'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Receipt } from 'lucide-react'

interface CustomerDisplaySettlementCardProps {
  customerName: string
  totalNetMg: number
  scaleWeightMg: number
  totalAmountPkr: number
  wasoolPkr: number
  balancePkr: number
}

export const CustomerDisplaySettlementCard: React.FC<CustomerDisplaySettlementCardProps> = ({
  customerName,
  totalNetMg,
  scaleWeightMg,
  totalAmountPkr,
  wasoolPkr,
  balancePkr,
}) => {
  return (
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
            Customer: <strong className="text-white">{customerName}</strong>
          </span>
        </div>

        {/* Big Grand Total Box */}
        <div className="my-6 p-6 rounded-2xl bg-emerald-600 text-white shadow-xl space-y-1">
          <div className="flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-emerald-100">
            <span>TOTAL NET AMOUNT PAYABLE</span>
            <span className="font-mono">
              Net: {formatGrams(totalNetMg || scaleWeightMg, 3)}g
            </span>
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums font-mono">
            {formatMoney(totalAmountPkr)}
          </div>
        </div>

        {/* Cash Paid and Balance Due details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-xs font-medium text-stone-400 uppercase block">Cash Paid (Wasool)</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {formatMoney(wasoolPkr)}
            </span>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              balancePkr < 0
                ? 'bg-amber-950/40 border-amber-500/40'
                : balancePkr > 0
                ? 'bg-destructive/15 border-destructive/40'
                : 'bg-stone-950 border-stone-800'
            }`}
          >
            <span className="text-xs font-medium text-stone-400 uppercase block">
              {balancePkr < 0
                ? 'Change Return (Baqaya)'
                : balancePkr > 0
                ? 'Remaining Balance Due'
                : 'Status: Fully Paid'}
            </span>
            <span
              className={`text-2xl font-bold font-mono mt-1 block ${
                balancePkr < 0 ? 'text-amber-300' : balancePkr > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {balancePkr < 0 ? formatMoney(Math.abs(balancePkr)) : formatMoney(balancePkr)}
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
  )
}
