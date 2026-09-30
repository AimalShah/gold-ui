import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { toParts, fromParts, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { useApp } from '@/context/AppContext'

interface WeightInputProps {
  value: number // in milligrams
  onChange: (mg: number) => void
  label?: string
  tint?: string // e.g. 'tint-row-weight'
  readOnly?: boolean
  disabled?: boolean
  activeUnit?: 'auto' | 'grams' | 'tola'
  allowNegative?: boolean
  compact?: boolean
  onEnter?: () => void
  id?: string
  showHelpers?: boolean
  helperValues?: { mashaCut: number; rattiCut: number; totalCutFraction: number }
  onHelperChange?: (helpers: { mashaCut: number; rattiCut: number; totalCutFraction: number }) => void
}

export const WeightInput: React.FC<WeightInputProps> = ({
  value,
  onChange,
  label,
  tint,
  readOnly = false,
  disabled = false,
  activeUnit,
  allowNegative = false,
  compact = false,
  onEnter,
  showHelpers = false,
  helperValues,
  onHelperChange,
}) => {
  const { settings, unitMode: globalUnitMode } = useApp()
  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA
  const effectiveUnit = activeUnit || globalUnitMode

  // Local parts string state to allow fluid typing and backspacing
  const [tolaStr, setTolaStr] = useState<string>('')
  const [mashaStr, setMashaStr] = useState<string>('')
  const [rattiStr, setRattiStr] = useState<string>('')
  const [gramsStr, setGramsStr] = useState<string>('')

  // Refs for arrow key navigation
  const tolaRef = useRef<HTMLInputElement>(null)
  const mashaRef = useRef<HTMLInputElement>(null)
  const rattiRef = useRef<HTMLInputElement>(null)
  const gramsRef = useRef<HTMLInputElement>(null)

  // Sync from external value
  useEffect(() => {
    if (value === 0) {
      setTolaStr('')
      setMashaStr('')
      setRattiStr('')
      setGramsStr('')
      return
    }

    const parts = toParts(value, gramsPerTola)
    setTolaStr(parts.tola !== 0 ? parts.tola.toString() : '')
    setMashaStr(parts.masha !== 0 ? parts.masha.toString() : '')
    setRattiStr(parts.ratti !== 0 ? parts.ratti.toString() : '')
    setGramsStr(parts.grams !== 0 ? parts.grams.toFixed(settings.weightDecimals || 4) : '')
  }, [value, gramsPerTola, settings.weightDecimals])

  const handleTolaChange = (val: string) => {
    setTolaStr(val)
    const t = parseFloat(val) || 0
    const m = parseFloat(mashaStr) || 0
    const r = parseFloat(rattiStr) || 0
    const mg = fromParts({ tola: t, masha: m, ratti: r }, gramsPerTola)
    onChange(mg)
  }

  const handleMashaChange = (val: string) => {
    setMashaStr(val)
    let m = parseFloat(val) || 0
    let t = parseFloat(tolaStr) || 0
    const r = parseFloat(rattiStr) || 0

    // Carry over if masha >= 12
    if (m >= 12) {
      t += Math.floor(m / 12)
      m = m % 12
      setTolaStr(t.toString())
      setMashaStr(m.toString())
    }

    const mg = fromParts({ tola: t, masha: m, ratti: r }, gramsPerTola)
    onChange(mg)
  }

  const handleRattiChange = (val: string) => {
    setRattiStr(val)
    let r = parseFloat(val) || 0
    let m = parseFloat(mashaStr) || 0
    let t = parseFloat(tolaStr) || 0

    // Carry over if ratti >= 8
    if (r >= 8) {
      const extraMasha = Math.floor(r / 8)
      r = Number((r % 8).toFixed(3))
      m += extraMasha
      if (m >= 12) {
        t += Math.floor(m / 12)
        m = m % 12
        setTolaStr(t.toString())
      }
      setMashaStr(m.toString())
      setRattiStr(r.toString())
    }

    const mg = fromParts({ tola: t, masha: m, ratti: r }, gramsPerTola)
    onChange(mg)
  }

  const handleGramsChange = (val: string) => {
    setGramsStr(val)
    const g = parseFloat(val) || 0
    const mg = Math.round(g * 1000)
    onChange(mg)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentField: 'tola' | 'masha' | 'ratti' | 'grams'
  ) => {
    if (e.key === 'ArrowRight') {
      if (currentField === 'tola') mashaRef.current?.focus()
      else if (currentField === 'masha') rattiRef.current?.focus()
      else if (currentField === 'ratti') gramsRef.current?.focus()
    } else if (e.key === 'ArrowLeft') {
      if (currentField === 'grams') rattiRef.current?.focus()
      else if (currentField === 'ratti') mashaRef.current?.focus()
      else if (currentField === 'masha') tolaRef.current?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (onEnter) onEnter()
    }
  }

  const isGramsLocked = effectiveUnit === 'tola'
  const isTolaLocked = effectiveUnit === 'grams'

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-border bg-card transition-all font-mono shadow-2xs",
        tint,
        compact ? "h-8 text-xs" : "h-11 text-sm",
        readOnly && "bg-muted/40 opacity-90",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Optional Row Label */}
      {label && (
        <div
          className={cn(
            "flex items-center justify-between border-r border-border bg-muted/40 px-3 font-sans font-bold tracking-wider uppercase text-muted-foreground select-none shrink-0",
            compact ? "w-28 text-[10px]" : "w-40 text-xs"
          )}
        >
          <span>{label}</span>
          {showHelpers && (
            <span className="text-[10px] text-muted-foreground font-mono font-medium">/TOLA</span>
          )}
        </div>
      )}

      {/* Optional tiny helper fields (per spec section 6.2 for Cut/Tola and Polish/Tola) */}
      {showHelpers && (
        <div className="flex items-center border-r border-border px-2 gap-1.5 bg-muted/30 shrink-0">
          <input
            type="number"
            placeholder="0"
            className="w-8 h-7 text-center text-xs bg-background border border-border rounded tabular-nums font-semibold"
            value={helperValues?.mashaCut || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0
              onHelperChange?.({
                mashaCut: val,
                rattiCut: helperValues?.rattiCut || 0,
                totalCutFraction: helperValues?.totalCutFraction || 0,
              })
            }}
            title="Helper 1: Cut Masha"
          />
          <span className="text-[10px] font-bold text-muted-foreground">M</span>
          <input
            type="number"
            placeholder="0"
            className="w-8 h-7 text-center text-xs bg-background border border-border rounded tabular-nums font-semibold"
            value={helperValues?.rattiCut || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0
              onHelperChange?.({
                mashaCut: helperValues?.mashaCut || 0,
                rattiCut: val,
                totalCutFraction: helperValues?.totalCutFraction || 0,
              })
            }}
            title="Helper 2: Cut Ratti"
          />
          <span className="text-[10px] font-bold text-muted-foreground">R</span>
        </div>
      )}

      {/* Grid of four linked cells: TOLA | MASHA | RATTI | GRAMS */}
      <div className="grid grid-cols-4 w-full h-full divide-x divide-border/60 text-right">
        {/* TOLA */}
        <div className="relative flex items-center px-2 focus-within:ring-1 focus-within:ring-foreground">
          <input
            ref={tolaRef}
            type="text"
            inputMode="decimal"
            value={tolaStr}
            onChange={(e) => handleTolaChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'tola')}
            placeholder="0"
            disabled={disabled || isTolaLocked}
            readOnly={readOnly}
            className={cn(
              "w-full h-full bg-transparent text-right font-mono pr-4 text-foreground outline-none tabular-nums font-bold disabled:opacity-50",
              compact ? "text-xs" : "text-base"
            )}
          />
          <span className="absolute right-1 text-[10px] text-muted-foreground select-none uppercase font-sans font-bold">
            T
          </span>
        </div>

        {/* MASHA */}
        <div className="relative flex items-center px-2 focus-within:ring-1 focus-within:ring-foreground">
          <input
            ref={mashaRef}
            type="text"
            inputMode="decimal"
            value={mashaStr}
            onChange={(e) => handleMashaChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'masha')}
            placeholder="0"
            disabled={disabled || isTolaLocked}
            readOnly={readOnly}
            className={cn(
              "w-full h-full bg-transparent text-right font-mono pr-4 text-foreground outline-none tabular-nums font-bold disabled:opacity-50",
              compact ? "text-xs" : "text-base"
            )}
          />
          <span className="absolute right-1 text-[10px] text-muted-foreground select-none uppercase font-sans font-bold">
            M
          </span>
        </div>

        {/* RATTI */}
        <div className="relative flex items-center px-2 focus-within:ring-1 focus-within:ring-foreground">
          <input
            ref={rattiRef}
            type="text"
            inputMode="decimal"
            value={rattiStr}
            onChange={(e) => handleRattiChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'ratti')}
            placeholder="0.00"
            disabled={disabled || isTolaLocked}
            readOnly={readOnly}
            className={cn(
              "w-full h-full bg-transparent text-right font-mono pr-4 text-foreground outline-none tabular-nums font-bold disabled:opacity-50",
              compact ? "text-xs" : "text-base"
            )}
          />
          <span className="absolute right-1 text-[10px] text-muted-foreground select-none uppercase font-sans font-bold">
            R
          </span>
        </div>

        {/* GRAMS */}
        <div className="relative flex items-center px-2 focus-within:ring-1 focus-within:ring-foreground bg-muted/20">
          <input
            ref={gramsRef}
            type="text"
            inputMode="decimal"
            value={gramsStr}
            onChange={(e) => handleGramsChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'grams')}
            placeholder="0.000"
            disabled={disabled || isGramsLocked}
            readOnly={readOnly}
            className={cn(
              "w-full h-full bg-transparent text-right font-mono pr-4 text-foreground outline-none tabular-nums font-extrabold tracking-tight disabled:opacity-50",
              compact ? "text-xs" : "text-base"
            )}
          />
          <span className="absolute right-1 text-[10px] text-foreground select-none uppercase font-sans font-bold">
            g
          </span>
        </div>
      </div>
    </div>
  )
}
