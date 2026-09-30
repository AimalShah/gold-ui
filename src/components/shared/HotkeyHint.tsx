import React from 'react'
import { cn } from '@/lib/utils'

interface HotkeyHintProps {
  hotkey: string
  className?: string
}

export const HotkeyHint: React.FC<HotkeyHintProps> = ({ hotkey, className }) => {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-sm",
        className
      )}
    >
      {hotkey}
    </kbd>
  )
}
