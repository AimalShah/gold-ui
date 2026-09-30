import React from 'react'
import { NewCustomerOrderModal } from '@/components/orders/NewCustomerOrderModal'
import { IssueCastingModal } from '@/components/orders/IssueCastingModal'
import { ReceiveCastingModal } from '@/components/orders/ReceiveCastingModal'
import { useOrdersPage } from '@/hooks/useOrdersPage'

interface OrdersModalsProps {
  p: ReturnType<typeof useOrdersPage>
}

export const OrdersModals: React.FC<OrdersModalsProps> = ({ p }) => {
  return (
    <>
      <NewCustomerOrderModal
        open={p.customerOrderOpen}
        onOpenChange={p.setCustomerOrderOpen}
        customers={p.customers}
        karigars={p.karigars}
        mandiRate24k={p.mandi.pkrPerTola24k}
        orderCustomer={p.orderCustomer}
        setOrderCustomer={p.setOrderCustomer}
        orderItemDesc={p.orderItemDesc}
        setOrderItemDesc={p.setOrderItemDesc}
        orderWeightMg={p.orderWeightMg}
        setOrderWeightMg={p.setOrderWeightMg}
        orderCarat={p.orderCarat}
        setOrderCarat={p.setOrderCarat}
        orderMakingCharges={p.orderMakingCharges}
        setOrderMakingCharges={p.setOrderMakingCharges}
        orderAdvanceCashPkr={p.orderAdvanceCashPkr}
        setOrderAdvanceCashPkr={p.setOrderAdvanceCashPkr}
        orderDeliveryDate={p.orderDeliveryDate}
        setOrderDeliveryDate={p.setOrderDeliveryDate}
        orderKarigar={p.orderKarigar}
        setOrderKarigar={p.setOrderKarigar}
        orderPriority={p.orderPriority}
        setOrderPriority={p.setOrderPriority}
        orderRateLocked={p.orderRateLocked}
        setOrderRateLocked={p.setOrderRateLocked}
        onSubmit={p.handleCreateCustomerOrder}
      />

      <IssueCastingModal
        open={p.castingOpen}
        onOpenChange={p.setCastingOpen}
        karigars={p.karigars}
        castKarigarId={p.castKarigarId}
        setCastKarigarId={p.setCastKarigarId}
        castIssuedMg={p.castIssuedMg}
        setCastIssuedMg={p.setCastIssuedMg}
        castCarat={p.castCarat}
        setCastCarat={p.setCastCarat}
        castWastagePercent={p.castWastagePercent}
        setCastWastagePercent={p.setCastWastagePercent}
        castPurpose={p.castPurpose}
        setCastPurpose={p.setCastPurpose}
        onIssue={p.handleCreateCastingOrder}
      />

      <ReceiveCastingModal
        receivingCastOrder={p.receivingCastOrder}
        onClose={() => p.setReceivingCastOrder(null)}
        castReturnedMg={p.castReturnedMg}
        setCastReturnedMg={p.setCastReturnedMg}
        onSave={p.handleSaveReceiveCasting}
      />
    </>
  )
}
