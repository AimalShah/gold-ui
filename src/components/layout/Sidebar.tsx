import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { SidebarHeader } from './SidebarHeader'
import { SidebarNavList, NavItemConfig } from './SidebarNavList'
import { SidebarFooter } from './SidebarFooter'

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setCalcOpen,
    setMixingDialogOpen,
    setMandiDialogOpen,
    settings,
    setSwitchUserOpen,
    switchToBackOffice,
    switchToPos,
    isManagerUnlocked,
  } = useApp()

  const [collapsed, setCollapsed] = useState(false)

  const handleNavClick = (item: NavItemConfig) => {
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
        'border-r border-border bg-card flex flex-col justify-between transition-all duration-200 select-none shrink-0 z-20 shadow-2xs',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        shopName={settings.shopName}
        onCollapse={() => setCollapsed(true)}
        onDashboard={() => setCurrentPage('dashboard')}
      />

      <SidebarNavList
        collapsed={collapsed}
        currentPage={currentPage}
        onNavigate={handleNavClick}
      />

      <SidebarFooter
        collapsed={collapsed}
        onExpand={() => setCollapsed(false)}
        onOpenCalc={() => setCalcOpen(true)}
        onSignOut={() => setSwitchUserOpen(true)}
      />
    </aside>
  )
}

export default Sidebar
