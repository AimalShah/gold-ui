import React from 'react'
import { Customer } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerSummaryCardProps {
  selectedCustomer: Customer | null
  setSelectedCustomer: (cust: Customer | null) => void
  customerSearchInput: string
  setCustomerSearchInput: (input: string) => void
  onOpenDirectory: () => void
}

export const CustomerSummaryCard: React.FC<CustomerSummaryCardProps> = ({
  selectedCustomer,
  setSelectedCustomer,
  customerSearchInput,
  setCustomerSearchInput,
  onOpenDirectory,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Customer</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenDirectory}
          className="h-7 px-2.5 text-xs font-semibold cursor-pointer border-border"
        >
          <Search className="size-3 mr-1" />
          <span>Directory</span>
        </Button>
      </div>

      {selectedCustomer ? (
        <div className="p-2.5 rounded-lg border border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {selectedCustomer.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-foreground truncate">{selectedCustomer.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{selectedCustomer.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded font-mono font-semibold',
                selectedCustomer.cashBalancePkr > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : selectedCustomer.cashBalancePkr < 0
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              )}
            >
              {selectedCustomer.cashBalancePkr === 0
                ? 'Zero Due'
                : selectedCustomer.cashBalancePkr > 0
                ? `Owes PKR ${selectedCustomer.cashBalancePkr.toLocaleString()}`
                : `Adv PKR ${Math.abs(selectedCustomer.cashBalancePkr).toLocaleString()}`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCustomer(null)
                setCustomerSearchInput('')
              }}
              className="size-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
              title="Clear Customer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Walk-in Customer (or type name/phone)"
            value={customerSearchInput}
            onChange={(e) => setCustomerSearchInput(e.target.value)}
            className="h-9 text-xs w-full bg-background"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCustomer(null)
              setCustomerSearchInput('Walk-in Customer')
            }}
            className="h-9 px-2.5 text-xs shrink-0 cursor-pointer font-medium"
          >
            Walk-in
          </Button>
        </div>
      )}
    </div>
  )
}
