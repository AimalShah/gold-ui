import React from 'react'
import { Customer, Karigar } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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

interface NewCustomerOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  karigars: Karigar[]
  mandiRate24k: number
  orderCustomer: string
  setOrderCustomer: (v: string) => void
  orderItemDesc: string
  setOrderItemDesc: (v: string) => void
  orderWeightMg: number
  setOrderWeightMg: (v: number) => void
  orderCarat: number
  setOrderCarat: (v: number) => void
  orderMakingCharges: number
  setOrderMakingCharges: (v: number) => void
  orderAdvanceCashPkr: number
  setOrderAdvanceCashPkr: (v: number) => void
  orderDeliveryDate: string
  setOrderDeliveryDate: (v: string) => void
  orderKarigar: string
  setOrderKarigar: (v: string) => void
  orderPriority: 'normal' | 'urgent'
  setOrderPriority: (v: 'normal' | 'urgent') => void
  orderRateLocked: boolean
  setOrderRateLocked: (v: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

export const NewCustomerOrderModal: React.FC<NewCustomerOrderModalProps> = ({
  open,
  onOpenChange,
  customers,
  karigars,
  mandiRate24k,
  orderCustomer,
  setOrderCustomer,
  orderItemDesc,
  setOrderItemDesc,
  orderWeightMg,
  setOrderWeightMg,
  orderCarat,
  setOrderCarat,
  orderMakingCharges,
  setOrderMakingCharges,
  orderAdvanceCashPkr,
  setOrderAdvanceCashPkr,
  orderDeliveryDate,
  setOrderDeliveryDate,
  orderKarigar,
  setOrderKarigar,
  orderPriority,
  setOrderPriority,
  orderRateLocked,
  setOrderRateLocked,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-6 overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-foreground">
            New Custom Jewellery Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-3 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Customer *</Label>
            <Select value={orderCustomer} onValueChange={setOrderCustomer}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pick customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.id}) · {c.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Item Description *</Label>
            <Input
              value={orderItemDesc}
              onChange={(e) => setOrderItemDesc(e.target.value)}
              placeholder="e.g. 21K Antique Bridal Choker with Ruby stones"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Weight Required</Label>
            <WeightInput value={orderWeightMg} onChange={setOrderWeightMg} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Karat</Label>
              <Select value={orderCarat.toString()} onValueChange={(v) => setOrderCarat(parseInt(v, 10))}>
                <SelectTrigger className="h-10 font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24K Pure Gold</SelectItem>
                  <SelectItem value="22">22K Jewellery</SelectItem>
                  <SelectItem value="21">21K Arabian</SelectItem>
                  <SelectItem value="18">18K Diamond Mount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Making Charges (PKR)</Label>
              <MoneyInput
                value={orderMakingCharges}
                onChange={setOrderMakingCharges}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Advance Cash Received</Label>
              <MoneyInput
                value={orderAdvanceCashPkr}
                onChange={setOrderAdvanceCashPkr}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Delivery Due Date</Label>
              <Input
                type="date"
                value={orderDeliveryDate}
                onChange={(e) => setOrderDeliveryDate(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assign Workshop Karigar</Label>
              <Select value={orderKarigar} onValueChange={setOrderKarigar}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {karigars.map((k) => (
                    <SelectItem key={k.id} value={k.name}>
                      {k.name} ({k.speciality})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Priority</Label>
              <Select value={orderPriority} onValueChange={(v: any) => setOrderPriority(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">URGENT Rush Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">Lock Today's Gold Rate?</Label>
              <p className="text-[11px] text-muted-foreground">Locks rate at Rs {mandiRate24k.toLocaleString()}/tola</p>
            </div>
            <Switch checked={orderRateLocked} onCheckedChange={setOrderRateLocked} />
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Save Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
