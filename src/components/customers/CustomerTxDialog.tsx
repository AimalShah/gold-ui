import React from 'react'
import { Customer } from '@/lib/types'
import { Input } from '@/components/ui/input'
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
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface CustomerTxDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCustomer: Customer | null
  txType: 'credit' | 'debit'
  txMedium: 'cash' | 'gold'
  setTxMedium: (m: 'cash' | 'gold') => void
  txAmountPkr: number
  setTxAmountPkr: (v: number) => void
  txWeightMg: number
  setTxWeightMg: (v: number) => void
  txRef: string
  setTxRef: (v: string) => void
  txRemarks: string
  setTxRemarks: (v: string) => void
  onSave: () => void
}

export const CustomerTxDialog: React.FC<CustomerTxDialogProps> = ({
  open,
  onOpenChange,
  selectedCustomer,
  txType,
  txMedium,
  setTxMedium,
  txAmountPkr,
  setTxAmountPkr,
  txWeightMg,
  setTxWeightMg,
  txRef,
  setTxRef,
  txRemarks,
  setTxRemarks,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle
            className={`text-base font-bold flex items-center gap-2 ${
              txType === 'credit' ? 'text-emerald-600' : 'text-destructive'
            }`}
          >
            {txType === 'credit' ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
            {txType === 'credit' ? 'Customer Credit (+) Voucher' : 'Customer Debit (−) Voucher'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Customer: <strong>{selectedCustomer?.name}</strong> ({selectedCustomer?.id})
          </p>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Transaction Medium</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={txMedium === 'cash' ? 'default' : 'outline'}
                onClick={() => setTxMedium('cash')}
                className="font-semibold"
              >
                Cash (PKR)
              </Button>
              <Button
                type="button"
                variant={txMedium === 'gold' ? 'default' : 'outline'}
                onClick={() => setTxMedium('gold')}
                className="font-semibold"
              >
                Gold Weight (Au)
              </Button>
            </div>
          </div>

          {txMedium === 'cash' ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Cash Amount (PKR)</Label>
              <MoneyInput
                value={txAmountPkr}
                onChange={setTxAmountPkr}
                autoFocus
                className="h-11 text-base font-bold"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Gold Weight</Label>
              <WeightInput value={txWeightMg} onChange={setTxWeightMg} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reference #</Label>
              <Input
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Narration / Remarks</Label>
            <Input
              value={txRemarks}
              onChange={(e) => setTxRemarks(e.target.value)}
              placeholder="e.g. Account settlement / token advance"
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className={`font-semibold ${
              txType === 'credit' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-destructive text-white'
            }`}
          >
            Save Voucher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
