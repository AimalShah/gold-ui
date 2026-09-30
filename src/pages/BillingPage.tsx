import React from 'react'
import { useBillingForm } from '@/hooks/useBillingForm'
import { ScaleReader } from '@/components/pos/ScaleReader'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { BillingTopControls } from '@/components/billing/BillingTopControls'
import { ProductSpecCard } from '@/components/billing/ProductSpecCard'
import { CustomerSummaryCard } from '@/components/billing/CustomerSummaryCard'
import { InvoiceSettlementCard } from '@/components/billing/InvoiceSettlementCard'

export const BillingPage: React.FC = () => {
  const form = useBillingForm()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-3 md:p-5">
      <div className="w-[98vw] max-w-[98vw] mx-auto space-y-4">
        {/* Top Control Bar */}
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

        {/* 2-Column POS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Scale & Specifications */}
          <div className="lg:col-span-7 space-y-4">
            <ScaleReader
              onCaptureWeight={form.handleScaleCapture}
              currentWeighedWeightMg={form.weightMg}
            />

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

          {/* Right Column: Customer & Invoice Breakdown */}
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
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerSelectModal
        open={form.customerModalOpen}
        onOpenChange={form.setCustomerModalOpen}
        onSelectCustomer={form.handleSelectCustomer}
        onNewCustomer={() => {
          form.setCustomerModalOpen(false)
          form.setCurrentPage('customers')
        }}
      />
      <ConfirmDialog
        open={form.confirmClearOpen}
        onOpenChange={form.setConfirmClearOpen}
        title="Clear Current Transaction?"
        description="Are you sure you want to clear the weight, deductions, and payment details?"
        onConfirm={form.doClearForm}
        confirmText="Clear Form"
        variant="destructive"
      />
      <PrintPreviewDialog
        open={form.printPreviewOpen}
        onOpenChange={form.setPrintPreviewOpen}
        bill={form.lastSavedBill}
      />
    </div>
  )
}

export default BillingPage
