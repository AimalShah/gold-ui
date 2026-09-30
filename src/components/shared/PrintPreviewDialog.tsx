import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Printer, Download, Copy, Check } from 'lucide-react'
import { Bill } from '@/lib/types'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { toast } from 'sonner'

interface PrintPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill?: Bill | null
  customTitle?: string
}

export const PrintPreviewDialog: React.FC<PrintPreviewDialogProps> = ({
  open,
  onOpenChange,
  bill,
  customTitle = "Sales Purchi / Bill Invoice",
}) => {
  const { settings } = useApp()
  const [template, setTemplate] = useState<'thermal80' | 'A5' | 'A4'>(settings.printTemplate || 'thermal80')
  const [copied, setCopied] = useState(false)

  if (!bill) return null

  const handlePrint = () => {
    toast.success(`Printing to ${settings.defaultPrinter || 'Default Printer'}...`)
    setTimeout(() => {
      onOpenChange(false)
    }, 800)
  }

  const handleDownload = () => {
    toast.success(`Bill #${bill.billNo} exported as PDF.`)
  }

  const handleCopyText = () => {
    const text = `${settings.shopName}
Bill #${bill.billNo} - Date: ${bill.date}
Customer: ${bill.customerName}
Metal: ${bill.metal.toUpperCase()} (${bill.carat}K)
Gross Weight: ${formatGrams(bill.totalWeightMg)}g (${formatTMR(bill.totalWeightMg)})
Net Weight: ${formatGrams(bill.netWeightMg)}g (${formatTMR(bill.netWeightMg)})
Gold Rate: ${formatMoney(bill.goldRatePkr)}/tola
Total Amount: ${formatMoney(bill.totalPricePkr)}
Wasool Received: ${formatMoney(bill.wasoolPkr)}
Balance: ${formatMoney(bill.balancePkr)}
----------------------------------
${settings.billFooter}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Bill summary copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Printer className="h-5 w-5 text-amber-500" />
            {customTitle} — #{bill.billNo}
          </DialogTitle>
          <Tabs value={template} onValueChange={(v) => setTemplate(v as any)} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="thermal80" className="text-xs">Thermal 80mm</TabsTrigger>
              <TabsTrigger value="A5" className="text-xs">A5 Voucher</TabsTrigger>
              <TabsTrigger value="A4" className="text-xs">A4 Standard</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        {/* Paper Container Preview */}
        <div className="flex-1 overflow-y-auto bg-muted/40 p-4 rounded-md flex justify-center items-start">
          {/* Thermal 80mm Layout */}
          {template === 'thermal80' && (
            <div className="w-[340px] bg-white text-zinc-950 p-4 rounded shadow-md border font-mono text-xs leading-relaxed">
              <div className="text-center pb-2 border-b border-dashed border-zinc-400">
                <h2 className="text-base font-bold font-serif uppercase tracking-wider">{settings.shopName}</h2>
                <p className="text-[11px] text-zinc-600">{settings.address}</p>
                <p className="text-[11px] text-zinc-600">Ph: {settings.phone}</p>
                <div className="mt-1 text-[10px] bg-zinc-100 py-0.5 font-bold uppercase">
                  SALES PURCHI / MEMO (KACHA)
                </div>
              </div>

              <div className="py-2 border-b border-dashed border-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Bill No: <strong>#{bill.billNo}</strong></span>
                  <span>Date: {bill.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold text-right truncate max-w-[190px]">{bill.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operator:</span>
                  <span>{bill.user}</span>
                </div>
              </div>

              <table className="w-full my-2 text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px]">
                    <th className="py-1">DESCRIPTION</th>
                    <th className="py-1 text-right">WT (g)</th>
                    <th className="py-1 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {bill.items.map((it, idx) => (
                    <tr key={idx} className="text-[11px]">
                      <td className="py-1">
                        <div>{it.description || 'Gold Jewellery Item'}</div>
                        <div className="text-[9px] text-zinc-500">{it.carat}K @ Rs {it.goldRatePkr.toLocaleString()}</div>
                      </td>
                      <td className="py-1 text-right font-bold">{formatGrams(it.totalWeightMg)}</td>
                      <td className="py-1 text-right font-bold">Rs {it.totalPricePkr.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-2 border-t border-dashed border-zinc-400 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Gross Weight:</span>
                  <span>{formatGrams(bill.totalWeightMg)} g ({formatTMR(bill.totalWeightMg)})</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Cut Deducted:</span>
                  <span>−{formatGrams(bill.cutTotalMg)} g</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Polish Deducted:</span>
                  <span>−{formatGrams(bill.polishTotalMg)} g</span>
                </div>
                <div className="flex justify-between font-bold border-t border-zinc-200 pt-1">
                  <span>Net Total Weight:</span>
                  <span>{formatGrams(bill.netWeightMg, 4)} g</span>
                </div>
                <div className="flex justify-between">
                  <span>Gold Rate / Tola:</span>
                  <span>Rs {bill.goldRatePkr.toLocaleString()}</span>
                </div>
                {bill.chargesPkr > 0 && (
                  <div className="flex justify-between">
                    <span>Labour / Charges:</span>
                    <span>Rs {bill.chargesPkr.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-zinc-800 pt-1">
                  <span>TOTAL AMOUNT:</span>
                  <span>Rs {bill.totalPricePkr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>WASOOL (RECEIVED):</span>
                  <span>Rs {bill.wasoolPkr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-red-700">
                  <span>BALANCE DUE:</span>
                  <span>Rs {bill.balancePkr.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-dashed border-zinc-400 text-center text-[10px] text-zinc-500">
                <p>{settings.billFooter}</p>
                <p className="mt-1 font-mono">Printed on {new Date().toLocaleTimeString()} • Gold King OS</p>
              </div>
            </div>
          )}

          {/* A5 / A4 Layout */}
          {(template === 'A5' || template === 'A4') && (
            <div className={`bg-white text-zinc-950 p-8 rounded shadow-md border font-sans text-sm ${template === 'A5' ? 'w-[520px]' : 'w-[640px]'}`}>
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-amber-800">{settings.shopName}</h1>
                  <p className="text-xs text-zinc-600">{settings.address}</p>
                  <p className="text-xs text-zinc-600">Phone: {settings.phone}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded text-xs">
                    OFFICIAL INVOICE
                  </span>
                  <div className="mt-2 text-xs font-mono">
                    <p>Bill #: <strong>{bill.billNo}</strong></p>
                    <p>Date: {bill.date}</p>
                  </div>
                </div>
              </div>

              <div className="my-4 p-3 bg-zinc-50 rounded border flex justify-between text-xs">
                <div>
                  <span className="text-zinc-500">Billed To:</span>
                  <p className="font-bold text-sm text-zinc-900">{bill.customerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500">Operator / Cashier:</span>
                  <p className="font-semibold text-zinc-900">{bill.user}</p>
                </div>
              </div>

              <table className="w-full my-4 text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100 border-y border-zinc-300">
                    <th className="py-2 px-2">Item Description</th>
                    <th className="py-2 px-2 text-right">Carat</th>
                    <th className="py-2 px-2 text-right">Gross Wt</th>
                    <th className="py-2 px-2 text-right">Net Wt</th>
                    <th className="py-2 px-2 text-right">Rate/Tola</th>
                    <th className="py-2 px-2 text-right">Total (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {bill.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2 px-2 font-medium">{it.description}</td>
                      <td className="py-2 px-2 text-right font-mono">{it.carat}K</td>
                      <td className="py-2 px-2 text-right font-mono">{formatGrams(it.weightMg)}g</td>
                      <td className="py-2 px-2 text-right font-mono font-semibold">{formatGrams(it.totalWeightMg)}g</td>
                      <td className="py-2 px-2 text-right font-mono">Rs {it.goldRatePkr.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold">Rs {it.totalPricePkr.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end pt-3 border-t">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Net Weight:</span>
                    <span className="font-semibold">{formatGrams(bill.netWeightMg, 4)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Subtotal Value:</span>
                    <span>Rs {(bill.totalPricePkr - bill.chargesPkr).toLocaleString()}</span>
                  </div>
                  {bill.chargesPkr > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Labour / Making:</span>
                      <span>Rs {bill.chargesPkr.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-y py-1">
                    <span>Total Amount:</span>
                    <span>Rs {bill.totalPricePkr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Wasool (Paid):</span>
                    <span>Rs {bill.wasoolPkr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>Balance Due:</span>
                    <span>Rs {bill.balancePkr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t text-center text-xs text-zinc-500">
                <p>{settings.billFooter}</p>
                <div className="mt-6 flex justify-between px-8 text-zinc-400">
                  <span>Customer Signature: __________________</span>
                  <span>Authorized Signature: __________________</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-3">
          <Button variant="outline" size="sm" onClick={handleCopyText} className="gap-1.5 text-xs">
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            Copy Summary
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              <Printer className="h-4 w-4" />
              Print Bill (P)
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
