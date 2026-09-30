import React from 'react'
import { CastingOrder } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CastingOrdersTabProps {
  castingOrders: CastingOrder[]
  onReceive: (c: CastingOrder) => void
}

export const CastingOrdersTab: React.FC<CastingOrdersTabProps> = ({
  castingOrders,
  onReceive,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Cast #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Karigar / Caster</th>
              <th className="px-6 py-4">Metal</th>
              <th className="px-6 py-4 text-right">Issued Wt</th>
              <th className="px-6 py-4 text-right">Expected Return</th>
              <th className="px-6 py-4 text-right">Returned Wt</th>
              <th className="px-6 py-4 text-right">Wastage %</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {castingOrders.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">#{c.orderNo}</td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{c.date}</td>
                <td className="px-6 py-4 font-medium text-foreground">{c.karigarName}</td>
                <td className="px-6 py-4 uppercase font-semibold">{c.metal} {c.carat}K</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(c.issuedWeightMg)}g</td>
                <td className="px-6 py-4 text-right text-muted-foreground">{formatGrams(c.expectedReturnMg)}g</td>
                <td className="px-6 py-4 text-right font-bold text-primary">
                  {c.returnedWeightMg ? `${formatGrams(c.returnedWeightMg)}g` : '—'}
                </td>
                <td className="px-6 py-4 text-right font-medium">{c.wastageAllowedPercent}%</td>
                <td className="px-6 py-4">
                  <Badge variant={c.status === 'received' ? 'success' : 'processing'}>
                    {c.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {c.status === 'issued' ? (
                    <Button
                      size="sm"
                      onClick={() => onReceive(c)}
                      className="font-medium text-xs"
                    >
                      Receive
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Reconciled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
