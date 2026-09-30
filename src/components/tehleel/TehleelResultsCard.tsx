import React from 'react'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Printer, RotateCcw, CheckCircle2 } from 'lucide-react'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'

interface TehleelResultsCardProps {
  karat: number
  permille: number
  purityPercent: number
  pureGoldMg: number
  impurityMg: number
  amountPkr: number
  gramsPerTola: number
  onSave: () => void
  onPrint: () => void
  onZero: () => void
}

export const TehleelResultsCard: React.FC<TehleelResultsCardProps> = ({
  karat,
  permille,
  purityPercent,
  pureGoldMg,
  impurityMg,
  amountPkr,
  gramsPerTola,
  onSave,
  onPrint,
  onZero,
}) => {
  return (
    <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            2. Assay Purity Certificate
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Final fine gold test analysis</p>
        </div>
        <KaratBadge karat={karat} size="lg" />
      </div>

      {/* Large Purity Display */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-center">
        <div className="text-xs font-semibold text-muted-foreground uppercase">Certified Karat Purity</div>
        <div className="text-4xl font-extrabold text-primary font-mono tracking-tight">
          {karat} Karat
        </div>
        <div className="flex items-center justify-center gap-3 text-xs font-mono font-medium text-muted-foreground">
          <span>{permille}‰ Fineness</span>
          <span>·</span>
          <span>{purityPercent.toFixed(2)}% Pure Au</span>
        </div>
      </div>

      {/* Breakdown lines */}
      <div className="space-y-2 text-xs divide-y divide-border">
        <div className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Fine Pure Gold Content:</span>
          <span className="font-mono font-bold text-foreground">
            {formatGrams(pureGoldMg)}g ({formatTMR(pureGoldMg, gramsPerTola)})
          </span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-muted-foreground">Total Impurity / Alloy Loss:</span>
          <span className="font-mono font-bold text-destructive">
            −{formatGrams(impurityMg)}g
          </span>
        </div>
        <div className="flex justify-between py-2 text-sm font-bold border-t border-border">
          <span className="text-foreground">Net Pure Gold Value (PKR):</span>
          <span className="font-mono text-primary text-base">
            {formatMoney(amountPkr)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2 pt-2 border-t border-border">
        <Button onClick={onSave} className="w-full gap-2 font-bold h-10 text-xs shadow-xs">
          <Save className="size-4" /> Save Assay Record <HotkeyHint hotkey="F8" />
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onPrint} className="gap-1.5 text-xs h-9">
            <Printer className="size-3.5" /> Print Certificate <HotkeyHint hotkey="P" />
          </Button>
          <Button variant="ghost" onClick={onZero} className="gap-1.5 text-xs h-9 text-muted-foreground hover:text-destructive">
            <RotateCcw className="size-3.5" /> Reset (F4)
          </Button>
        </div>
      </div>
    </div>
  )
}
