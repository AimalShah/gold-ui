import React from 'react'
import { Karigar } from '@/lib/types'
import { formatGrams, formatTMR } from '@/lib/gold-math'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface InventoryKarigarTabProps {
  karigars: Karigar[]
}

export const InventoryKarigarTab: React.FC<InventoryKarigarTabProps> = ({ karigars }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {karigars.map((k) => (
        <Card key={k.id} className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-base text-foreground">{k.name}</h3>
              <p className="text-xs text-muted-foreground">{k.speciality}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.city} · {k.phone}</p>
            </div>
            <Badge variant="secondary">
              {k.activeJobs} Active Jobs
            </Badge>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gold Held:</span>
              <span className="font-bold text-primary">{formatGrams(k.goldHeldMg)}g</span>
            </div>
            <div className="text-[11px] text-muted-foreground text-right">{formatTMR(k.goldHeldMg)}</div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-muted-foreground">Silver Held:</span>
              <span className="font-semibold">{formatGrams(k.silverHeldMg)}g</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(`Issue metal to ${k.name}`)}
              className="flex-1"
            >
              Issue Metal
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(`Receive metal from ${k.name}`)}
              className="flex-1"
            >
              Receive Metal
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
