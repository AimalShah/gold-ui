import React from 'react'
import { Store, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarNavProps {
  appMode: 'pos' | 'backoffice'
  onSwitchToPos: () => void
  onSwitchToBackOffice: () => void
}

export const TopBarNav: React.FC<TopBarNavProps> = ({
  appMode,
  onSwitchToPos,
  onSwitchToBackOffice,
}) => {
  return (
    <nav className="flex items-center rounded-xl bg-muted/60 p-1 border border-border shrink-0">
      <button
        type="button"
        onClick={onSwitchToPos}
        className={cn(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
          appMode === 'pos'
            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Store className="size-3.5" />
        <span>POS</span>
      </button>

      <button
        type="button"
        onClick={onSwitchToBackOffice}
        className={cn(
          'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
          appMode === 'backoffice'
            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutDashboard className="size-3.5" />
        <span>DASHBOARD</span>
      </button>
    </nav>
  )
}
