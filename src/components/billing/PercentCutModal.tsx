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
import { formatGrams } from '@/lib/gold-math'
import { Percent } from 'lucide-react'

interface PercentCutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWeightMg: number
  onApplyCut: (cutTotalMg: number) => void
}

export const PercentCutModal: React.FC<PercentCutModalProps> = ({
  open,
  onOpenChange,
  currentWeightMg,
  onApplyCut,
}) => {
  const [percent, setPercent] = useState<string>('2.5')

  const pct = parseFloat(percent) || 0
  const calculatedCutMg = Math.round((currentWeightMg * pct) / 100)

  const handleApply = () => {
    onApplyCut(calculatedCutMg)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Percent className="h-5 w-5 text-amber-600" />
            Percent Cut Deduction (Shift+5)
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Apply percentage loss or wastage directly to gross gold weight.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Gross Weight</Label>
            <div className="h-8 px-2.5 flex items-center font-mono font-bold bg-muted rounded border text-sm">
              {formatGrams(currentWeightMg, 4)} grams
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Deduction Percentage (%)</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                autoFocus
                className="h-9 pr-7 font-mono text-right font-bold text-sm"
              />
              <span className="absolute right-2.5 top-2 text-muted-foreground font-bold">%</span>
            </div>
          </div>

          <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center">
            <div className="text-[11px] text-muted-foreground uppercase font-semibold">Calculated Total Cut</div>
            <div className="text-lg font-mono font-bold text-amber-900 dark:text-amber-200">
              {formatGrams(calculatedCutMg, 4)} grams
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
            Apply Cut to Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
