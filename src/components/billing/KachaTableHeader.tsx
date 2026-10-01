import React from 'react'

interface Props {
  headers: string[]
}

export const KachaTableHeader: React.FC<Props> = ({ headers }) => {
  return (
    <div className="grid grid-cols-12 w-full items-center border-b-2 border-border/90 bg-muted/60 text-xs font-bold uppercase tracking-wider">
      <div className="col-span-4 py-2 px-3 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-black tracking-tight shadow-2xs">
          SMS
        </span>
        <span className="text-foreground font-black text-sm">{headers[0]}</span>
      </div>
      {headers.slice(1).map((h, i) => (
        <div
          key={h}
          className={`col-span-2 py-2 text-center text-foreground font-black border-l border-border/70 ${i === 3 ? 'text-primary' : ''}`}
        >
          {h}
        </div>
      ))}
    </div>
  )
}
