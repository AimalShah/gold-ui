import React from 'react'
import { useApp } from '@/context/AppContext'
import { Gem } from 'lucide-react'
import { useDigitalClock } from '@/hooks/useDigitalClock'
import { TopBarNav } from '@/components/layout/TopBarNav'
import { TopBarActions } from '@/components/layout/TopBarActions'

export const TopBar: React.FC = () => {
  const {
    settings,
    updateSettings,
    appMode,
    switchToBackOffice,
    switchToPos,
    setHelpOpen,
  } = useApp()

  const timeStr = useDigitalClock()

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <header className="w-full bg-card h-14 border-b border-border px-3 md:px-5 flex items-center justify-between select-none shrink-0 z-30 gap-3">
      {/* Left: Brand + Navigation */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
            <Gem className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground hidden sm:inline truncate max-w-[180px]">
            {settings.shopName || 'ISLAM JEWELLERS'}
          </span>
        </div>

        <TopBarNav
          appMode={appMode}
          onSwitchToPos={switchToPos}
          onSwitchToBackOffice={switchToBackOffice}
        />
      </div>

      {/* Right: Actions (Clock, Help, Notifications, Theme) */}
      <TopBarActions
        timeStr={timeStr}
        theme={settings.theme}
        onToggleTheme={toggleTheme}
        onHelpOpen={() => setHelpOpen(true)}
      />
    </header>
  )
}

export default TopBar
