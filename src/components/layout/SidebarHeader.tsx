import React from 'react'
import { Gem, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  collapsed: boolean
  shopName: string
  onCollapse: () => void
  onDashboard: () => void
}

export const SidebarHeader: React.FC<Props> = ({
  collapsed,
  shopName,
  onCollapse,
  onDashboard,
}) => {
  return (
    <div
      className={cn(
        'h-14 px-3 flex items-center border-b border-border/80 gap-2.5',
        collapsed ? 'justify-center px-2' : 'justify-between'
      )}
    >
      <button
        type="button"
        onClick={onDashboard}
        className="flex items-center gap-2.5 text-left overflow-hidden cursor-pointer group"
      >
        <div className="size-8 rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Gem className="size-4" strokeWidth={1.75} />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs tracking-tight text-foreground truncate uppercase">
              {shopName || 'ISLAM JEWELLERS'}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium truncate">
              Gold POS & Treasury
            </span>
          </div>
        )}
      </button>

      {!collapsed && (
        <button
          type="button"
          onClick={onCollapse}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}
