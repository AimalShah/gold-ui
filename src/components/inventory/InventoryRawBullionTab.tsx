import React from 'react'
import { RawStockLot } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'

interface InventoryRawBullionTabProps {
  rawStock: RawStockLot[]
}

export const InventoryRawBullionTab: React.FC<InventoryRawBullionTabProps> = ({ rawStock }) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Lot #</th>
              <th className="px-6 py-4">Metal</th>
              <th className="px-6 py-4">Purity</th>
              <th className="px-6 py-4 text-right">Gross Weight</th>
              <th className="px-6 py-4 text-right">Fine Weight (24K)</th>
              <th className="px-6 py-4 text-right">Cost Rate / Tola</th>
              <th className="px-6 py-4 text-right">Estimated Value</th>
              <th className="px-6 py-4">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rawStock.map((r) => (
              <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-primary">{r.id}</td>
                <td className="px-6 py-4 font-medium capitalize">{r.metal}</td>
                <td className="px-6 py-4 font-medium">{r.karat}K</td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">{formatGrams(r.weightMg)}g</td>
                <td className="px-6 py-4 text-right font-semibold text-primary">{formatGrams(r.fineWeightMg)}g</td>
                <td className="px-6 py-4 text-right">{formatMoney(r.avgCostPerTolaPkr)}</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">{formatMoney(r.valuePkr)}</td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{r.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
