import React from 'react'
import { CustomerFormSheet } from '@/components/customers/CustomerFormSheet'
import { CustomerTxDialog } from '@/components/customers/CustomerTxDialog'
import { useCustomersPage } from '@/hooks/useCustomersPage'

interface CustomersModalsProps {
  p: ReturnType<typeof useCustomersPage>
}

export const CustomersModals: React.FC<CustomersModalsProps> = ({ p }) => {
  return (
    <>
      <CustomerFormSheet
        open={p.customerSheetOpen}
        onOpenChange={p.setCustomerSheetOpen}
        editingCustomer={p.editingCustomer}
        formName={p.formName}
        setFormName={p.setFormName}
        formPhone={p.formPhone}
        setFormPhone={p.setFormPhone}
        formAltPhone={p.formAltPhone}
        setFormAltPhone={p.setFormAltPhone}
        formCity={p.formCity}
        setFormCity={p.setFormCity}
        formGroup={p.formGroup}
        setFormGroup={p.setFormGroup}
        formAddress={p.formAddress}
        setFormAddress={p.setFormAddress}
        formCreditLimitPkr={p.formCreditLimitPkr}
        setFormCreditLimitPkr={p.setFormCreditLimitPkr}
        formOpeningGoldMg={p.formOpeningGoldMg}
        setFormOpeningGoldMg={p.setFormOpeningGoldMg}
        formOpeningCashPkr={p.formOpeningCashPkr}
        setFormOpeningCashPkr={p.setFormOpeningCashPkr}
        formSmsAlerts={p.formSmsAlerts}
        setFormSmsAlerts={p.setFormSmsAlerts}
        onSubmit={p.handleSaveCustomer}
      />

      <CustomerTxDialog
        open={p.txDialogOpen}
        onOpenChange={p.setTxDialogOpen}
        selectedCustomer={p.selectedCustomer}
        txType={p.txType}
        txMedium={p.txMedium}
        setTxMedium={p.setTxMedium}
        txAmountPkr={p.txAmountPkr}
        setTxAmountPkr={p.setTxAmountPkr}
        txWeightMg={p.txWeightMg}
        setTxWeightMg={p.setTxWeightMg}
        txRef={p.txRef}
        setTxRef={p.setTxRef}
        txRemarks={p.txRemarks}
        setTxRemarks={p.setTxRemarks}
        onSave={p.handleSaveTx}
      />
    </>
  )
}
