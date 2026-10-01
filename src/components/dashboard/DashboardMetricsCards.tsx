import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Layers,
  Clock,
  TrendingUp,
  Coins,
  BarChart3,
  ShoppingBag,
  RotateCcw,
  Truck,
  CheckCircle2,
} from 'lucide-react'

interface Props {
  ordersCount: number
  billsCount: number
  pendingOrdersCount: number
  processingOrdersCount: number
  completedOrdersCount: number
}

export const DashboardMetricsCards: React.FC<Props> = ({
  ordersCount,
  billsCount,
  pendingOrdersCount,
  processingOrdersCount,
  completedOrdersCount,
}) => {
  const salesCards = [
    { icon: <Layers className="size-4 text-primary" strokeWidth={1.75} />, title: "Today's Orders", value: "Rs 3,850,000" },
    { icon: <Clock className="size-4 text-muted-foreground" strokeWidth={1.75} />, title: "Yesterday's Orders", value: "Rs 3,400,000" },
    { icon: <TrendingUp className="size-4 text-primary" strokeWidth={1.75} />, title: "This Month Sales", value: "Rs 28,450,000" },
    { icon: <Coins className="size-4 text-primary" strokeWidth={1.75} />, title: "Gold Stock (Tolas)", value: "228.2 Tola" },
    { icon: <BarChart3 className="size-4 text-muted-foreground" strokeWidth={1.75} />, title: "All-Time Turnover", value: "Rs 64,820,000" },
  ]

  const statusCards = [
    { icon: <ShoppingBag className="size-4 text-primary" strokeWidth={1.75} />, title: "Total Orders", value: `${ordersCount + billsCount}` },
    { icon: <RotateCcw className="size-4 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />, title: "Orders Pending", value: `${pendingOrdersCount}` },
    { icon: <Truck className="size-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />, title: "Orders Processing", value: `${processingOrdersCount}` },
    { icon: <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />, title: "Orders Delivered", value: `${completedOrdersCount || 12}` },
  ]

  return (
    <div className="space-y-3">
      {/* 5 Executive Treasury & Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {salesCards.map((card, idx) => (
          <div
            key={`sales-${idx}`}
            className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
              <div className="p-1 rounded-md bg-muted/60">{card.icon}</div>
            </div>
            <div className="text-lg font-bold font-mono text-foreground tracking-tight">{card.value}</div>
          </div>
        ))}
      </div>

      {/* 4 Operations Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {statusCards.map((card, idx) => (
          <Card key={`status-${idx}`} className="border-border/80 shadow-2xs">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="size-9 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground font-medium">{card.title}</span>
                <span className="text-lg font-bold font-mono text-foreground tracking-tight">{card.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
