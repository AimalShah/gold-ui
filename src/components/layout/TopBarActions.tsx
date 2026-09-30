import React from 'react'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Bell, HelpCircle } from 'lucide-react'

interface TopBarActionsProps {
  timeStr: string
  theme: string
  onToggleTheme: () => void
  onHelpOpen: () => void
}

export const TopBarActions: React.FC<TopBarActionsProps> = ({
  timeStr,
  theme,
  onToggleTheme,
  onHelpOpen,
}) => {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Live Digital Clock */}
      <span className="hidden sm:inline font-mono text-xs text-muted-foreground px-2.5 py-1 rounded-md bg-muted/40 font-medium">
        {timeStr}
      </span>

      {/* Help Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onHelpOpen}
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
        onClick={onToggleTheme}
        className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
    </div>
  )
}
