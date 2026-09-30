import React from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BillingTopControlsProps {
  billType: 'sale' | 'purchase'
  onBillTypeChange: (type: 'sale' | 'purchase') => void
  onReset: () => void
}

export const BillingTopControls: React.FC<BillingTopControlsProps> = ({
  billType,
  onBillTypeChange,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg bg-muted/70 p-1 border border-border">
          <button
            type="button"
            onClick={() => onBillTypeChange('sale')}
            className={cn(
              'px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer transition-all',
              billType === 'sale'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Sale Transaction
          </button>
          <button
            type="button"
            onClick={() => onBillTypeChange('purchase')}
            className={cn(
              'px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold cursor-pointer transition-all',
              billType === 'purchase'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Purchase Transaction
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 px-3 text-xs font-semibold text-muted-foreground hover:text-destructive border-border cursor-pointer transition-colors"
          title="Clear Form"
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          <span>Reset Form</span>
        </Button>
      </div>
    </div>
  )
}
