import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Customer } from '@/lib/types'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Search, UserPlus, Users, Check, ShieldAlert } from 'lucide-react'

interface CustomerSelectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectCustomer: (cust: Customer) => void
  onNewCustomer: () => void
}

export const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  open,
  onOpenChange,
  onSelectCustomer,
  onNewCustomer,
}) => {
  const { customers } = useApp()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Users className="h-5 w-5 text-amber-600" />
            Customer Selection & Accounts Ledger (I)
          </DialogTitle>
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onNewCustomer()
            }}
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1 h-7"
          >
            <UserPlus className="h-3.5 w-3.5" />
            New Customer
          </Button>
        </DialogHeader>

        {/* Search input */}
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by customer name, phone, city or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
            autoFocus
          />
        </div>

        {/* Results table */}
        <div className="flex-1 overflow-y-auto border rounded-md divide-y divide-border/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching customers found. Click "+ New Customer" above to create one.
            </div>
          ) : (
            filtered.map((c) => {
              const owesGold = c.goldBalanceMg > 0
              const owesCash = c.cashBalancePkr > 0

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCustomer(c)
                    onOpenChange(false)
                  }}
                  className="p-2.5 flex items-center justify-between hover:bg-amber-500/10 cursor-pointer transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300">
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                        {c.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {c.group}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.phone} • {c.city} • {c.address}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs space-y-0.5">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[10px] font-sans text-muted-foreground uppercase">Gold:</span>
                      <span className={owesGold ? "text-red-600 font-bold" : c.goldBalanceMg < 0 ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                        {formatGrams(c.goldBalanceMg)}g
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[10px] font-sans text-muted-foreground uppercase">Cash:</span>
                      <span className={owesCash ? "text-red-600 font-bold" : c.cashBalancePkr < 0 ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                        {formatMoney(c.cashBalancePkr)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <DialogFooter className="pt-2 text-xs text-muted-foreground flex justify-between sm:justify-between items-center">
          <span>Total registered: <strong>{customers.length}</strong></span>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
