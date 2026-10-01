import React from 'react'
import { useBillingForm } from '@/hooks/useBillingForm'
import { ScaleReader } from '@/components/pos/ScaleReader'
import { BillingTopControls } from '@/components/billing/BillingTopControls'
import { ProductSpecCard } from '@/components/billing/ProductSpecCard'
import { CustomerSummaryCard } from '@/components/billing/CustomerSummaryCard'
import { InvoiceSettlementCard } from '@/components/billing/InvoiceSettlementCard'
import { BillingModals } from '@/components/billing/BillingModals'

export const BillingPage: React.FC = () => {
  const form = useBillingForm()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-3 md:p-5">
      <div className="w-[98vw] max-w-[98vw] mx-auto space-y-4">
        <BillingTopControls
          billType={form.billType}
          onBillTypeChange={form.setBillType}
          onReset={() => {
            if (form.weightMg > 0 || form.amountReceivedPkr > 0) {
              form.setConfirmClearOpen(true)
            } else {
              form.doClearForm()
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-12 space-y-4">

            <ProductSpecCard
              productName={form.productName}
              setProductName={form.setProductName}
              carat={form.carat}
              setCarat={form.setCarat}
              weightMg={form.weightMg}
              setWeightMg={form.setWeightMg}
              goldRatePkr={form.goldRatePkr}
              setGoldRatePkr={form.setGoldRatePkr}
              defaultRate={form.defaultRate}
              unitMode={form.unitMode}
              gramsPerTola={form.gramsPerTola}
              stoneDeductionMg={form.stoneDeductionMg}
              setStoneDeductionMg={form.setStoneDeductionMg}
              polishDeductionMg={form.polishDeductionMg}
              setPolishDeductionMg={form.setPolishDeductionMg}
              netWeightMg={form.netWeightMg}
              chargesMode={form.chargesMode}
              setChargesMode={form.setChargesMode}
              chargesPkr={form.chargesPkr}
              setChargesPkr={form.setChargesPkr}
            />
          </div>
{/*
          <div className="lg:col-span-5 space-y-4">
            <CustomerSummaryCard
              selectedCustomer={form.selectedCustomer}
              setSelectedCustomer={form.setSelectedCustomer}
              customerSearchInput={form.customerSearchInput}
              setCustomerSearchInput={form.setCustomerSearchInput}
              onOpenDirectory={() => form.setCustomerModalOpen(true)}
            />

            <InvoiceSettlementCard
              billType={form.billType}
              goldValuePkr={form.goldValuePkr}
              totalAmountPkr={form.totalAmountPkr}
              amountReceivedPkr={form.amountReceivedPkr}
              setAmountReceivedPkr={form.setAmountReceivedPkr}
              balanceDuePkr={form.balanceDuePkr}
              onSave={form.handleSaveBill}
              onPrint={form.handlePrintCurrent}
            />
          </div>*/}
        </div>
      </div>

      <BillingModals form={form} />
    </div>
  )
}

export default BillingPage
