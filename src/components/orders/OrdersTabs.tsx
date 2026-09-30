import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CustomerOrdersTab } from '@/components/orders/CustomerOrdersTab'
import { CastingOrdersTab } from '@/components/orders/CastingOrdersTab'
import { WorkshopWorksTab } from '@/components/orders/WorkshopWorksTab'
import { GroupPurchiTab } from '@/components/orders/GroupPurchiTab'
import { useOrdersPage } from '@/hooks/useOrdersPage'

interface OrdersTabsProps {
  p: ReturnType<typeof useOrdersPage>
}

export const OrdersTabs: React.FC<OrdersTabsProps> = ({ p }) => {
  return (
    <Tabs
      value={p.mainTab}
      onValueChange={(v) => p.setMainTab(v as any)}
      className="w-full"
    >
      <TabsList className="bg-card border border-border p-1 rounded-lg">
        <TabsTrigger value="customer_orders" className="text-xs font-medium">
          Customer Orders ({p.orders.length})
        </TabsTrigger>
        <TabsTrigger value="casting_orders" className="text-xs font-medium">
          Casting Orders ({p.castingOrders.length})
        </TabsTrigger>
        <TabsTrigger value="works" className="text-xs font-medium">
          Karigar Job Works ({p.works.length})
        </TabsTrigger>
        <TabsTrigger value="group_purchi" className="text-xs font-medium">
          Group Purchi Batch
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customer_orders" className="pt-4">
        <CustomerOrdersTab
          viewMode={p.viewMode}
          filteredOrders={p.filteredOrders}
          orders={p.orders}
          updateOrderStatus={p.updateOrderStatus}
        />
      </TabsContent>

      <TabsContent value="casting_orders" className="pt-4">
        <CastingOrdersTab
          castingOrders={p.castingOrders}
          onReceive={(c) => {
            p.setReceivingCastOrder(c)
            p.setCastReturnedMg(c.expectedReturnMg)
          }}
        />
      </TabsContent>

      <TabsContent value="works" className="pt-4">
        <WorkshopWorksTab
          works={p.works}
          onMarkDone={(id) => p.updateWorkStatus(id, 'Completed')}
        />
      </TabsContent>

      <TabsContent value="group_purchi" className="pt-4">
        <GroupPurchiTab
          groupRows={p.groupRows}
          setGroupRows={p.setGroupRows}
          mandiRate24k={p.mandi.pkrPerTola24k}
        />
      </TabsContent>
    </Tabs>
  )
}
