import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Receipt, Users, Coins, Flame, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { ReportsHeaderAndFilter } from '@/components/reports/ReportsHeaderAndFilter'
import { ReportsSidebarNav, ReportMeta } from '@/components/reports/ReportsSidebarNav'
import { ReportsDataView } from '@/components/reports/ReportsDataView'

export const ReportsPage: React.FC = () => {
  const { bills, customers, rawStock, inventoryItems, mandi } = useApp()

  const reportsList: ReportMeta[] = [
    { id: 'sales', title: 'Sales & Invoices Register', description: 'Comprehensive listing of gold sales and receipts', icon: Receipt },
    { id: 'balances', title: 'Customer Balances & Debtors', description: 'Outstanding gold weight (g) and cash balances (PKR)', icon: Users },
    { id: 'stock', title: 'Gold Bullion & Inventory Stock', description: 'Physical 24K pure gold, raw lots, and finished items', icon: Coins },
    { id: 'tehleel', title: 'Assay / Tehleel Testing History', description: 'Cupellation and karat test records with purities', icon: Flame },
    { id: 'zakat', title: 'Zakat Calculation Summary', description: '2.5% Shariah assessment on total inventory value', icon: Sparkles },
  ]

  const [selectedReportId, setSelectedReportId] = useState('sales')
  const [dateFrom, setDateFrom] = useState('2026-09-01')
  const [dateTo, setDateTo] = useState('2026-09-30')

  const handlePrint = () => {
    toast.success("Sending official audit report to printer...")
  }

  const handleExportExcel = () => {
    toast.success("Exported report table to CSV / Excel.")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Header & Filters */}
      <ReportsHeaderAndFilter
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
      />

      {/* 2. Split Layout: Sidebar & Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        <ReportsSidebarNav
          reportsList={reportsList}
          selectedReportId={selectedReportId}
          onSelectReport={setSelectedReportId}
        />

        <ReportsDataView
          selectedReportId={selectedReportId}
          bills={bills}
          customers={customers}
          rawStock={rawStock}
          inventoryItems={inventoryItems}
          mandi={mandi}
        />
      </div>
    </div>
  )
}

export default ReportsPage
