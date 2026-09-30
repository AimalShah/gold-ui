import React from 'react'
import { Card } from '@/components/ui/card'
import { ArrowDownLeft, ArrowUpRight, Wallet, Scale } from 'lucide-react'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface AccountsSummaryCardsProps {
  totalCashIn: number
  totalCashOut: number
  netCashInHand: number
  totalGoldIn: number
  totalGoldOut: number
}

export const AccountsSummaryCards: React.FC<AccountsSummaryCardsProps> = ({
  totalCashIn,
  totalCashOut,
  netCashInHand,
  totalGoldIn,
  totalGoldOut,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Cash In (Received)</span>
          <ArrowDownLeft className="size-5 text-emerald-600" />
        </div>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{formatMoney(totalCashIn)}</p>
        <span className="text-xs text-muted-foreground">Daily Inflow</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Cash Out (Disbursed)</span>
          <ArrowUpRight className="size-5 text-destructive" />
        </div>
        <p className="text-2xl font-bold text-destructive mt-2">{formatMoney(totalCashOut)}</p>
        <span className="text-xs text-muted-foreground">Daily Outflow</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Net Vault Cash</span>
          <Wallet className="size-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">{formatMoney(netCashInHand)}</p>
        <span className="text-xs text-muted-foreground">After Shop Expenses</span>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-muted-foreground">Gold Net Movement</span>
          <Scale className="size-5 text-amber-500" />
        </div>
        <p className="text-2xl font-bold text-foreground mt-2">
          {formatGrams(Math.abs(totalGoldIn - totalGoldOut))}g
        </p>
        <span className="text-xs text-muted-foreground font-mono">
          In: {formatGrams(totalGoldIn)}g · Out: {formatGrams(totalGoldOut)}g
        </span>
      </Card>
    </div>
  )
}
