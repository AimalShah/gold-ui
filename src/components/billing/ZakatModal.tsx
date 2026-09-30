import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { calculateZakat, formatMoney } from '@/lib/gold-math'
import { Copy, Check, HeartHandshake } from 'lucide-react'
import { toast } from 'sonner'

interface ZakatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalPricePkr: number
  zakatPercent?: number
}

export const ZakatModal: React.FC<ZakatModalProps> = ({
  open,
  onOpenChange,
  totalPricePkr,
  zakatPercent = 2.5,
}) => {
  const [copied, setCopied] = useState(false)
  const zakatAmount = calculateZakat(totalPricePkr, zakatPercent / 100)

  const handleCopy = () => {
    navigator.clipboard.writeText(zakatAmount.toString())
    setCopied(true)
    toast.success("Zakat amount copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6 text-center">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300">
            <HeartHandshake className="h-5 w-5 text-emerald-600" />
            Zakat Calculation (Z)
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Shariah compliance calculator ({zakatPercent}% per annum on gold value).
          </p>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="text-xs text-muted-foreground">
            Total Gold Value: <strong>{formatMoney(totalPricePkr)}</strong>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <div className="text-[11px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
              Payable Zakat (2.5%)
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-900 dark:text-emerald-100 my-1">
              {formatMoney(zakatAmount)}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
              (Example from recording: 1,398,000 → 34,950 PKR)
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between border-t pt-3">
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Zakat Amount
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close (Esc)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
