import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { HelpCircle, Search, UserCheck, MessageSquare, TrendingUp, Sun, Moon } from 'lucide-react'

export const TopBar: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    setSwitchUserOpen,
    setHelpOpen,
    setCommandOpen,
    setMandiDialogOpen,
    mandi,
  } = useApp()

  const [timeStr, setTimeStr] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: true }))
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const day = days[now.getDay()]
      const dd = String(now.getDate()).padStart(2, '0')
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const yyyy = now.getFullYear()
      setDateStr(`${day}-${dd}/${mm}/${yyyy}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleKacha = () => {
    updateSettings({ kachaMode: !settings.kachaMode })
  }

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }

  return (
    <header className="h-14 border-b border-border bg-card/95 backdrop-blur px-5 flex items-center justify-between select-none z-30 shrink-0 shadow-2xs">
      {/* Left: Brand Identity & Mode */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center font-extrabold tracking-tight text-xs shadow-xs font-sans">
            GK
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-sm text-foreground uppercase leading-none">
              {settings.shopName}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">
              BULLION & JEWELLERY ERP
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-border/80 mx-1" />

        <button
          type="button"
          onClick={toggleKacha}
          className="transition-transform active:scale-95 cursor-pointer"
          title="Click to toggle Kacha / Pakka ledger mode"
        >
          <Badge
            variant={settings.kachaMode ? "secondary" : "default"}
            className={
              settings.kachaMode
                ? "bg-muted text-foreground hover:bg-muted/80 border border-border text-[10px] px-2.5 py-0.5 cursor-pointer font-bold"
                : "bg-foreground text-background hover:bg-foreground/90 text-[10px] px-2.5 py-0.5 cursor-pointer font-extrabold tracking-wider"
            }
          >
            {settings.kachaMode ? 'KACHA' : 'PAKKA'}
          </Badge>
        </button>
      </div>

      {/* Centre: Live Mandi Price Benchmark Pill + Clock */}
      <div className="flex items-center gap-2">
        {/* Mandi Rate Hero Pill (F11) */}
        <button
          type="button"
          onClick={() => setMandiDialogOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-xs text-foreground cursor-pointer shadow-2xs group"
          title="Click or press F11 to refresh or edit Mandi Rates"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">24K Mandi:</span>
          <span className="font-bold text-foreground">
            Rs {mandi.pkrPerTola24k.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">/tola</span>
          <kbd className="pointer-events-none inline-flex h-4 items-center rounded border border-amber-500/30 bg-amber-500/10 px-1.5 text-[9px] text-amber-800 dark:text-amber-300 font-semibold ml-0.5">
            F11
          </kbd>
        </button>

        {/* Live Clock and Date */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs px-3 py-1.5 bg-muted/50 rounded-lg border border-border/80">
          <span className="font-bold text-foreground tracking-wider">{timeStr}</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-muted-foreground font-medium text-[11px]">{dateStr}</span>
        </div>
      </div>

      {/* Right: SMS Status, Search, Help, User */}
      <div className="flex items-center gap-2">
        {/* Command Palette Button (Ctrl+K) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen(true)}
          className="h-8 px-2 text-xs text-muted-foreground gap-1.5"
          title="Search pages, customers and actions"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
          <HotkeyHint hotkey="Ctrl+K" className="h-4 text-[9px]" />
        </Button>

        {/* Help Button (F1) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHelpOpen(true)}
          className="h-8 px-2 text-xs gap-1"
          title="Gold King Help & Hotkey Directory"
        >
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Help</span>
          <HotkeyHint hotkey="F1" className="h-4 text-[9px]" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
          title="Toggle Dark / Light Theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="h-4 w-4 text-zinc-300" />
          ) : (
            <Moon className="h-4 w-4 text-zinc-700" />
          )}
        </Button>

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-2 text-xs">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-foreground text-background font-bold text-[10px]">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block leading-tight">
                <div className="font-semibold text-xs truncate max-w-[100px]">{currentUser.name}</div>
                <div className="text-[10px] text-muted-foreground">{currentUser.role}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-bold">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">Logged in as {currentUser.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSwitchUserOpen(true)} className="gap-2 cursor-pointer">
              <UserCheck className="h-4 w-4" />
              <span>Switch User</span>
              <HotkeyHint hotkey="Ctrl+U" className="ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>
              <span>Theme: {settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
