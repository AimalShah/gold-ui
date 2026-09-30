import React from 'react'
import { CastingOrder } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WeightInput } from '@/components/shared/WeightInput'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface ReceiveCastingModalProps {
  receivingCastOrder: CastingOrder | null
  onClose: () => void
  castReturnedMg: number
  setCastReturnedMg: (v: number) => void
  onSave: () => void
}

export const ReceiveCastingModal: React.FC<ReceiveCastingModalProps> = ({
  receivingCastOrder,
  onClose,
  castReturnedMg,
  setCastReturnedMg,
  onSave,
}) => {
  return (
    <Dialog open={!!receivingCastOrder} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-foreground">
            Receive Casting Order #{receivingCastOrder?.orderNo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Actual Returned Weight (g)</Label>
            <WeightInput value={castReturnedMg} onChange={setCastReturnedMg} />
          </div>

          {receivingCastOrder && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issued Weight:</span>
                <span className="font-semibold">{formatGrams(receivingCastOrder.issuedWeightMg)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Return:</span>
                <span className="font-semibold">{formatGrams(receivingCastOrder.expectedReturnMg)}g</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-1.5">
                <span>Actual Wastage:</span>
                <span className="text-destructive">
                  {formatGrams(Math.max(0, receivingCastOrder.issuedWeightMg - castReturnedMg))}g
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} className="font-semibold">
            Reconcile & Receive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
