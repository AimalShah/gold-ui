import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Bill } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Search,
  Printer,
  Trash2,
  Eye,
  Plus,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'

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
      {/* 1. Page Header */}
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

      {/* 2. Action Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Exporting bills register as CSV...")}
              className="gap-2 text-xs"
            >
              <Download className="size-3.5" /> Export Invoices CSV
            </Button>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Total {filteredBills.length} Invoices Found
          </span>
        </div>
      </Card>

      {/* 3. Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:basis-[50%]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bill #, customer name, date..."
              className="h-11 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-11 md:basis-[30%]">
              <SelectValue placeholder="All Transaction Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transaction Types</SelectItem>
              <SelectItem value="sale">Gold Sales</SelectItem>
              <SelectItem value="purchase">Gold Purchases</SelectItem>
              <SelectItem value="general">General / Walk-in</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full md:basis-[20%]"
            onClick={() => {
              setSearch('')
              setTypeFilter('all')
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* 4. Table of Invoices */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Purity</th>
                <th className="px-6 py-4 text-right">Net Weight</th>
                <th className="px-6 py-4 text-right">Rate / Tola</th>
                <th className="px-6 py-4 text-right">Total Price</th>
                <th className="px-6 py-4 text-right">Paid (Wasool)</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-sm text-muted-foreground">
                    No bills found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      #{b.billNo}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                      {b.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {b.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs uppercase">
                        {b.metal} {b.carat}K
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      {formatGrams(b.netWeightMg)}g
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      Rs {b.goldRatePkr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      {formatMoney(b.totalPricePkr)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {formatMoney(b.wasoolPkr)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {b.balancePkr > 0 ? (
                        <span className="text-destructive font-bold">{formatMoney(b.balancePkr)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Settled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={b.balancePkr === 0 ? "success" : "warning"}>
                        {b.balancePkr === 0 ? "Paid" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setViewingBill(b)}
                          className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setPrintBill(b)}
                          className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                          title="Print Invoice"
                        >
                          <Printer className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setBillToDelete(b)}
                          className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete Invoice"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Detail Sheet */}
      <Sheet open={!!viewingBill} onOpenChange={(open) => !open && setViewingBill(null)}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          {viewingBill && (
            <>
              <SheetHeader className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-lg font-bold text-foreground">
                    Bill Details #{viewingBill.billNo}
                  </SheetTitle>
                  <Badge variant="outline" className="text-xs">
                    {viewingBill.date}
                  </Badge>
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  Full transaction audit log, line items, and dual ledger records.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-4 text-sm">
                <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-1">
                  <span className="text-xs text-muted-foreground">Customer Name:</span>
                  <div className="text-base font-bold text-foreground">{viewingBill.customerName}</div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Line Items</span>
                  <div className="border border-border rounded-lg divide-y divide-border">
                    {viewingBill.items.map((it, idx) => (
                      <div key={idx} className="p-3 space-y-1 text-xs">
                        <div className="font-semibold text-foreground">{it.description}</div>
                        <div className="flex justify-between text-muted-foreground text-xs">
                          <span>Gross: {formatGrams(it.weightMg)}g</span>
                          <span>Cut: −{formatGrams(it.cutTotalMg)}g</span>
                          <span>Polish: −{formatGrams(it.polishTotalMg)}g</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-border">
                          <span>Net: {formatGrams(it.totalWeightMg)}g</span>
                          <span>Rs {it.totalPricePkr.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Net Weight:</span>
                    <span className="font-semibold text-foreground">{formatGrams(viewingBill.netWeightMg, 4)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gold Rate / Tola:</span>
                    <span className="font-semibold">Rs {viewingBill.goldRatePkr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carat Purity:</span>
                    <span className="font-semibold">{viewingBill.carat}K</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2 text-foreground">
                    <span>Grand Total:</span>
                    <span>{formatMoney(viewingBill.totalPricePkr)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Paid (Wasool):</span>
                    <span>{formatMoney(viewingBill.wasoolPkr)}</span>
                  </div>
                  <div className="flex justify-between text-destructive font-bold">
                    <span>Balance Due:</span>
                    <span>{formatMoney(viewingBill.balancePkr)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setPrintBill(viewingBill)
                      setViewingBill(null)
                    }}
                    className="w-full gap-2 font-semibold"
                  >
                    <Printer className="size-4" />
                    Print Tax Invoice
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!billToDelete}
        onOpenChange={(open) => !open && setBillToDelete(null)}
        title={`Delete Bill #${billToDelete?.billNo}?`}
        description="Are you sure you want to permanently delete this bill? This will reverse the customer's cash and gold ledger balances, and restore stock."
        confirmText="Yes, Delete Bill"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Print Preview */}
      <PrintPreviewDialog
        open={!!printBill}
        onOpenChange={(open) => !open && setPrintBill(null)}
        bill={printBill}
      />
    </div>
  )
}
export default BillsPage
