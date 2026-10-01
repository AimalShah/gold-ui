import React from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Printer, Check, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BillingTopControlsProps {
  billType: 'sale' | 'purchase'
  onBillTypeChange: (type: 'sale' | 'purchase') => void
  unitMode: 'auto' | 'grams' | 'tola'
  onUnitModeChange: (mode: 'auto' | 'grams' | 'tola') => void
  onSave: () => void
  onCredit: () => void
  onPrint: () => void
  onReset: () => void
}

export const BillingTopControls: React.FC<BillingTopControlsProps> = ({
  billType, onBillTypeChange, unitMode, onUnitModeChange, onSave, onCredit, onPrint, onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-card shadow-xs">
      {/* Transaction Type */}
      <div className="flex rounded-md bg-muted/80 p-0.5 border border-border">
        <button
          type="button"
          onClick={() => onBillTypeChange('sale')}
          className={cn('px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer',
            billType === 'sale' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Sale
        </button>
        <button
          type="button"
          onClick={() => onBillTypeChange('purchase')}
          className={cn('px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer',
            billType === 'purchase' ? 'bg-amber-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Purchase
        </button>
      </div>

      {/* Unit Mode Selector (Auto / Gram / Tola) */}
      <div className="flex items-center gap-1 bg-muted/80 p-0.5 rounded-md border border-border font-mono text-xs">
        {(['auto', 'grams', 'tola'] as const).map((mode) => {
          const labels = { auto: 'AUTO (F7)', grams: 'GRAM (G)', tola: 'TOLA (W)' }
          const isActive = unitMode === mode
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onUnitModeChange(mode)}
              className={cn('px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer',
                isActive
                  ? mode === 'grams' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {labels[mode]}
            </button>
          )
        })}
      </div>

      {/* Action Buttons: Print, Credit, Save, Reset */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrint} className="h-8 px-3 text-xs font-bold border-border cursor-pointer">
          <Printer className="size-3.5 mr-1" /> Print <kbd className="hidden sm:inline-block ml-1 text-[10px] text-muted-foreground font-mono">P</kbd>
        </Button>
        <Button variant="outline" size="sm" onClick={onCredit} className="h-8 px-3 text-xs font-bold border-border cursor-pointer">
          <CreditCard className="size-3.5 mr-1 text-muted-foreground" /> Credit
        </Button>
        <Button size="sm" onClick={onSave} className="h-8 px-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer">
          <Check className="size-3.5 mr-1" /> Save <kbd className="hidden sm:inline-block ml-1 text-[10px] opacity-80 font-mono">F8</kbd>
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40 border-border cursor-pointer">
          <RotateCcw className="size-3.5 mr-1" /> Reset <kbd className="hidden sm:inline-block ml-1 text-[10px] opacity-60 font-mono">F4</kbd>
        </Button>
      </div>
    </div>
  )
}
