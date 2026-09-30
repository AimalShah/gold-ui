import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Bill } from '@/lib/types'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { BillsFilterCard } from '@/components/bills/BillsFilterCard'
import { BillsTable } from '@/components/bills/BillsTable'
import { BillDetailSheet } from '@/components/bills/BillDetailSheet'

export const BillsPage: React.FC = () => {
  const { bills, deleteBill, setCurrentPage } = useApp()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewingBill, setViewingBill] = useState<Bill | null>(null)
  const [printBill, setPrintBill] = useState<Bill | null>(null)
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null)

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.billNo.includes(search) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.date.includes(search)

    if (!matchesSearch) return false
    if (typeFilter !== 'all' && b.type !== typeFilter) return false
    return true
  })

  const handleDelete = () => {
    if (!billToDelete) return
    deleteBill(billToDelete.id)
    toast.success(`Bill #${billToDelete.billNo} deleted. Reversed ledger entries.`)
    setBillToDelete(null)
    if (viewingBill?.id === billToDelete.id) {
      setViewingBill(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Header */}
      <PageTitle
        description="Comprehensive sales invoices archive, customer purchi records, and payment settlements."
        action={
          <Button
            size="lg"
            onClick={() => setCurrentPage('billing')}
            className="gap-2 font-medium"
          >
            <Plus className="size-4" /> Create POS Bill
          </Button>
        }
      >
        Bills & Sales Invoices
      </PageTitle>

      {/* 2. Filters */}
      <BillsFilterCard
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        totalCount={filteredBills.length}
      />

      {/* 3. Invoices Table */}
      <BillsTable
        bills={filteredBills}
        onView={setViewingBill}
        onPrint={setPrintBill}
        onDelete={setBillToDelete}
      />

      {/* 4. Detail Drawer Sheet */}
      <BillDetailSheet
        bill={viewingBill}
        onClose={() => setViewingBill(null)}
        onPrint={setPrintBill}
      />

      {/* 5. Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!billToDelete}
        onOpenChange={(open) => !open && setBillToDelete(null)}
        title={`Delete Bill #${billToDelete?.billNo}?`}
        description="Are you sure you want to permanently delete this bill? This will reverse the customer's cash and gold ledger balances, and restore stock."
        confirmText="Yes, Delete Bill"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* 6. Print Preview Dialog */}
      <PrintPreviewDialog
        open={!!printBill}
        onOpenChange={(open) => !open && setPrintBill(null)}
        bill={printBill}
      />
    </div>
  )
}

export default BillsPage
