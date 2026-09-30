import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Filter, Printer, Download } from 'lucide-react'

interface ReportsHeaderAndFilterProps {
  dateFrom: string
  setDateFrom: (d: string) => void
  dateTo: string
  setDateTo: (d: string) => void
  onExportExcel: () => void
  onPrint: () => void
}

export const ReportsHeaderAndFilter: React.FC<ReportsHeaderAndFilterProps> = ({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onExportExcel,
  onPrint,
}) => {
  return (
    <>
      <PageTitle
        description="Comprehensive audit ledgers, sales statistics, stock valuations, and Zakat calculations."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg" onClick={onExportExcel} className="gap-2">
              <Download className="size-4" /> Export CSV
            </Button>
            <Button size="lg" onClick={onPrint} className="gap-2 font-medium">
              <Printer className="size-4" /> Print Report
            </Button>
          </div>
        }
      >
        Financial & Audit Reports
      </PageTitle>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="font-medium text-foreground">From:</span>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-36 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">To:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-36 text-xs"
              />
            </div>
          </div>
          <Button size="sm" variant="secondary" className="gap-1.5 font-medium text-xs">
            <Filter className="size-3.5" /> Apply Date Range
          </Button>
        </div>
      </Card>
    </>
  )
}
