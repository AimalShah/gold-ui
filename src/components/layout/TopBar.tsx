import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import {
  Sun,
  Moon,
  Store,
  LayoutDashboard,
  Bell,
  HelpCircle,
  Gem,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const TopBar: React.FC = () => {
  const {
    settings,
    updateSettings,
    appMode,
    switchToBackOffice,
    switchToPos,
    setHelpOpen,
  } = useApp()

  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <header className="w-full bg-card h-14 border-b border-border px-3 md:px-5 flex items-center justify-between select-none shrink-0 z-30 gap-3">
      {/* Left: Brand + 2-Tab Navigation */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
            <Gem className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground hidden sm:inline truncate max-w-[180px]">
            {settings.shopName || 'ISLAM JEWELLERS'}
          </span>
        </div>

        {/* POS & DASHBOARD NAVIGATION TABS */}
        <nav className="flex items-center rounded-xl bg-muted/60 p-1 border border-border shrink-0">
          <button
            type="button"
            onClick={switchToPos}
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
            onClick={switchToBackOffice}
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
      </div>

      {/* Right: Clock + Help + Notification + Theme */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Live Digital Clock */}
        <span className="hidden sm:inline font-mono text-xs text-muted-foreground px-2.5 py-1 rounded-md bg-muted/40 font-medium">
          {timeStr || '05:00:00 PM'}
        </span>

        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHelpOpen(true)}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          title="Keyboard Shortcuts & Help (F1)"
        >
          <HelpCircle className="size-4" />
        </Button>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground relative"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {settings.theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  )
}

export default TopBar
