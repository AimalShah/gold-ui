import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { ExpenseCategory } from '@/lib/types'
import { formatMoney } from '@/lib/gold-math'
import { toast } from 'sonner'

interface AddExpenseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExpense: (data: { category: ExpenseCategory; amountPkr: number; paidTo: string; note: string }) => void
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  onOpenChange,
  onAddExpense,
}) => {
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Staff Tea / Meal')
  const [expAmount, setExpAmount] = useState(1500)
  const [expPaidTo, setExpPaidTo] = useState('')
  const [expNote, setExpNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (expAmount <= 0) {
      toast.error('Please enter a valid expense amount.')
      return
    }

    onAddExpense({
      category: expCategory,
      amountPkr: expAmount,
      paidTo: expPaidTo || 'Cash Payment',
      note: expNote,
    })

    toast.success(`Expense of ${formatMoney(expAmount)} recorded in Cash Book!`)
    onOpenChange(false)
    setExpPaidTo('')
    setExpNote('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Record Shop Expense (Kharcha)</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Expense Category</Label>
            <Select value={expCategory} onValueChange={(v) => setExpCategory(v as ExpenseCategory)}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Staff Tea / Meal">Staff Tea / Refreshment / Meals</SelectItem>
                <SelectItem value="Electricity / Utilities">Shop Electricity / Generators</SelectItem>
                <SelectItem value="Karigar Labour Payment">Karigar Labour Cash Advance</SelectItem>
                <SelectItem value="Acid / Chemical Supplies">Tehleel & Acid Polish Chemicals</SelectItem>
                <SelectItem value="Shop Rent">Shop Rent</SelectItem>
                <SelectItem value="Packaging / Boxes">Velvet Jewellery Boxes & Pouches</SelectItem>
                <SelectItem value="Other">Miscellaneous Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Amount (PKR)</Label>
            <MoneyInput value={expAmount} onChange={setExpAmount} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Paid To (Person / Vendor)</Label>
            <Input
              value={expPaidTo}
              onChange={(e) => setExpPaidTo(e.target.value)}
              placeholder="e.g. Hotel delivery, Wapda Bill, Cashier"
              className="h-10 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Remarks / Note</Label>
            <Input
              value={expNote}
              onChange={(e) => setExpNote(e.target.value)}
              placeholder="e.g. Lunch for 6 workshop karigars"
              className="h-10 text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save to Cash Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
