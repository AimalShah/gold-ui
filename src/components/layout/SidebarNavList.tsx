import React from 'react'
import {
  LayoutDashboard,
  Receipt,
  Package,
  FileText,
  Users,
  Truck,
  Flame,
  ArrowLeftRight,
  BookOpen,
  BarChart3,
  Coins,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavItemConfig {
  id: string
  title: string
  icon: React.ReactNode
  badge?: string
  hotkey?: string
}

export const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', title: 'Dashboard', icon: <LayoutDashboard className="size-4" strokeWidth={1.75} />, hotkey: 'Alt+1' },
  { id: 'billing', title: 'POS Billing', icon: <Receipt className="size-4" strokeWidth={1.75} />, badge: 'Core' },
  { id: 'inventory', title: 'Products / Stock', icon: <Package className="size-4" strokeWidth={1.75} />, hotkey: 'Alt+I' },
  { id: 'bills', title: 'Bills & Invoices', icon: <FileText className="size-4" strokeWidth={1.75} />, hotkey: 'S' },
  { id: 'customers', title: 'Customers', icon: <Users className="size-4" strokeWidth={1.75} />, hotkey: 'C' },
  { id: 'orders', title: 'Custom Orders', icon: <Truck className="size-4" strokeWidth={1.75} />, hotkey: 'F3' },
  { id: 'tehleel', title: 'Karat Assay / Tehleel', icon: <Flame className="size-4" strokeWidth={1.75} />, hotkey: 'K+T' },
  { id: 'mixing', title: 'Alloy Mixing', icon: <ArrowLeftRight className="size-4" strokeWidth={1.75} />, hotkey: 'M' },
  { id: 'accounts', title: 'Accounts / Daybook', icon: <BookOpen className="size-4" strokeWidth={1.75} />, hotkey: 'F6' },
  { id: 'reports', title: 'Reports & P&L', icon: <BarChart3 className="size-4" strokeWidth={1.75} />, hotkey: 'Alt+R' },
  { id: 'mandi', title: 'Mandi Live Rates', icon: <Coins className="size-4" strokeWidth={1.75} />, hotkey: 'F11' },
  { id: 'sms', title: 'SMS Alerts', icon: <MessageSquare className="size-4" strokeWidth={1.75} />, hotkey: 'F10' },
  { id: 'settings', title: 'Settings', icon: <Settings className="size-4" strokeWidth={1.75} />, hotkey: 'F12' },
]

interface Props {
  collapsed: boolean
  currentPage: string
  onNavigate: (item: NavItemConfig) => void
}

export const SidebarNavList: React.FC<Props> = ({ collapsed, currentPage, onNavigate }) => {
  return (
    <div className="flex-1 py-2 px-2 overflow-y-auto space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item)}
            title={collapsed ? `${item.title} (${item.hotkey || ''})` : undefined}
            className={cn(
              'relative w-full flex items-center gap-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left group cursor-pointer',
              isActive
                ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-2xs'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              collapsed && 'justify-center px-1.5'
            )}
          >
            <div className={cn('transition-colors shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}>
              {item.icon}
            </div>

            {!collapsed && (
              <>
                <span className="truncate flex-1 tracking-tight">{item.title}</span>
                {item.badge && (
                  <span className={cn('text-[10px] px-1.5 py-0.2 rounded font-semibold', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                    {item.badge}
                  </span>
                )}
                {item.hotkey && !item.badge && (
                  <kbd className="text-[9px] font-mono px-1 py-0.5 rounded border border-border/70 text-muted-foreground bg-background/50">
                    {item.hotkey}
                  </kbd>
                )}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
