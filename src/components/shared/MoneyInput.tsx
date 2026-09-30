import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface MoneyInputProps {
  value: number
  onChange: (val: number) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  allowNegative?: boolean
  className?: string
  prefix?: string
  tintClass?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  id?: string
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  disabled = false,
  readOnly = false,
  allowNegative = false,
  className,
  prefix = "Rs",
  tintClass,
  autoFocus = false,
  onKeyDown,
  id,
}) => {
  const [displayVal, setDisplayVal] = useState<string>(
    value ? Math.round(value).toLocaleString('en-US') : ''
  )
  const [isNegative, setIsNegative] = useState<boolean>(value < 0)

  useEffect(() => {
    setDisplayVal(value ? Math.abs(Math.round(value)).toLocaleString('en-US') : '')
    setIsNegative(value < 0)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (!raw) {
      setDisplayVal('')
      onChange(0)
      return
    }
    const num = parseInt(raw, 10)
    setDisplayVal(num.toLocaleString('en-US'))
    onChange(isNegative ? -num : num)
  }

  const toggleSign = () => {
    if (!allowNegative || readOnly || disabled) return
    const newSign = !isNegative
    setIsNegative(newSign)
    const raw = displayVal.replace(/[^0-9]/g, '')
    const num = raw ? parseInt(raw, 10) : 0
    onChange(newSign ? -num : num)
  }

  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg border border-border bg-background shadow-2xs transition-all focus-within:ring-1 focus-within:ring-foreground focus-within:border-foreground",
        tintClass,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {allowNegative && (
        <button
          type="button"
          tabIndex={-1}
          onClick={toggleSign}
          className={cn(
            "h-full px-3 text-xs font-mono font-bold border-r border-border hover:bg-muted/80 transition-colors",
            isNegative ? "text-destructive bg-destructive/10" : "text-muted-foreground"
          )}
        >
          {isNegative ? '−' : '+'}
        </button>
      )}
      {prefix && (
        <span className="pl-3 text-xs font-medium text-muted-foreground select-none">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayVal}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        className="border-0 shadow-none text-right font-mono text-base tracking-tight h-10 px-3 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 tabular-nums font-semibold"
      />
    </div>
  )
}
