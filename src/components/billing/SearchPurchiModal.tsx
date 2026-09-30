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
import { Bill } from '@/lib/types'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Search, ScrollText, Eye, Printer } from 'lucide-react'

interface SearchPurchiModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectBill: (bill: Bill) => void
  onPrintBill?: (bill: Bill) => void
}

export const SearchPurchiModal: React.FC<SearchPurchiModalProps> = ({
  open,
  onOpenChange,
  onSelectBill,
  onPrintBill,
}) => {
  const { bills } = useApp()
  const [search, setSearch] = useState('')

  const filtered = bills.filter(
    (b) =>
      b.billNo.includes(search) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.date.includes(search)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <ScrollText className="h-5 w-5 text-amber-600" />
            Search Purchi / Previous Bills (S)
          </DialogTitle>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Bill No (e.g. 10081), Customer Name, or Date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs font-mono"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
              <tr>
                <th className="py-2 px-3">Bill #</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3 text-right">Net Weight</th>
                <th className="py-2 px-3 text-right">Rate</th>
                <th className="py-2 px-3 text-right">Total Price</th>
                <th className="py-2 px-3 text-right">Wasool</th>
                <th className="py-2 px-3 text-right">Balance</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                    No matching purchi or bills found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => {
                      onSelectBill(b)
                      onOpenChange(false)
                    }}
                    className="hover:bg-amber-500/10 cursor-pointer transition-colors group"
                  >
                    <td className="py-2 px-3 font-mono font-bold text-amber-800 dark:text-amber-400">
                      #{b.billNo}
                    </td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{b.date}</td>
                    <td className="py-2 px-3 font-medium text-foreground">{b.customerName}</td>
                    <td className="py-2 px-3 font-mono text-right font-semibold">
                      {formatGrams(b.netWeightMg)}g
                    </td>
                    <td className="py-2 px-3 font-mono text-right text-muted-foreground">
                      {b.goldRatePkr.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 font-mono text-right font-bold text-foreground">
                      {formatMoney(b.totalPricePkr)}
                    </td>
                    <td className="py-2 px-3 font-mono text-right text-emerald-700 dark:text-emerald-400">
                      {formatMoney(b.wasoolPkr)}
                    </td>
                    <td className="py-2 px-3 font-mono text-right font-semibold text-red-600">
                      {formatMoney(b.balancePkr)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground group-hover:text-amber-700"
                        title="Open Bill"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter className="pt-2 border-t flex justify-between sm:justify-between items-center text-xs text-muted-foreground">
          <span>Found <strong>{filtered.length}</strong> records</span>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
