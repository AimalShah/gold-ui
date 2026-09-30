import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Flame, Plus } from 'lucide-react'
import { useOrdersPage } from '@/hooks/useOrdersPage'
import { OrdersSummaryCards } from '@/components/orders/OrdersSummaryCards'
import { OrdersFilterBar } from '@/components/orders/OrdersFilterBar'
import { OrdersTabs } from '@/components/orders/OrdersTabs'
import { OrdersModals } from '@/components/orders/OrdersModals'

export const OrdersPage: React.FC = () => {
  const p = useOrdersPage()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <PageTitle
        description="Custom order tracking, Karigar casting assignments, and workshop stages."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => p.setCastingOpen(true)}
              className="gap-2"
            >
              <Flame className="size-4" /> Issue Casting
            </Button>
            <Button
              size="lg"
              onClick={() => p.setCustomerOrderOpen(true)}
              className="gap-2 font-medium"
            >
              <Plus className="size-4" /> New Custom Order
            </Button>
          </div>
        }
      >
        Custom Orders & Workshop
      </PageTitle>

      <OrdersSummaryCards orders={p.orders} />

      <OrdersFilterBar
        search={p.search}
        setSearch={p.setSearch}
        statusFilter={p.statusFilter}
        setStatusFilter={p.setStatusFilter}
        viewMode={p.viewMode}
        setViewMode={p.setViewMode}
      />

      <OrdersTabs p={p} />
      <OrdersModals p={p} />
    </div>
  )
}

export default OrdersPage
