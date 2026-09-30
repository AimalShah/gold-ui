import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Bill } from '@/lib/types'
import { toast } from 'sonner'

export function useBillsPage() {
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

  return {
    setCurrentPage,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    viewingBill,
    setViewingBill,
    printBill,
    setPrintBill,
    billToDelete,
    setBillToDelete,
    filteredBills,
    handleDelete,
  }
}
