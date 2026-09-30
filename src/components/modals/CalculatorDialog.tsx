import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WeightInput } from '@/components/shared/WeightInput'
import { formatGrams, formatTMR, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { useApp } from '@/context/AppContext'
import { Calculator, Plus, Printer, RotateCcw, X } from 'lucide-react'
import { toast } from 'sonner'

interface CalcRow {
  id: number
  isAdd: boolean // true = +, false = -
  weightMg: number
  rCut: number
}

interface CalculatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CalculatorDialog: React.FC<CalculatorDialogProps> = ({ open, onOpenChange }) => {
  const { settings, unitMode, setUnitMode } = useApp()
  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Initial 10 rows
  const [rows, setRows] = useState<CalcRow[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      isAdd: true,
      weightMg: i === 0 ? 11664 : 0,
      rCut: 0,
    }))
  )

  const handleWeightChange = (index: number, mg: number) => {
    setRows((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], weightMg: mg }
      return copy
    })
  }

  const toggleSign = (index: number) => {
    if (index === 0) return // first row is top
    setRows((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], isAdd: !copy[index].isAdd }
      return copy
    })
  }

  const handleAddMore = () => {
    setRows((prev) => [
      ...prev,
      ...Array.from({ length: 10 }, (_, i) => ({
        id: prev.length + i + 1,
        isAdd: true,
        weightMg: 0,
        rCut: 0,
      })),
    ])
    toast.info("Added 10 more calculator rows")
  }

  const handleReset = () => {
    setRows(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        isAdd: true,
        weightMg: 0,
        rCut: 0,
      }))
    )
    toast.info("Calculator reset")
  }

  const handlePrint = () => {
    toast.success("Printing Calculator items breakdown tape...")
  }

  // Calculate Net Sum
  const totalWeightMg = rows.reduce((sum, r) => {
    return sum + (r.isAdd ? r.weightMg : -r.weightMg)
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            <DialogTitle className="text-base font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
              WEIGHT CALCULATOR (F2) — MULTI-ITEM TAPE
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit toggles */}
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded border text-xs font-mono">
              <button
                type="button"
                onClick={() => setUnitMode('auto')}
                className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'auto' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('grams')}
                className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'grams' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
              >
                Grams
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('tola')}
                className={`px-2 py-0.5 rounded font-bold text-xs ${unitMode === 'tola' ? 'bg-amber-500 text-white' : 'text-muted-foreground'}`}
              >
                Tolas
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Rows Table */}
        <div className="flex-1 overflow-y-auto space-y-1.5 p-1">
          {rows.map((r, index) => (
            <div key={r.id} className="flex items-center gap-2">
              {/* Add / Subtract toggle */}
              <button
                type="button"
                onClick={() => toggleSign(index)}
                className={`h-8 w-12 rounded border text-xs font-mono font-bold flex items-center justify-center transition-colors shrink-0 ${
                  index === 0
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : r.isAdd
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                }`}
                title={index === 0 ? 'Top Row' : 'Click to toggle Add (+) or Subtract (−)'}
              >
                {index === 0 ? 'TOP' : r.isAdd ? '+ ADD' : '− SUB'}
              </button>

              <div className="flex-1">
                <WeightInput
                  label={`WEIGHT ${r.id}`}
                  value={r.weightMg}
                  onChange={(val) => handleWeightChange(index, val)}
                  activeUnit={unitMode}
                  compact={true}
                  tint={index === 0 ? 'tint-row-weight' : r.isAdd ? 'bg-background' : 'tint-row-charges'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Red Tint TOTAL WT Footer Row */}
        <div className="pt-2 border-t-2">
          <div className="p-3 rounded-lg border-2 border-red-400 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-sans font-black tracking-wider uppercase text-red-700 dark:text-red-400">
                TOTAL WEIGHT (CALCULATED)
              </span>
              <div className="text-xs font-mono text-muted-foreground">
                Tola / Masha / Ratti: {formatTMR(totalWeightMg, gramsPerTola)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-mono font-black text-red-700 dark:text-red-300">
                {formatGrams(totalWeightMg, 4)} <span className="text-sm font-sans font-medium">grams</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t flex justify-between sm:justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMore}
              className="text-xs gap-1 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              ADD MORE (+10)
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-red-600 hover:bg-red-50 gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1"
            >
              <Printer className="h-3.5 w-3.5" />
              CalcPrint
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs bg-zinc-800 text-white"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
