import React from 'react'
import { InventoryItem } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { QrCode, Printer } from 'lucide-react'
import { toast } from 'sonner'

interface PrintLabelModalProps {
  selectedItemForLabel: InventoryItem | null
  onClose: () => void
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({
  selectedItemForLabel,
  onClose,
}) => {
  return (
    <Dialog open={!!selectedItemForLabel} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-6 text-center">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center justify-center gap-2">
            <QrCode className="size-5 text-foreground" />
            Jewellery Tag Barcode
          </DialogTitle>
        </DialogHeader>

        {selectedItemForLabel && (
          <div className="py-4 flex flex-col items-center space-y-2">
            <div className="w-56 p-4 rounded-lg border border-border bg-card text-foreground shadow-sm text-xs leading-tight">
              <div className="font-bold text-xs uppercase tracking-wide">Zorvex Jewellers</div>
              <div className="text-[11px] text-muted-foreground truncate mt-0.5">{selectedItemForLabel.name}</div>
              <div className="my-3 h-10 bg-muted/80 rounded flex items-center justify-center text-foreground tracking-[5px] text-xs font-mono font-bold border border-border">
                ||||||||||||||||||||||
              </div>
              <div className="text-xs font-mono font-bold">{selectedItemForLabel.barcode}</div>
              <div className="flex justify-between pt-2 border-t border-border text-[11px] font-semibold mt-2">
                <span>{selectedItemForLabel.karat}K</span>
                <span>{formatGrams(selectedItemForLabel.grossWeightMg)}g</span>
                <span>Rs {selectedItemForLabel.makingChargesPkr}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t pt-3 flex justify-between sm:justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast.success("Printing tag on Zebra thermal printer...")
              onClose()
            }}
            className="font-semibold gap-1.5"
          >
            <Printer className="size-4" /> Print Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
