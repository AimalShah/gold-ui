import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Bill } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { PrintPreviewDialog } from '@/components/shared/PrintPreviewDialog'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
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
  ScrollText,
  Search,
  Printer,
  Trash2,
  Eye,
  Plus,
  Receipt,
  CheckCircle2,
  Calendar,
  User,
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Action Toolbar */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Bills & Sales Purchi Register</h1>
          <Badge variant="secondary" className="text-xs font-mono ml-2">
            {bills.length} Records
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage('billing')}
            className="h-8 text-xs font-semibold gap-1.5"
          >
            <Receipt className="h-3.5 w-3.5 text-amber-600" />
            General Bill
            <HotkeyHint hotkey="Ctrl+F2" className="h-4 text-[9px]" />
          </Button>

          <Button
            size="sm"
            onClick={() => setCurrentPage('billing')}
            className="h-8 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            New Bill (Billing Main)
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b bg-card/30 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search bill #, customer name, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder="Bill Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sale">Gold Sales</SelectItem>
            <SelectItem value="purchase">Gold Purchase</SelectItem>
            <SelectItem value="general">General / Walk-in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table of Bills */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Bill #</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Metal / Karat</th>
              <th className="py-3 px-4 text-right">Net Weight</th>
              <th className="py-3 px-4 text-right">Rate / Tola</th>
              <th className="py-3 px-4 text-right">Total Price</th>
              <th className="py-3 px-4 text-right">Wasool (Paid)</th>
              <th className="py-3 px-4 text-right">Balance Due</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-xs text-muted-foreground">
                  No bills found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-muted/40 transition-colors group">
                  <td className="py-3 px-4 font-mono font-bold text-foreground">
                    #{b.billNo}
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{b.date}</td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    <div>{b.customerName}</div>
                    {b.customerId && <span className="text-[10px] text-muted-foreground font-mono">{b.customerId}</span>}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {b.metal} {b.carat}K
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-foreground">
                    {formatGrams(b.netWeightMg)}g
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-muted-foreground">
                    {b.goldRatePkr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-foreground">
                    {formatMoney(b.totalPricePkr)}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-semibold text-foreground">
                    {formatMoney(b.wasoolPkr)}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-semibold">
                    {b.balancePkr > 0 ? (
                      <span className="text-foreground">{formatMoney(b.balancePkr)}</span>
                    ) : (
                      <span className="text-muted-foreground text-[11px] font-sans">Settled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-[11px]">{b.user}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingBill(b)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPrintBill(b)}
                        className="h-7 w-7 p-0 text-amber-700 hover:text-amber-800"
                        title="Print slip"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setBillToDelete(b)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        title="Delete bill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Detail Sheet */}
      <Sheet open={!!viewingBill} onOpenChange={(open) => !open && setViewingBill(null)}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          {viewingBill && (
            <>
              <SheetHeader className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-base font-bold text-amber-900 dark:text-amber-300">
                    Bill Details — #{viewingBill.billNo}
                  </SheetTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {viewingBill.date}
                  </Badge>
                </div>
                <SheetDescription className="text-xs">
                  Full transaction audit log, line items and dual ledger records.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-4 text-xs font-mono">
                <div className="p-3 bg-muted/40 rounded border space-y-1 font-sans">
                  <div className="text-[11px] text-muted-foreground">Billed Customer:</div>
                  <div className="text-sm font-bold text-foreground">{viewingBill.customerName}</div>
                  {viewingBill.customerId && <div className="text-xs text-muted-foreground font-mono">ID: {viewingBill.customerId}</div>}
                </div>

                {/* Items */}
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase text-muted-foreground font-sans">Line Items</div>
                  <div className="border rounded divide-y">
                    {viewingBill.items.map((it, idx) => (
                      <div key={idx} className="p-2.5 space-y-1 text-xs">
                        <div className="font-semibold text-foreground font-sans">{it.description}</div>
                        <div className="flex justify-between text-muted-foreground text-[11px]">
                          <span>Gross: {formatGrams(it.weightMg)}g</span>
                          <span>Cut: −{formatGrams(it.cutTotalMg)}g</span>
                          <span>Polish: −{formatGrams(it.polishTotalMg)}g</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1 border-t border-border/40">
                          <span>Net: {formatGrams(it.totalWeightMg)}g</span>
                          <span>Rs {it.totalPricePkr.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Total Net Weight:</span>
                    <span className="font-bold">{formatGrams(viewingBill.netWeightMg, 4)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Applied Rate:</span>
                    <span>Rs {viewingBill.goldRatePkr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Carat Purity:</span>
                    <span>{viewingBill.carat}K</span>
                  </div>
                  {viewingBill.chargesPkr > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Labour / Charges:</span>
                      <span>Rs {viewingBill.chargesPkr.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t pt-1.5 text-foreground">
                    <span className="font-sans">Grand Total:</span>
                    <span>{formatMoney(viewingBill.totalPricePkr)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="font-sans">Wasool Received:</span>
                    <span>{formatMoney(viewingBill.wasoolPkr)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span className="font-sans">Balance Due:</span>
                    <span>{formatMoney(viewingBill.balancePkr)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-sans">
                  Operator: <strong>{viewingBill.user}</strong>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setPrintBill(viewingBill)
                      setViewingBill(null)
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    Print Invoice (P)
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
