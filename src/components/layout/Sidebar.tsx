import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import {
  LayoutDashboard,
  Receipt,
  Users,
  ScrollText,
  Hammer,
  BookOpen,
  BarChart3,
  Boxes,
  TrendingUp,
  MessageSquare,
  Settings,
  Calculator,
  Flame,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  hotkey?: string
  badge?: string
}

interface NavSection {
  id: string
  title: string
  items: NavItem[]
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setCalcOpen,
    setMixingDialogOpen,
  } = useApp()

  const [collapsed, setCollapsed] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    trading: true,
    workshop: true,
    inventory: true,
    finance: true,
    system: false, // collapsed by default to reduce congestion!
  })

  const sections: NavSection[] = [
    {
      id: 'trading',
      title: 'Trading & POS',
      items: [
        { id: 'billing', label: 'Billing Main', icon: Receipt, hotkey: 'Alt+B', badge: 'Core' },
        { id: 'bills', label: 'Bills Register', icon: ScrollText, hotkey: 'S' },
        { id: 'customers', label: 'Customers & Ledger', icon: Users, hotkey: 'C' },
      ],
    },
    {
      id: 'workshop',
      title: 'Workshop & Assay',
      items: [
        { id: 'orders', label: 'Orders & Works', icon: Hammer, hotkey: 'F3' },
        { id: 'tehleel', label: 'Gold Karat / Tehleel', icon: Flame, hotkey: 'K+T' },
        { id: 'mixing', label: 'Mixing & Changer', icon: Shuffle, hotkey: 'M' },
      ],
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock',
      items: [
        { id: 'inventory', label: 'Stock Overview', icon: Boxes, hotkey: 'Alt+I' },
      ],
    },
    {
      id: 'finance',
      title: 'Finance & Accounts',
      items: [
        { id: 'accounts', label: 'Day Book (Roznamcha)', icon: BookOpen, hotkey: 'F6' },
        { id: 'reports', label: 'Financial Reports', icon: BarChart3, hotkey: 'Alt+R' },
      ],
    },
    {
      id: 'system',
      title: 'System & Mandi',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, hotkey: 'Alt+1' },
        { id: 'rates', label: 'Mandi Live Rates', icon: TrendingUp, hotkey: 'F11' },
        { id: 'sms', label: 'SMS Portal', icon: MessageSquare, hotkey: 'F10' },
        { id: 'settings', label: 'Settings', icon: Settings, hotkey: 'Ctrl+F12' },
      ],
    },
  ]

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'mixing') {
      setMixingDialogOpen(true)
      return
    }
    setCurrentPage(item.id)
  }

  return (
    <aside
      className={cn(
        "border-r border-border bg-card flex flex-col justify-between transition-all duration-200 select-none shrink-0 z-20",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Scrollable Navigation Sections */}
      <div className="flex-1 py-2 overflow-y-auto px-2 space-y-3">
        {sections.map((section) => {
          const isOpen = openSections[section.id]
          const hasActiveItem = section.items.some((i) => i.id === currentPage)

          return (
            <div key={section.id} className="space-y-1">
              {/* Section Header (Expandable / Collapsible) */}
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    {hasActiveItem && (
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    )}
                    {section.title}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground group-hover:text-foreground">
                    <span className="text-[9px] font-mono opacity-60">
                      {section.items.length}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </div>
                </button>
              ) : (
                <div className="h-px bg-border my-1.5 mx-1" />
              )}

              {/* Section Items (shown if open or if whole sidebar is collapsed) */}
              {(isOpen || collapsed) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPage === item.id

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left group relative",
                          isActive
                            ? "bg-foreground text-background font-bold shadow-xs"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        )}
                        title={collapsed ? `${item.label} (${item.hotkey || ''})` : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform",
                            isActive
                              ? "text-background"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 tracking-tight">{item.label}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  "text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase tracking-wider",
                                  isActive
                                    ? "bg-background/20 text-background"
                                    : "bg-muted text-foreground border border-border"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.hotkey && (
                              <kbd
                                className={cn(
                                  "pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded px-1 font-mono text-[9px] font-semibold border ml-auto",
                                  isActive
                                    ? "bg-background/15 text-background border-background/25"
                                    : "bg-muted text-muted-foreground border-border"
                                )}
                              >
                                {item.hotkey}
                              </kbd>
                            )}
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Calculator launcher & Collapse Toggle */}
      <div className="p-2 border-t border-border space-y-1 bg-card">
        <button
          type="button"
          onClick={() => setCalcOpen(true)}
          className={cn(
            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-muted/80 hover:bg-muted text-foreground border border-border transition-colors cursor-pointer",
            collapsed && "justify-center px-0"
          )}
          title="Open 10-Row Weight Calculator (F2)"
        >
          <Calculator className="h-4 w-4 shrink-0 text-foreground" />
          {!collapsed && (
            <>
              <span className="truncate flex-1">Quick Calculator</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded px-1 font-mono text-[9px] font-semibold bg-background border border-border text-muted-foreground ml-auto">
                F2
              </kbd>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
