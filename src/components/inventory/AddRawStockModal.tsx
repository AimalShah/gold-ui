import React from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddRawStockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rawMetal: 'gold' | 'silver'
  setRawMetal: (v: 'gold' | 'silver') => void
  rawKarat: number
  setRawKarat: (v: number) => void
  rawWeightMg: number
  setRawWeightMg: (v: number) => void
  rawCostPerTola: number
  setRawCostPerTola: (v: number) => void
  onAdd: () => void
}

export const AddRawStockModal: React.FC<AddRawStockModalProps> = ({
  open,
  onOpenChange,
  rawMetal,
  setRawMetal,
  rawKarat,
  setRawKarat,
  rawWeightMg,
  setRawWeightMg,
  rawCostPerTola,
  setRawCostPerTola,
  onAdd,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-foreground">
            Add Raw Bullion Stock
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Metal</Label>
              <Select value={rawMetal} onValueChange={(v: any) => setRawMetal(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold (Tezabi / Passa)</SelectItem>
                  <SelectItem value="silver">Silver (Chandi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Purity Karat</Label>
              <Select value={rawKarat.toString()} onValueChange={(v) => setRawKarat(parseInt(v, 10))}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24K Pure Bullion</SelectItem>
                  <SelectItem value="22">22K Standard</SelectItem>
                  <SelectItem value="21">21K Arabian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Weight</Label>
            <WeightInput value={rawWeightMg} onChange={setRawWeightMg} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Purchase Cost Rate / Tola (PKR)</Label>
            <MoneyInput
              value={rawCostPerTola}
              onChange={setRawCostPerTola}
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAdd} className="font-semibold">
            Add to Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
