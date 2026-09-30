import React from 'react'
import { StockMovement } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { Badge } from '@/components/ui/badge'

interface InventoryMovementsTabProps {
  movements: StockMovement[]
}

export const InventoryMovementsTab: React.FC<InventoryMovementsTabProps> = ({ movements }) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Item / Bullion Lot</th>
              <th className="px-6 py-4 text-right">Weight In</th>
              <th className="px-6 py-4 text-right">Weight Out</th>
              <th className="px-6 py-4 text-right font-bold">Balance</th>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Operator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {movements.map((m) => (
              <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 text-muted-foreground">{m.date}</td>
                <td className="px-6 py-4">
                  <Badge variant={m.type === 'Purchase' ? 'success' : 'processing'}>
                    {m.type}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">{m.itemOrLot}</td>
                <td className="px-6 py-4 text-right font-semibold text-emerald-600">{m.weightInMg ? `${formatGrams(m.weightInMg)}g` : '—'}</td>
                <td className="px-6 py-4 text-right font-semibold text-red-600">{m.weightOutMg ? `${formatGrams(m.weightOutMg)}g` : '—'}</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(m.balanceMg)}g</td>
                <td className="px-6 py-4 font-mono text-xs text-primary">{m.ref}</td>
                <td className="px-6 py-4 text-muted-foreground">{m.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
