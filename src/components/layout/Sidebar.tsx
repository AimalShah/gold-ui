import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import {
  MdOutlineDashboard,
  MdOutlineShoppingCart,
  MdOutlineReceiptLong,
} from 'react-icons/md'
import { LuUsers } from 'react-icons/lu'
import { TbTruckDelivery, TbTag, TbFlame, TbScale, TbCalculator } from 'react-icons/tb'
import { RiCoupon2Line, RiExchangeLine } from 'react-icons/ri'
import { HiOutlineChartBar, HiOutlineCog6Tooth } from 'react-icons/hi2'
import { FiMessageSquare, FiLogOut } from 'react-icons/fi'
import { FaBagShopping } from 'react-icons/fa6'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  id: string
  title: string
  icon: React.ReactNode
  badge?: string
  hotkey?: string
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setCalcOpen,
    setMixingDialogOpen,
    setMandiDialogOpen,
    settings,
    setSwitchUserOpen,
    appMode,
    switchToBackOffice,
    switchToPos,
    isManagerUnlocked,
  } = useApp()

  const [collapsed, setCollapsed] = useState(false)

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <MdOutlineDashboard className="size-5 shrink-0" />,
      hotkey: 'Alt+1',
    },
    {
      id: 'billing',
      title: 'POS Billing',
      icon: <MdOutlineShoppingCart className="size-5 shrink-0" />,
      badge: 'Core',
    },
    {
      id: 'inventory',
      title: 'Products / Stock',
      icon: <TbTag className="size-5 shrink-0" />,
      hotkey: 'Alt+I',
    },
    {
      id: 'bills',
      title: 'Bills & Invoices',
      icon: <MdOutlineReceiptLong className="size-5 shrink-0" />,
      hotkey: 'S',
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: <LuUsers className="size-5 shrink-0" />,
      hotkey: 'C',
    },
    {
      id: 'orders',
      title: 'Custom Orders',
      icon: <TbTruckDelivery className="size-5 shrink-0" />,
      hotkey: 'F3',
    },
    {
      id: 'tehleel',
      title: 'Karat Assay / Tehleel',
      icon: <TbFlame className="size-5 shrink-0" />,
      hotkey: 'K+T',
    },
    {
      id: 'mixing',
      title: 'Alloy Mixing',
      icon: <RiExchangeLine className="size-5 shrink-0" />,
      hotkey: 'M',
    },
    {
      id: 'accounts',
      title: 'Accounts / Daybook',
      icon: <TbScale className="size-5 shrink-0" />,
      hotkey: 'F6',
    },
    {
      id: 'reports',
      title: 'Reports & P&L',
      icon: <HiOutlineChartBar className="size-5 shrink-0" />,
      hotkey: 'Alt+R',
    },
    {
      id: 'mandi',
      title: 'Mandi Live Rates',
      icon: <TbScale className="size-5 shrink-0" />,
      hotkey: 'F11',
    },
    {
      id: 'sms',
      title: 'SMS Alerts',
      icon: <FiMessageSquare className="size-5 shrink-0" />,
      hotkey: 'F10',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <HiOutlineCog6Tooth className="size-5 shrink-0" />,
      hotkey: 'F12',
    },
  ]

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'billing') {
      switchToPos()
      return
    }
    if (item.id === 'mandi') {
      setMandiDialogOpen(true)
      return
    }
    if (item.id === 'mixing') {
      setMixingDialogOpen(true)
      return
    }

    if (!isManagerUnlocked) {
      switchToBackOffice()
      return
    }

    setCurrentPage(item.id)
  }

  return (
    <aside
      className={cn(
        "border-r border-border bg-card flex flex-col justify-between transition-all duration-200 select-none shrink-0 z-20 shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Brand Identity */}
      <div className={cn(
        "h-16 px-4 flex items-center border-b border-border gap-3",
        collapsed ? "justify-center px-2" : "justify-between"
      )}>
        <button
          type="button"
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-3 text-left overflow-hidden cursor-pointer group"
        >
          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-sm shadow-primary/25 shrink-0 group-hover:scale-105 transition-transform">
            <FaBagShopping className="size-4.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm leading-tight tracking-tight text-foreground truncate">
                {settings.shopName || "ISLAM JEWELLERS"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium truncate">
                Jewellery ERP Admin
              </span>
            </div>
          )}
        </button>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-3 px-2.5 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              title={collapsed ? `${item.title} (${item.hotkey || ''})` : undefined}
              className={cn(
                "relative w-full flex items-center gap-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group cursor-pointer",
                isActive
                  ? "bg-primary/15 text-primary font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <div className={cn(
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.icon}
              </div>

              {!collapsed && (
                <>
                  <span className="truncate flex-1 tracking-tight">{item.title}</span>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {item.hotkey && !item.badge && (
                    <kbd className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors",
                      isActive
                        ? "bg-primary/20 border-primary/40 text-primary font-semibold"
                        : "bg-muted/40 border-border/60 text-muted-foreground"
                    )}>
                      {item.hotkey}
                    </kbd>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom Actions: Quick Calculator & User/Switch */}
      <div className="p-3 border-t border-border space-y-2 bg-card">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setCalcOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground border border-border transition-colors cursor-pointer"
            >
              <TbCalculator className="size-4 text-primary shrink-0" />
              <span className="truncate flex-1">Gold Calculator</span>
              <kbd className="inline-flex h-4 items-center rounded px-1.5 text-[9px] font-semibold bg-background border border-border text-muted-foreground">
                F2
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSwitchUserOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <FiLogOut className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">Switch / Sign Out</span>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
export default Sidebar
