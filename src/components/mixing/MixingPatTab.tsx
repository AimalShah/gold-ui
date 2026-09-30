import React from 'react'
import { WeightInput } from '@/components/shared/WeightInput'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shuffle, Scissors, Save, RotateCcw } from 'lucide-react'
import { formatGrams, formatTMR } from '@/lib/gold-math'
import { useMixingForm } from '@/hooks/useMixingForm'

interface MixingPatTabProps {
  form: ReturnType<typeof useMixingForm>
}

export const MixingPatTab: React.FC<MixingPatTabProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters Form (7 cols) */}
      <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
            {form.activeTab === 'cutting' ? (
              <Scissors className="h-4 w-4 text-primary" />
            ) : (
              <Shuffle className="h-4 w-4 text-primary" />
            )}
            {form.activeTab === 'cutting' ? 'Cutting Mail Reduction' : 'Pure Gold & Alloy Parameters'}
          </h3>
          <Badge variant="outline" className="text-xs font-mono">
            {form.tolas.toFixed(3)} Tolas
          </Badge>
        </div>

        {/* Pure Gold Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground">
              {form.activeTab === 'cutting' ? 'Mixed Gold Starting Weight' : 'Pure Gold (Tezabi) Weight'}
            </label>
            <span className="text-[11px] font-mono text-muted-foreground">
              {formatTMR(form.weightMg, form.gramsPerTola)}
            </span>
          </div>
          <WeightInput value={form.weightMg} onChange={form.setWeightMg} activeUnit={form.unitMode} />
        </div>

        {/* PAT / Tola & Extra Passa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              PAT per Tola Rate (Mail Rate)
            </label>
            <WeightInput value={form.patPerTolaMg} onChange={form.setPatPerTolaMg} activeUnit={form.unitMode} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Extra Passa Addition</label>
            <WeightInput value={form.passaMg} onChange={form.setPassaMg} activeUnit={form.unitMode} />
          </div>
        </div>

        {/* Mail Mode Toggle */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-foreground">Mail Calculation Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => form.setMailMode('inner')}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                form.mailMode === 'inner'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              Inner Mail (I)
            </button>
            <button
              type="button"
              onClick={() => form.setMailMode('outer')}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                form.mailMode === 'outer'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              Outer Mail (O)
            </button>
          </div>
        </div>

        {/* Alloy Ratios */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground">Alloy Composition Percentages</label>
            <span
              className={`text-xs font-mono font-bold ${
                form.isRatioValid ? 'text-emerald-600' : 'text-destructive'
              }`}
            >
              Total: {form.ratioSum}% {form.isRatioValid ? '✓' : '(Must equal 100%)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Silver (Ag) %</label>
              <Input
                type="number"
                value={form.silverRatio}
                onChange={(e) => form.setSilverRatio(parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-mono font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Copper (Cu) %</label>
              <Input
                type="number"
                value={form.copperRatio}
                onChange={(e) => form.setCopperRatio(parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-mono font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Cadmium (Cd) %</label>
              <Input
                type="number"
                value={form.cadmiumRatio}
                onChange={(e) => form.setCadmiumRatio(parseFloat(e.target.value) || 0)}
                className="h-8 text-xs font-mono font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Card (5 cols) */}
      <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
            Alloy Mix Calculation
          </h3>
          <Badge variant="outline" className="text-xs font-mono">
            {form.mailMode.toUpperCase()} Mode
          </Badge>
        </div>

        {/* Hero Calculated Mail */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            Total Alloy (Mail) To Add
          </div>
          <div className="text-3xl font-extrabold text-primary font-mono tracking-tight">
            {formatGrams(form.calculatedMailMg)} Grams
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {formatTMR(form.calculatedMailMg, form.gramsPerTola)}
          </div>
        </div>

        {/* Breakdown of metals */}
        <div className="space-y-2 text-xs divide-y divide-border">
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Silver Required ({form.silverRatio}%):</span>
            <span className="font-mono font-bold text-foreground">
              {formatGrams(Math.round(form.calculatedMailMg * (form.silverRatio / 100)))}g
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Copper Required ({form.copperRatio}%):</span>
            <span className="font-mono font-bold text-foreground">
              {formatGrams(Math.round(form.calculatedMailMg * (form.copperRatio / 100)))}g
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">Cadmium Required ({form.cadmiumRatio}%):</span>
            <span className="font-mono font-bold text-foreground">
              {formatGrams(Math.round(form.calculatedMailMg * (form.cadmiumRatio / 100)))}g
            </span>
          </div>
          <div className="flex justify-between py-2 text-sm font-bold border-t border-border">
            <span className="text-foreground">Final Mixed Ingot Weight:</span>
            <span className="font-mono text-primary">
              {formatGrams(form.totalWeightMg)}g ({formatTMR(form.totalWeightMg, form.gramsPerTola)})
            </span>
          </div>
        </div>

        {/* Actions */}
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
