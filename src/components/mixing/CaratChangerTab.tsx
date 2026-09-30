import React from 'react'
import { WeightInput } from '@/components/shared/WeightInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw } from 'lucide-react'
import { formatGrams, formatTMR } from '@/lib/gold-math'
import { useMixingForm } from '@/hooks/useMixingForm'

interface CaratChangerTabProps {
  form: ReturnType<typeof useMixingForm>
}

export const CaratChangerTab: React.FC<CaratChangerTabProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters (7 cols) */}
      <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
        <div className="border-b border-border pb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Karat Conversion Standard Engine
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Convert standard purity grades (e.g. 24K pure bullion to 22K/21K/18K ornaments).
          </p>
        </div>

        {/* Starting Weight */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground">Starting Gold Weight</label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatTMR(form.changerWeightMg, form.gramsPerTola)}
            </span>
          </div>
          <WeightInput
            value={form.changerWeightMg}
            onChange={form.setChangerWeightMg}
            activeUnit={form.unitMode}
          />
        </div>

        {/* Karat conversion from and to */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 p-4 rounded-lg bg-muted/40 border border-border">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-foreground">Current Karat (From)</label>
              <KaratBadge karat={form.fromCarat} size="sm" />
            </div>
            <Input
              type="number"
              step="0.1"
              value={form.fromCarat}
              onChange={(e) => form.setFromCarat(parseFloat(e.target.value) || 0)}
              className="h-10 text-base font-mono font-bold"
            />
            <p className="text-[11px] text-muted-foreground">
              Tezabi (24K) or starting purity
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-muted/40 border border-border">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-foreground">Target Karat (To)</label>
              <KaratBadge karat={form.toCarat} size="sm" />
            </div>
            <Input
              type="number"
              step="0.1"
              value={form.toCarat}
              onChange={(e) => form.setToCarat(parseFloat(e.target.value) || 0)}
              className="h-10 text-base font-mono font-bold"
            />
            <p className="text-[11px] text-muted-foreground">
              Desired ornament purity standard
            </p>
          </div>
        </div>
      </div>

      {/* Results Card (5 cols) */}
      <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Alloy Requirement
          </h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              form.isAddingAlloy
                ? 'bg-amber-500/10 text-amber-600'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {form.isAddingAlloy ? 'Add Alloy (+)' : 'Refine Gold (−)'}
          </span>
        </div>

        {/* Hero Readout */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            {form.isAddingAlloy ? 'Passa / Alloy Addition' : 'Gold To Remove'}
          </div>
          <div className="text-3xl font-extrabold text-primary font-mono tracking-tight">
            {formatGrams(form.changerPassaMg)} Grams
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {formatTMR(form.changerPassaMg, form.gramsPerTola)}
          </div>
        </div>

        {/* Results summary breakdown */}
        <div className="space-y-2 text-xs divide-y divide-border">
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Original Gold Weight:</span>
            <span className="font-mono font-bold text-foreground">
              {formatGrams(form.changerWeightMg)}g
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">From / To Karat Ratio:</span>
            <span className="font-mono font-semibold text-foreground">
              {form.fromCarat}K → {form.toCarat}K
            </span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold border-t border-border">
            <span className="text-foreground">New Total Ingot Weight:</span>
            <span className="font-mono text-primary">
              {formatGrams(form.targetWeightMg)}g ({formatTMR(form.targetWeightMg, form.gramsPerTola)})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <Button onClick={form.handleSaveRecord} className="gap-1.5 font-bold h-9 text-xs">
            <Save className="size-3.5" /> Save Formula
          </Button>
          <Button
            variant="outline"
            onClick={form.handleZero}
            className="gap-1.5 text-xs h-9 text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="size-3.5" /> Reset (F4)
          </Button>
        </div>
      </div>
    </div>
  )
}
