import React from "react"
import { cn } from "@/lib/utils"

type Props = {
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
  description?: string
  action?: React.ReactNode
}

export function PageTitle({
  title,
  children,
  className,
  description,
  action,
}: Props) {
  // If title prop is passed, heading is title, and children can be action slot if action not passed
  const heading = title || (typeof children === 'string' ? children : null)
  const actionSlot = action || (title ? children : null)

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {heading}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      {actionSlot && (
        <div className="flex items-center gap-3 shrink-0">
          {actionSlot}
        </div>
      )}
    </div>
  )
}

export default PageTitle
