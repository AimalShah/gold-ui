import React from 'react'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface GroupRow {
  id: number
  desc: string
  weightMg: number
  cutMg: number
  rate: number
}

interface GroupPurchiTabProps {
  groupRows: GroupRow[]
  setGroupRows: React.Dispatch<React.SetStateAction<GroupRow[]>>
  mandiRate24k: number
}

export const GroupPurchiTab: React.FC<GroupPurchiTabProps> = ({
  groupRows,
  setGroupRows,
  mandiRate24k,
}) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">Multi-Item Group Purchi Batch</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Build multi-item purchase slip and save as a batch transaction.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setGroupRows((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                desc: `Item ${prev.length + 1}`,
                weightMg: 11664,
                cutMg: 243,
                rate: mandiRate24k,
              },
            ])
          }}
          className="gap-1.5"
        >
          <Plus className="size-4" /> Add Row
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Gross Wt (g)</th>
              <th className="px-6 py-3 text-right">Cut (g)</th>
              <th className="px-6 py-3 text-right font-bold">Net Wt (g)</th>
              <th className="px-6 py-3 text-right">Rate / Tola</th>
              <th className="px-6 py-3 text-right font-bold">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groupRows.map((r, i) => {
              const net = Math.max(0, r.weightMg - r.cutMg)
              const amt = Math.round((net / 11664) * r.rate)
              return (
                <tr key={r.id}>
                  <td className="px-6 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-6 py-3 font-medium text-foreground">{r.desc}</td>
                  <td className="px-6 py-3 text-right">{formatGrams(r.weightMg)}g</td>
                  <td className="px-6 py-3 text-right text-muted-foreground">−{formatGrams(r.cutMg)}g</td>
                  <td className="px-6 py-3 text-right font-bold text-foreground">{formatGrams(net)}g</td>
                  <td className="px-6 py-3 text-right font-medium">Rs {r.rate.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right font-bold text-primary">{formatMoney(amt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-3 border-t border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">
          Total Rows: <strong>{groupRows.length}</strong>
        </span>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => toast.info("Temporary group cleared")}
          >
            Discard
          </Button>
          <Button
            onClick={() => toast.success("Group Purchi converted to Bill!")}
            className="font-medium"
          >
            Save Group & Print Slip
          </Button>
        </div>
      </div>
    </Card>
  )
}
