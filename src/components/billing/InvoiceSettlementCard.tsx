import React from 'react'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { Button } from '@/components/ui/button'
import { Receipt, Check, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InvoiceSettlementCardProps {
  billType: 'sale' | 'purchase'
  goldValuePkr: number
  totalAmountPkr: number
  amountReceivedPkr: number
  setAmountReceivedPkr: (amt: number) => void
  balanceDuePkr: number
  onSave: () => void
  onPrint: () => void
}

export const InvoiceSettlementCard: React.FC<InvoiceSettlementCardProps> = ({
  billType,
  goldValuePkr,
  totalAmountPkr,
  amountReceivedPkr,
  setAmountReceivedPkr,
  balanceDuePkr,
  onSave,
  onPrint,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Invoice & Settlement</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {billType === 'sale' ? 'Sale Invoice' : 'Purchase Voucher'}
        </span>
      </div>

      {/* Clean Financial Breakdown */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Gold Metal Value</span>
          <span className="font-mono text-foreground font-semibold">
            PKR {Math.round(goldValuePkr).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Making & Crafting</span>
          <span className="font-mono text-foreground font-semibold">
            PKR {Math.round(totalAmountPkr - goldValuePkr).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Total Invoice Amount Hero Box */}
      <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/25 flex items-baseline justify-between">
        <div>
          <span className="text-sm font-bold text-foreground block">
            Total Amount Due
          </span>
          <span className="text-xs text-muted-foreground">
            Inclusive of gold & making
          </span>
        </div>
        <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono tracking-tight">
          PKR {Math.round(totalAmountPkr).toLocaleString()}
        </span>
      </div>

      {/* Cash Received Input */}
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Cash Received (PKR)
          </label>
          <button
            type="button"
            onClick={() => setAmountReceivedPkr(totalAmountPkr)}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
          >
            Exact (100%)
          </button>
        </div>

        <MoneyInput
          value={amountReceivedPkr}
          onChange={(pkr) => setAmountReceivedPkr(pkr)}
        />

        {/* Quick Cash Chips */}
        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
          {[5000, 10000, 50000, 100000].map((add) => (
            <button
              key={add}
              type="button"
              onClick={() => setAmountReceivedPkr((amountReceivedPkr || 0) + add)}
              className="text-xs px-2.5 py-1 rounded border border-border bg-muted/40 hover:bg-muted font-medium text-foreground transition-colors cursor-pointer"
            >
              +{add >= 1000 ? `${add / 1000}k` : add}
            </button>
          ))}
        </div>

        {/* Balance Due / Change */}
        <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between mt-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            {balanceDuePkr > 0
              ? 'Remaining Balance Due:'
              : balanceDuePkr < 0
              ? 'Change Due to Customer:'
              : 'Settlement Status:'}
          </span>
          <span
            className={cn(
              'text-sm font-bold font-mono',
              balanceDuePkr > 0
                ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                : balanceDuePkr < 0
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-emerald-600 dark:text-emerald-400 font-bold'
            )}
          >
            {balanceDuePkr === 0
              ? 'Fully Settled'
              : `PKR ${Math.abs(Math.round(balanceDuePkr)).toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          className="h-10 px-4 text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer flex-1"
        >
          <Check className="size-4 mr-1.5" />
          <span>Save Transaction</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-10 px-3.5 text-xs sm:text-sm font-semibold border-border text-foreground hover:bg-muted cursor-pointer shrink-0"
        >
          <Printer className="size-4 mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  )
}
