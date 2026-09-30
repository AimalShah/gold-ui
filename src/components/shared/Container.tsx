import React from "react"
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: Props) {
  return (
    <div className={cn("px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[100rem] mx-auto", className)}>
      {children}
    </div>
  )
}

export default Container
