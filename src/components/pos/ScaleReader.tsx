import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatTMR, DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Scale,
  ArrowDownToLine,
  Lock,
  Unlock,
  Sliders,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface ScaleReaderProps {
  onCaptureWeight: (weightMg: number) => void
  currentWeighedWeightMg?: number
}

export const ScaleReader: React.FC<ScaleReaderProps> = ({
  onCaptureWeight,
  currentWeighedWeightMg = 0,
}) => {
  const {
    scaleState,
    setScaleState,
    tareScale,
    setSimulatedScaleWeight,
    settings,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA
  const [showPresets, setShowPresets] = useState(false)
  const [isHeld, setIsHeld] = useState(false)

  const handleTare = () => {
    tareScale()
    toast.success('Scale set to 0.000g (Tare)')
  }

  const handleCapture = () => {
    if (scaleState.weightMg <= 0) {
      toast.error('Scale reading is zero. Place an item on the scale pan.')
      return
    }
    onCaptureWeight(scaleState.weightMg)
    toast.success(`Captured ${formatGrams(scaleState.weightMg, 3)}g from scale`)
  }

  const handleHoldToggle = () => {
    setIsHeld(!isHeld)
    toast.info(isHeld ? 'Scale hold released' : 'Scale reading held')
  }

  const samplePresets = [
    { label: 'Gold Ring', weightMg: 4350 },
    { label: 'Gold Chain', weightMg: 12420 },
    { label: 'Gold Bangle', weightMg: 24580 },
    { label: 'Necklace Set', weightMg: 48250 },
    { label: '1 Tola Bar', weightMg: Math.round(gramsPerTola * 1000) },
    { label: '5 Tola Bar', weightMg: Math.round(gramsPerTola * 5000) },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Digital Weighing Scale
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            ({scaleState.port})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-xs px-2.5 py-1 rounded border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            {showPresets ? 'Hide Test Weights' : 'Test Weights'}
          </button>
          <Badge
            variant={scaleState.isStable ? 'outline' : 'secondary'}
            className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5"
          >
            {isHeld ? 'HELD' : scaleState.isStable ? 'STABLE' : 'MOTION'}
          </Badge>
        </div>
      </div>

      {/* Clean Monochromatic Display */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
          <span>Mode: Gross Weight</span>
          <span>Precision: 0.001 Gram</span>
        </div>

        <div className="my-3 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight tabular-nums">
              {formatGrams(scaleState.weightMg, 3)}
            </span>
            <span className="text-xl font-semibold text-muted-foreground">
              Grams
            </span>
          </div>

          <div className="text-right font-mono">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Tola Equivalent
            </div>
            <div className="text-base font-bold text-foreground tabular-nums">
              {formatTMR(scaleState.weightMg, gramsPerTola)}
            </div>
          </div>
        </div>

        {/* Scale Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTare}
              className="h-8 text-xs font-mono font-medium cursor-pointer"
            >
              Tare Scale
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleHoldToggle}
              className="h-8 text-xs font-mono font-medium cursor-pointer"
            >
              {isHeld ? 'Unhold' : 'Hold'}
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleCapture}
            className="h-8 text-xs gap-1.5 font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-xs"
          >
            <ArrowDownToLine className="size-3.5" />
            <span>Use Scale Weight in Bill</span>
          </Button>
        </div>
      </div>

      {/* Test Weights Presets */}
      {showPresets && (
        <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-1.5">
          <div className="text-[11px] font-medium text-muted-foreground">
            Click any test weight to simulate item placed on scale:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {samplePresets.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSimulatedScaleWeight(item.weightMg)}
                className="py-1.5 px-2 rounded border border-border bg-background hover:bg-muted text-left transition-colors cursor-pointer"
              >
                <div className="text-xs font-medium text-foreground truncate">{item.label}</div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  {(item.weightMg / 1000).toFixed(3)}g
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScaleReader
