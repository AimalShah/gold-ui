import React from 'react'
import { Calculator, LogOut, ChevronRight } from 'lucide-react'

interface Props {
  collapsed: boolean
  onExpand: () => void
  onOpenCalc: () => void
  onSignOut: () => void
}

export const SidebarFooter: React.FC<Props> = ({
  collapsed,
  onExpand,
  onOpenCalc,
  onSignOut,
}) => {
  return (
    <div className="p-2 border-t border-border/80 space-y-1 bg-card">
      {collapsed ? (
        <button
          type="button"
          onClick={onExpand}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Expand Sidebar"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onOpenCalc}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted text-foreground border border-border/70 transition-colors cursor-pointer"
          >
            <Calculator className="size-3.5 text-primary shrink-0" strokeWidth={1.75} />
            <span className="truncate flex-1">Gold Calculator</span>
            <kbd className="inline-flex h-4 items-center rounded px-1 text-[9px] font-mono font-semibold bg-background border border-border text-muted-foreground">
              F2
            </kbd>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="truncate">Sign Out</span>
          </button>
        </>
      )}
    </div>
  )
}
