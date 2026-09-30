import React from 'react'
import { cn } from '@/lib/utils'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface LedgerBadgeProps {
  goldBalanceMg: number
  cashBalancePkr: number
  className?: string
  showLabels?: boolean
}

export const LedgerBadge: React.FC<LedgerBadgeProps> = ({
  goldBalanceMg,
  cashBalancePkr,
  className,
  showLabels = true,
}) => {
  const goldOwedToShop = goldBalanceMg > 0
  const cashOwedToShop = cashBalancePkr > 0

  return (
    <TooltipProvider>
      <div className={cn("inline-flex items-center gap-1.5 text-xs font-mono tabular-nums", className)}>
        {/* Gold Balance */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "px-2 py-0.5 rounded font-medium border cursor-help",
                goldBalanceMg === 0 && "bg-muted text-muted-foreground border-border",
                goldOwedToShop && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50",
                !goldOwedToShop && goldBalanceMg !== 0 && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
              )}
            >
              {showLabels && <span className="text-[10px] uppercase font-sans mr-1 text-muted-foreground">Au:</span>}
              {formatGrams(goldBalanceMg, 3)}g
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-sans font-medium text-xs">
              {goldOwedToShop ? 'Customer Owes Gold:' : goldBalanceMg < 0 ? 'Shop Owes Gold:' : 'Gold Account Settled'}
            </p>
            <p className="font-mono text-xs">{formatTMR(goldBalanceMg)} ({formatGrams(goldBalanceMg, 4)} g)</p>
          </TooltipContent>
        </Tooltip>

        {/* Cash Balance */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "px-2 py-0.5 rounded font-medium border cursor-help",
                cashBalancePkr === 0 && "bg-muted text-muted-foreground border-border",
                cashOwedToShop && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50",
                !cashOwedToShop && cashBalancePkr !== 0 && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
              )}
            >
              {showLabels && <span className="text-[10px] uppercase font-sans mr-1 text-muted-foreground">Rs:</span>}
              {formatMoney(cashBalancePkr)}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-sans font-medium text-xs">
              {cashOwedToShop ? 'Customer Owes Cash (Debit)' : cashBalancePkr < 0 ? 'Advance Cash Held (Credit)' : 'Cash Account Settled'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
