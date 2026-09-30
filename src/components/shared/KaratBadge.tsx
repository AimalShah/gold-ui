import React from 'react'
import { cn } from '@/lib/utils'

interface KaratBadgeProps {
  karat: number
  permille?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const KaratBadge: React.FC<KaratBadgeProps> = ({
  karat,
  permille,
  className,
  size = 'md',
}) => {
  const calculatedPermille = permille ?? Math.round((karat / 24) * 1000)

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded border border-border bg-muted/50 font-mono text-foreground shadow-2xs select-none",
        size === 'sm' && "px-1.5 py-0.5 text-xs",
        size === 'md' && "px-2 py-0.5 text-xs",
        size === 'lg' && "px-3 py-1.5 text-base",
        className
      )}
    >
      <span className="font-bold tracking-tight leading-tight">
        {karat.toFixed(karat % 1 === 0 ? 0 : 2)}K
      </span>
      <span className="text-[10px] text-muted-foreground font-mono leading-none">
        {calculatedPermille}‰
      </span>
    </div>
  )
}
