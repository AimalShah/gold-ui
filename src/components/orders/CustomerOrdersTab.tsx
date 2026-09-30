import React from 'react'
import { CustomerOrder } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CustomerOrdersTabProps {
  viewMode: 'list' | 'kanban'
  filteredOrders: CustomerOrder[]
  orders: CustomerOrder[]
  updateOrderStatus: (id: string, status: any) => void
}

export const CustomerOrdersTab: React.FC<CustomerOrdersTabProps> = ({
  viewMode,
  filteredOrders,
  orders,
  updateOrderStatus,
}) => {
  const kanbanColumns = [
    { id: 'pending', label: 'Pending Queue', color: 'border-amber-400 bg-amber-500/10' },
    { id: 'in_workshop', label: 'In Workshop (Karigar)', color: 'border-blue-400 bg-blue-500/10' },
    { id: 'ready', label: 'Ready for Delivery', color: 'border-emerald-400 bg-emerald-500/10' },
    { id: 'delivered', label: 'Delivered', color: 'border-zinc-400 bg-muted/40' },
  ]

  if (viewMode === 'list') {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Item Description</th>
                <th className="px-6 py-4 text-right">Required Wt</th>
                <th className="px-6 py-4">Karat</th>
                <th className="px-6 py-4 text-right">Advance Cash</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Assigned Karigar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">#{o.orderNo}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-medium">{o.date}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{o.customerName}</td>
                  <td className="px-6 py-4 text-foreground truncate max-w-[200px]">{o.itemDescription}</td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    {formatGrams(o.weightRequiredMg)}g
                  </td>
                  <td className="px-6 py-4">
                    <KaratBadge karat={o.carat} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                    {formatMoney(o.advanceCashPkr)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-medium">{o.deliveryDate}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{o.karigarName || '—'}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        o.status === 'ready'
                          ? 'success'
                          : o.status === 'in_workshop'
                          ? 'processing'
                          : o.status === 'delivered'
                          ? 'secondary'
                          : 'warning'
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Select
                      value={o.status}
                      onValueChange={(val: any) => updateOrderStatus(o.id, val)}
                    >
                      <SelectTrigger className="h-8 w-28 text-xs ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_workshop">Workshop</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kanbanColumns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.id)
        return (
          <div key={col.id} className="flex flex-col rounded-lg border border-border bg-card shadow-xs overflow-hidden">
            <div className={`p-4 border-b border-border font-semibold text-sm flex items-center justify-between ${col.color}`}>
              <span>{col.label}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-background/80">
                {colOrders.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[350px]">
              {colOrders.map((o) => (
                <Card key={o.id} className="p-4 space-y-2 border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">#{o.orderNo}</span>
                    <span className="text-muted-foreground">{o.deliveryDate}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">{o.itemDescription}</h4>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{o.customerName}</span>
                    <span className="font-bold text-foreground">{formatGrams(o.weightRequiredMg)}g</span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{o.karigarName || 'Karigar Unassigned'}</span>
                    <KaratBadge karat={o.carat} size="sm" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
