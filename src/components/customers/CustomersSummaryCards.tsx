import React from 'react'
import { Card } from '@/components/ui/card'
import { Users, CreditCard, Scale, ArrowDownLeft } from 'lucide-react'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'

interface CustomersSummaryCardsProps {
  totalCustomers: number
  totalReceivableCashPkr: number
  totalReceivableGoldMg: number
  totalAdvanceCashPkr: number
}

export const CustomersSummaryCards: React.FC<CustomersSummaryCardsProps> = ({
  totalCustomers,
  totalReceivableCashPkr,
  totalReceivableGoldMg,
  totalAdvanceCashPkr,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Total Customers</span>
          <Users className="size-5 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{totalCustomers} Accounts</p>
        <span className="text-xs text-muted-foreground">Registered Sarafa Retailers</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Total Cash Dues</span>
          <CreditCard className="size-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-destructive mt-2">{formatMoney(totalReceivableCashPkr)}</p>
        <span className="text-xs text-muted-foreground">Owed by Customer Accounts</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Total Gold Owed</span>
          <Scale className="size-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary mt-2">{formatGrams(totalReceivableGoldMg)}g</p>
        <span className="text-xs text-muted-foreground font-mono">{formatTMR(totalReceivableGoldMg)}</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Advance Deposits</span>
          <ArrowDownLeft className="size-5 text-emerald-600" />
        </div>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{formatMoney(totalAdvanceCashPkr)}</p>
        <span className="text-xs text-muted-foreground">Client Cash Held</span>
      </Card>
    </div>
  )
}
