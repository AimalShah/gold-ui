import React from 'react'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { Card } from '@/components/ui/card'

interface InventoryOverviewTabProps {
  totalFineGoldMg: number
  totalRawGoldMg: number
  rawStockLotsCount: number
  inventoryItemsCount: number
  totalFinishedNetMg: number
  totalSilverMg: number
  totalInventoryValuePkr: number
  mandiRate24k: number
}

export const InventoryOverviewTab: React.FC<InventoryOverviewTabProps> = ({
  totalFineGoldMg,
  totalRawGoldMg,
  rawStockLotsCount,
  inventoryItemsCount,
  totalFinishedNetMg,
  totalSilverMg,
  totalInventoryValuePkr,
  mandiRate24k,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-5">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Total Fine Gold (24K)</span>
        <p className="text-2xl font-bold text-foreground mt-1">{formatGrams(totalFineGoldMg)} g</p>
        <span className="text-xs text-muted-foreground font-mono">{formatTMR(totalFineGoldMg)}</span>
      </Card>

      <Card className="p-5">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Raw Bullion Gold</span>
        <p className="text-2xl font-bold text-foreground mt-1">{formatGrams(totalRawGoldMg)} g</p>
        <span className="text-xs text-muted-foreground">{rawStockLotsCount} Active Lots</span>
      </Card>

      <Card className="p-5">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Finished Items</span>
        <p className="text-2xl font-bold text-foreground mt-1">{inventoryItemsCount} Pieces</p>
        <span className="text-xs text-muted-foreground">Net Wt: {formatGrams(totalFinishedNetMg)}g</span>
      </Card>

      <Card className="p-5">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Silver (Chandi)</span>
        <p className="text-2xl font-bold text-foreground mt-1">{formatGrams(totalSilverMg)} g</p>
        <span className="text-xs text-muted-foreground">500 Tolas Bullion</span>
      </Card>

      <Card className="p-5">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Stock Valuation</span>
        <p className="text-2xl font-bold text-primary mt-1">{formatMoney(totalInventoryValuePkr)}</p>
        <span className="text-xs text-muted-foreground">@ Rs {mandiRate24k.toLocaleString()}/tola</span>
      </Card>
    </div>
  )
}
