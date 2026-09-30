import React from 'react'
import { WorkshopWork } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WorkshopWorksTabProps {
  works: WorkshopWork[]
  onMarkDone: (id: string) => void
}

export const WorkshopWorksTab: React.FC<WorkshopWorksTabProps> = ({
  works,
  onMarkDone,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Job #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Karigar</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Weight In</th>
              <th className="px-6 py-4 text-right">Weight Out</th>
              <th className="px-6 py-4 text-right">Labour Charges</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remarks</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {works.map((w) => (
              <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">#{w.jobNo}</td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{w.date}</td>
                <td className="px-6 py-4 font-medium text-foreground">{w.karigarName}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{w.workType}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-medium">{formatGrams(w.weightInMg)}g</td>
                <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(w.weightOutMg)}g</td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">
                  {formatMoney(w.labourChargesPkr)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={w.status === 'Completed' ? 'success' : 'processing'}>
                    {w.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs truncate max-w-[150px]">{w.remarks || '—'}</td>
                <td className="px-6 py-4 text-right">
                  {w.status !== 'Completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkDone(w.id)}
                      className="font-medium text-xs text-primary hover:text-primary"
                    >
                      Mark Done
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
