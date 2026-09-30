import React from 'react'
import { Bill } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Printer, Trash2 } from 'lucide-react'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface BillsTableProps {
  bills: Bill[]
  onView: (b: Bill) => void
  onPrint: (b: Bill) => void
  onDelete: (b: Bill) => void
}

export const BillsTable: React.FC<BillsTableProps> = ({
  bills,
  onView,
  onPrint,
  onDelete,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Purity</th>
              <th className="px-6 py-4 text-right">Net Weight</th>
              <th className="px-6 py-4 text-right">Rate / Tola</th>
              <th className="px-6 py-4 text-right">Total Price</th>
              <th className="px-6 py-4 text-right">Paid (Wasool)</th>
              <th className="px-6 py-4 text-right">Balance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bills.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-sm text-muted-foreground">
                  No bills found matching your filter criteria.
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    #{b.billNo}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                    {b.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {b.customerName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-xs uppercase">
                      {b.metal} {b.carat}K
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    {formatGrams(b.netWeightMg)}g
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    Rs {b.goldRatePkr.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground">
                    {formatMoney(b.totalPricePkr)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    {formatMoney(b.wasoolPkr)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {b.balancePkr > 0 ? (
                      <span className="text-destructive font-bold">{formatMoney(b.balancePkr)}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Settled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={b.balancePkr === 0 ? "success" : "warning"}>
                      {b.balancePkr === 0 ? "Paid" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView(b)}
                        className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="View Details"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onPrint(b)}
                        className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                        title="Print Invoice"
                      >
                        <Printer className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(b)}
                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Invoice"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
