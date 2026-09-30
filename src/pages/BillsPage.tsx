import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { BillsFilterCard } from '@/components/bills/BillsFilterCard'
import { BillsTable } from '@/components/bills/BillsTable'
import { BillDetailSheet } from '@/components/bills/BillDetailSheet'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { useBillsPage } from '@/hooks/useBillsPage'

export const BillsPage: React.FC = () => {
  const p = useBillsPage()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <PageTitle
        description="Comprehensive sales invoices archive, customer purchi records, and payment settlements."
        action={
          <Button
            size="lg"
            onClick={() => p.setCurrentPage('billing')}
            className="gap-2 font-medium"
          >
            <Plus className="size-4" /> Create POS Bill
          </Button>
        }
      >
        Bills & Sales Invoices
      </PageTitle>

      <BillsFilterCard
        search={p.search}
        setSearch={p.setSearch}
        typeFilter={p.typeFilter}
        setTypeFilter={p.setTypeFilter}
        totalCount={p.filteredBills.length}
      />

      <BillsTable
        bills={p.filteredBills}
        onView={p.setViewingBill}
        onPrint={p.setPrintBill}
        onDelete={p.setBillToDelete}
      />

      <BillDetailSheet
        bill={p.viewingBill}
        onClose={() => p.setViewingBill(null)}
        onPrint={p.setPrintBill}
      />

      <ConfirmDialog
        open={!!p.billToDelete}
        onOpenChange={(open) => !open && p.setBillToDelete(null)}
        title={`Delete Bill #${p.billToDelete?.billNo}?`}
        description="Are you sure you want to permanently delete this bill? This will reverse the customer's cash and gold ledger balances, and restore stock."
        confirmText="Yes, Delete Bill"
        variant="destructive"
        onConfirm={p.handleDelete}
      />

      <PrintPreviewDialog
        open={!!p.printBill}
        onOpenChange={(open) => !open && p.setPrintBill(null)}
        bill={p.printBill}
      />
    </div>
  )
}

export default BillsPage
