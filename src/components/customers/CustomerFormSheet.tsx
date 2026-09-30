import React from 'react'
import { Customer } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CustomerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCustomer: Customer | null
  formName: string
  setFormName: (v: string) => void
  formPhone: string
  setFormPhone: (v: string) => void
  formAltPhone: string
  setFormAltPhone: (v: string) => void
  formCity: string
  setFormCity: (v: string) => void
  formGroup: string
  setFormGroup: (v: string) => void
  formAddress: string
  setFormAddress: (v: string) => void
  formCreditLimitPkr: number
  setFormCreditLimitPkr: (v: number) => void
  formOpeningGoldMg: number
  setFormOpeningGoldMg: (v: number) => void
  formOpeningCashPkr: number
  setFormOpeningCashPkr: (v: number) => void
  formSmsAlerts: boolean
  setFormSmsAlerts: (v: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

export const CustomerFormSheet: React.FC<CustomerFormSheetProps> = ({
  open,
  onOpenChange,
  editingCustomer,
  formName,
  setFormName,
  formPhone,
  setFormPhone,
  formAltPhone,
  setFormAltPhone,
  formCity,
  setFormCity,
  formGroup,
  setFormGroup,
  formAddress,
  setFormAddress,
  formCreditLimitPkr,
  setFormCreditLimitPkr,
  formOpeningGoldMg,
  setFormOpeningGoldMg,
  formOpeningCashPkr,
  setFormOpeningCashPkr,
  formSmsAlerts,
  setFormSmsAlerts,
  onSubmit,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="text-lg font-bold text-foreground">
            {editingCustomer ? `Edit Customer — ${editingCustomer.id}` : 'Create New Customer Account'}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Fill in customer profile and opening dual ledger balances (Gold & Cash).
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-4 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Full Name *</Label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Sheikh Tariq Mahmood"
              className="h-10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Phone Number *</Label>
              <Input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="0300-1234567"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Alternate Phone</Label>
              <Input
                value={formAltPhone}
                onChange={(e) => setFormAltPhone(e.target.value)}
                placeholder="042-3712345"
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City</Label>
              <Input
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Lahore / Karachi"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Customer Group</Label>
              <Select value={formGroup} onValueChange={setFormGroup}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retailer">Retailer</SelectItem>
                  <SelectItem value="Wholesaler / Dealer">Wholesaler / Dealer</SelectItem>
                  <SelectItem value="Walk-in VIP">Walk-in VIP</SelectItem>
                  <SelectItem value="Workshop Karigar">Workshop Karigar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Shop / Residential Address</Label>
            <Input
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              placeholder="e.g. Sarafa Bazar, Shop #12"
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Credit Limit (PKR)</Label>
            <MoneyInput
              value={formCreditLimitPkr}
              onChange={setFormCreditLimitPkr}
              className="h-10"
            />
          </div>

          {!editingCustomer && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground block">
                Opening Dual Balances (Optional)
              </span>
              <div className="space-y-1">
                <Label className="text-xs">Opening Gold Balance</Label>
                <WeightInput
                  value={formOpeningGoldMg}
                  onChange={setFormOpeningGoldMg}
                  allowNegative={true}
                  compact={true}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Opening Cash Balance (PKR)</Label>
                <MoneyInput
                  value={formOpeningCashPkr}
                  onChange={setFormOpeningCashPkr}
                  allowNegative={true}
                  className="h-10"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold">SMS Transaction Alerts</Label>
              <p className="text-[11px] text-muted-foreground">Send auto SMS on bills and ledger receipts</p>
            </div>
            <Switch checked={formSmsAlerts} onCheckedChange={setFormSmsAlerts} />
          </div>

          <SheetFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              {editingCustomer ? 'Save Changes' : 'Create Account'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
