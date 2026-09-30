import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { Sparkles } from 'lucide-react'

interface FixCaratModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCarat: number
  onApplyCarat: (carat: number) => void
}

export const FixCaratModal: React.FC<FixCaratModalProps> = ({
  open,
  onOpenChange,
  currentCarat,
  onApplyCarat,
}) => {
  const [caratVal, setCaratVal] = useState<string>(currentCarat.toString())
  const [mode, setMode] = useState<'karat' | 'permille'>('karat')

  const parsedCarat = mode === 'karat'
    ? parseFloat(caratVal) || 24
    : ((parseFloat(caratVal) || 1000) / 1000) * 24

  const quickPresets = [
    { label: '24K (Pure Gold 999.9)', karat: 24 },
    { label: '22K (Standard Jewellery 916)', karat: 22 },
    { label: '21K (Gulf / Arab Standard 875)', karat: 21 },
    { label: '20.18K (Recording Assay 841)', karat: 20.18 },
    { label: '18K (Western / Diamond 750)', karat: 18 },
  ]

  const handleApply = () => {
    onApplyCarat(Number(parsedCarat.toFixed(2)))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Fix Carat & Purity (F)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Standard Purity Presets</Label>
            <div className="grid grid-cols-1 gap-1.5">
              {quickPresets.map((p) => (
                <button
                  key={p.karat}
                  type="button"
                  onClick={() => {
                    setCaratVal(p.karat.toString())
                    setMode('karat')
                  }}
                  className={`p-2 rounded border flex items-center justify-between transition-colors text-xs ${
                    Math.abs(parsedCarat - p.karat) < 0.05
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <span>{p.label}</span>
                  <KaratBadge karat={p.karat} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs">Entry Mode</Label>
              <div className="flex rounded-md border p-0.5 bg-muted">
                <button
                  type="button"
                  onClick={() => {
                    setCaratVal(parsedCarat.toFixed(2))
                    setMode('karat')
                  }}
                  className={`flex-1 py-1 text-center rounded font-semibold text-xs ${
                    mode === 'karat' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Karat (0-24)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCaratVal(Math.round((parsedCarat / 24) * 1000).toString())
                    setMode('permille')
                  }}
                  className={`flex-1 py-1 text-center rounded font-semibold text-xs ${
                    mode === 'permille' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Per-mille (‰)
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{mode === 'karat' ? 'Karat Value' : 'Per-mille (‰)'}</Label>
              <Input
                type="number"
                step="any"
                value={caratVal}
                onChange={(e) => setCaratVal(e.target.value)}
                className="h-8 font-mono text-right text-sm font-bold"
                autoFocus
              />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-md flex items-center justify-between">
            <span className="font-semibold text-muted-foreground">Resulting Purity:</span>
            <KaratBadge karat={parsedCarat} size="md" />
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            Apply Carat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
