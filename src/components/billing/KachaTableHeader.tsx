import React from 'react'

interface Props {
  headers: string[]
}

export const KachaTableHeader: React.FC<Props> = ({ headers }) => {
  return (
    <div className="grid grid-cols-12 w-full items-center border-b-2 border-slate-400 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-xl font-black uppercase tracking-wider">
      <div className="col-span-4 py-2.5 px-3 flex items-center gap-2.5">
        <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-black tracking-tight shadow-sm">
          SMS
        </span>
        <span className="text-foreground font-black text-xl">{headers[0]}</span>
      </div>
      {headers.slice(1).map((h, i) => (
        <div
          key={h}
          className={`col-span-2 py-2.5 text-center text-foreground font-black text-xl border-l-2 border-slate-400 dark:border-slate-700 ${i === 3 ? 'text-primary' : ''}`}
        >
          {h}
        </div>
      ))}
    </div>
  )
}
