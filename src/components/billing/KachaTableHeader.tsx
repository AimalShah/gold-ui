import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  headers: string[]
}

export const KachaTableHeader: React.FC<Props> = ({ headers }) => {
  return (
    <div className="grid grid-cols-12 w-full items-center border-b-2 border-border bg-muted/60 text-xl font-bold uppercase tracking-wider">
      <div className="col-span-4 py-2.5 px-3 flex items-center gap-2.5">
        <span className="px-2 py-0.5 rounded bg-muted-foreground/20 text-foreground text-xs font-bold tracking-tight">
          SMS
        </span>
        <span className="text-foreground font-black text-xl">{headers[0]}</span>
      </div>
      {headers.slice(1).map((h) => {
        const isGrams = h === 'GRAMS'
        return (
          <div
            key={h}
            className={cn(
              'col-span-2 py-2.5 text-center font-black text-xl border-l-2 border-border',
              isGrams ? 'bg-emerald-600 text-white' : 'text-foreground'
            )}
          >
            {h}
          </div>
        )
      })}
    </div>
  )
}
