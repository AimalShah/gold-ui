import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HiOutlineSquare3Stack3D, HiCalendarDays } from 'react-icons/hi2'
import { HiOutlineShoppingCart, HiOutlineRefresh, HiOutlineCheck } from 'react-icons/hi'
import { BsTruck } from 'react-icons/bs'

interface DashboardMetricsCardsProps {
  ordersCount: number
  billsCount: number
  pendingOrdersCount: number
  processingOrdersCount: number
  completedOrdersCount: number
}

export const DashboardMetricsCards: React.FC<DashboardMetricsCardsProps> = ({
  ordersCount,
  billsCount,
  pendingOrdersCount,
  processingOrdersCount,
  completedOrdersCount,
}) => {
  const salesCards = [
    {
      icon: <HiOutlineSquare3Stack3D className="size-7" />,
      title: "Today's Orders",
      value: "Rs 3,850,000",
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D className="size-7" />,
      title: "Yesterday's Orders",
      value: "Rs 3,400,000",
      className: "bg-amber-500",
    },
    {
      icon: <HiOutlineRefresh className="size-7" />,
      title: "This Month Sales",
      value: "Rs 28,450,000",
      className: "bg-blue-600",
    },
    {
      icon: <HiCalendarDays className="size-7" />,
      title: "Gold Stock (Tolas)",
      value: "228.2 Tola",
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays className="size-7" />,
      title: "All-Time Sales",
      value: "Rs 64,820,000",
      className: "bg-emerald-600",
    },
  ]

  const statusCards = [
    {
      icon: <HiOutlineShoppingCart className="size-5" />,
      title: "Total Orders",
      value: `${ordersCount + billsCount}`,
      className: "text-orange-600 bg-orange-100 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      icon: <HiOutlineRefresh className="size-5" />,
      title: "Orders Pending",
      value: `${pendingOrdersCount}`,
      className: "text-teal-600 bg-teal-100 dark:bg-teal-950 dark:text-teal-300",
    },
    {
      icon: <BsTruck className="size-5" />,
      title: "Orders Processing",
      value: `${processingOrdersCount}`,
      className: "text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      icon: <HiOutlineCheck className="size-5" />,
      title: "Orders Delivered",
      value: `${completedOrdersCount || 12}`,
      className: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300",
    },
  ]

  return (
    <div className="space-y-4">
      {/* 5 colorful revenue & stock cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {salesCards.map((card, index) => (
          <div
            key={`sales-card-${index}`}
            className={`p-6 rounded-lg flex flex-col items-center justify-center space-y-2 text-white text-center shadow-xs transition-transform hover:-translate-y-0.5 ${card.className}`}
          >
            <div className="[&>svg]:size-7">{card.icon}</div>
            <p className="text-sm font-medium opacity-90">{card.title}</p>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 4 status overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <Card key={`status-card-${index}`} className="border-border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`size-12 rounded-full grid place-items-center shrink-0 ${card.className}`}>
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground font-medium">{card.title}</span>
                <span className="text-2xl font-bold text-foreground tracking-tight">{card.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
