import React from 'react'
import { useApp } from '@/context/AppContext'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DashboardMetricsCards } from '@/components/dashboard/DashboardMetricsCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable'

export const DashboardPage: React.FC = () => {
  const { bills, orders, setCurrentPage } = useApp()

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'in_workshop'
  ).length
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length
  const processingOrdersCount = orders.filter((o) => o.status === 'in_workshop').length

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-8">
      {/* 1. Header */}
      <PageTitle
        description="Comprehensive real-time overview of jewellery retail, sales volume, and workshop orders."
        action={
          <Button
            onClick={() => setCurrentPage('billing')}
            size="lg"
            className="gap-2 font-medium"
          >
            <Plus className="size-4" /> New POS Bill
          </Button>
        }
      >
        Dashboard Overview
      </PageTitle>

      {/* 2. Top Metric Cards */}
      <DashboardMetricsCards
        ordersCount={orders.length}
        billsCount={bills.length}
        pendingOrdersCount={pendingOrdersCount}
        processingOrdersCount={processingOrdersCount}
        completedOrdersCount={completedOrdersCount}
      />

      {/* 3. Analytics Charts */}
      <DashboardCharts />

      {/* 4. Recent Orders Table */}
      <RecentOrdersTable
        bills={bills}
        onViewAll={() => setCurrentPage('bills')}
      />
    </div>
  )
}

export default DashboardPage
