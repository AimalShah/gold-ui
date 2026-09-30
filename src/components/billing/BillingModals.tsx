import React from 'react'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { useBillingForm } from '@/hooks/useBillingForm'

interface BillingModalsProps {
  form: ReturnType<typeof useBillingForm>
}

export const BillingModals: React.FC<BillingModalsProps> = ({ form }) => {
  return (
    <>
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
    </>
  )
}
