import React from 'react'
import { Bill } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Printer } from 'lucide-react'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface BillDetailSheetProps {
  bill: Bill | null
  onClose: () => void
  onPrint: (b: Bill) => void
}

export const BillDetailSheet: React.FC<BillDetailSheetProps> = ({
  bill,
  onClose,
  onPrint,
}) => {
  return (
    <Sheet open={!!bill} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
        {bill && (
          <>
            <SheetHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-lg font-bold text-foreground">
                  Bill Details #{bill.billNo}
                </SheetTitle>
                <Badge variant="outline" className="text-xs">
                  {bill.date}
                </Badge>
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                Full transaction audit log, line items, and dual ledger records.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-1">
                <span className="text-xs text-muted-foreground">Customer Name:</span>
                <div className="text-base font-bold text-foreground">{bill.customerName}</div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Line Items</span>
                <div className="border border-border rounded-lg divide-y divide-border">
                  {bill.items.map((it, idx) => (
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
                  <span className="font-semibold text-foreground">{formatGrams(bill.netWeightMg, 4)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gold Rate / Tola:</span>
                  <span className="font-semibold">Rs {bill.goldRatePkr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carat Purity:</span>
                  <span className="font-semibold">{bill.carat}K</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-2 text-foreground">
                  <span>Grand Total:</span>
                  <span>{formatMoney(bill.totalPricePkr)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Paid (Wasool):</span>
                  <span>{formatMoney(bill.wasoolPkr)}</span>
                </div>
                <div className="flex justify-between text-destructive font-bold">
                  <span>Balance Due:</span>
                  <span>{formatMoney(bill.balancePkr)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    onPrint(bill)
                    onClose()
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
  )
}
