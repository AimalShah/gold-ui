import React from 'react'
import { Card } from '@/components/ui/card'
import { CustomerOrder } from '@/lib/types'
import { Clock, Hammer, Sparkles, CheckCircle } from 'lucide-react'

interface OrdersSummaryCardsProps {
  orders: CustomerOrder[]
}

export const OrdersSummaryCards: React.FC<OrdersSummaryCardsProps> = ({ orders }) => {
  const inWorkshopCount = orders.filter((o) => o.status === 'in_workshop').length
  const readyCount = orders.filter((o) => o.status === 'ready').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length || 8

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Total Orders</span>
          <Clock className="size-5 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{orders.length} Custom Jobs</p>
        <span className="text-xs text-muted-foreground">Active in System</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">In Workshop</span>
          <Hammer className="size-5 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-blue-600 mt-2">{inWorkshopCount} In Progress</p>
        <span className="text-xs text-muted-foreground">Being crafted by Karigars</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Ready for Delivery</span>
          <Sparkles className="size-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-amber-600 mt-2">{readyCount} Ready</p>
        <span className="text-xs text-muted-foreground">Awaiting Customer Pickup</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Completed</span>
          <CheckCircle className="size-5 text-emerald-600" />
        </div>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{deliveredCount} Delivered</p>
        <span className="text-xs text-muted-foreground">Settled & Handed Over</span>
      </Card>
    </div>
  )
}
