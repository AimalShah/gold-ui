import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { amountToGoldMg, formatGrams, formatTMR, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { useApp } from '@/context/AppContext'
import { Calculator, ArrowRight } from 'lucide-react'

interface AmountToGoldModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRate: number
  onApplyWeight: (weightMg: number) => void
}

export const AmountToGoldModal: React.FC<AmountToGoldModalProps> = ({
  open,
  onOpenChange,
  currentRate,
  onApplyWeight,
}) => {
  const { settings } = useApp()
  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  const [amountPkr, setAmountPkr] = useState<number>(500000)
  const [ratePkr, setRatePkr] = useState<number>(currentRate || 285500)

  const calculatedMg = amountToGoldMg(amountPkr, ratePkr, gramsPerTola)

  const handleApply = () => {
    onApplyWeight(calculatedMg)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Calculator className="h-5 w-5 text-amber-600" />
            Amount to Gold Converter (A)
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Enter cash budget amount in PKR to calculate corresponding gold weight at current rate.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Cash Amount (PKR)</Label>
            <MoneyInput
              value={amountPkr}
              onChange={setAmountPkr}
              autoFocus
              className="h-10 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Gold Rate / Tola (PKR)</Label>
            <MoneyInput
              value={ratePkr}
              onChange={setRatePkr}
              className="h-9"
            />
          </div>

          {/* Result card */}
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-1">
            <span className="text-[11px] font-sans uppercase font-bold text-amber-800 dark:text-amber-300">
              Calculated Equivalent Gold Weight
            </span>
            <div className="text-2xl font-mono font-bold text-amber-900 dark:text-amber-100">
              {formatGrams(calculatedMg, 4)} <span className="text-sm font-sans font-semibold">grams</span>
            </div>
            <div className="text-xs font-mono text-amber-800 dark:text-amber-300">
              {formatTMR(calculatedMg, gramsPerTola)}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5"
          >
            Apply to Weight (Enter)
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
