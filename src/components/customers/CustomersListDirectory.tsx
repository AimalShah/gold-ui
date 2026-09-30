import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Customer } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface CustomersListDirectoryProps {
  customers: Customer[]
  selectedCustomerId: string | null
  onSelectCustomer: (id: string) => void
}

export const CustomersListDirectory: React.FC<CustomersListDirectoryProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
}) => {
  return (
    <div className="lg:col-span-4 rounded-lg border border-border bg-card overflow-hidden flex flex-col h-full shadow-xs">
      <div className="p-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
        <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
          Customer Directory ({customers.length})
        </span>
      </div>

      <div className="divide-y divide-border overflow-y-auto max-h-[600px]">
        {customers.map((c) => {
          const isSelected = selectedCustomerId === c.id
          const owesGold = c.goldBalanceMg > 0
          const owesCash = c.cashBalancePkr > 0

          return (
            <div
              key={c.id}
              onClick={() => onSelectCustomer(c.id)}
              className={`p-4 cursor-pointer transition-colors text-xs space-y-1.5 ${
                isSelected
                  ? 'bg-accent/60 border-l-4 border-primary text-foreground'
                  : 'hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground truncate max-w-[180px]">
                  {c.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {c.group}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.phone}</span>
                <span>{c.city}</span>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-border/60 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Gold:</span>
                  <span
                    className={
                      owesGold
                        ? 'text-destructive font-semibold'
                        : c.goldBalanceMg < 0
                        ? 'text-emerald-600 font-semibold'
                        : 'text-muted-foreground'
                    }
                  >
                    {formatGrams(c.goldBalanceMg)}g
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Cash:</span>
                  <span
                    className={
                      owesCash
                        ? 'text-destructive font-semibold'
                        : c.cashBalancePkr < 0
                        ? 'text-emerald-600 font-semibold'
                        : 'text-muted-foreground'
                    }
                  >
                    {formatMoney(c.cashBalancePkr)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
