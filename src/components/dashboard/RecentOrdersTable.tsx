import React from 'react'
import { Bill } from '@/lib/types'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface RecentOrdersTableProps {
  bills: Bill[]
  onViewAll: () => void
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  bills,
  onViewAll,
}) => {
  return (
    <div className="space-y-4">
      <PageTitle
        description="Recent client transactions, invoices, and custom Karigar orders."
        action={
          <Button variant="outline" onClick={onViewAll} size="sm">
            View All Invoices
          </Button>
        }
      >
        Recent Orders
      </PageTitle>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Invoice / Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Net Weight</th>
                <th className="px-6 py-4">Amount (PKR)</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bills.slice(0, 5).map((bill) => (
                <tr key={bill.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {bill.billNo}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {bill.customerName}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {bill.items.map((i) => i.description).join(', ')}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {formatGrams(bill.netWeightMg)}g
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {formatMoney(bill.totalPricePkr)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs uppercase font-medium text-muted-foreground">
                      {bill.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Delivered</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onViewAll}
                      className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="size-3.5" /> Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
