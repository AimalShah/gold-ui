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
import { perGramToPerTolaRate, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { useApp } from '@/context/AppContext'
import { Scale } from 'lucide-react'

interface PerGramRateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRate: number
  onApplyTolaRate: (ratePerTola: number) => void
}

export const PerGramRateModal: React.FC<PerGramRateModalProps> = ({
  open,
  onOpenChange,
  currentRate,
  onApplyTolaRate,
}) => {
  const { settings } = useApp()
  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  const initialGramRate = Math.round(currentRate / gramsPerTola)
  const [gramRate, setGramRate] = useState<number>(initialGramRate || 24477)

  const calculatedTolaRate = perGramToPerTolaRate(gramRate, gramsPerTola)

  const handleApply = () => {
    onApplyTolaRate(calculatedTolaRate)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Scale className="h-5 w-5 text-amber-600" />
            Per-Gram Rate Converter (Ctrl+G)
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Enter price per 1 gram to calculate Sarafa standard per-tola rate (1 Tola = {gramsPerTola}g).
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Rate per 1 Gram (PKR)</Label>
            <MoneyInput
              value={gramRate}
              onChange={setGramRate}
              autoFocus
              className="h-9 font-bold text-base"
            />
          </div>

          <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center">
            <div className="text-[11px] text-muted-foreground uppercase font-semibold">
              Resulting Rate per Tola
            </div>
            <div className="text-xl font-mono font-bold text-amber-900 dark:text-amber-100">
              Rs {calculatedTolaRate.toLocaleString()} <span className="text-xs font-sans font-normal text-muted-foreground">/ tola</span>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            Apply to Gold Rate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
