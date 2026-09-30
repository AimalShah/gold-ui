import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface UnitsAndBillingTabProps {
  gramsPerTola: string
  setGramsPerTola: (v: string) => void
  zakatPct: string
  setZakatPct: (v: string) => void
}

export const UnitsAndBillingTab: React.FC<UnitsAndBillingTabProps> = ({
  gramsPerTola,
  setGramsPerTola,
  zakatPct,
  setZakatPct,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Weight Units & Conversion Standards
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Standard Sarafa Association weight definitions and decimal precision.
          </p>
        </div>

        <div className="space-y-5 max-w-3xl">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Grams per 1 Tola
            </Label>
            <Input
              type="number"
              step="0.0001"
              value={gramsPerTola}
              onChange={(e) => setGramsPerTola(e.target.value)}
              className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Default: <strong>11.664 g</strong> (1 Masha = 1/12 Tola = 0.972 g, 1 Ratti = 1/8 Masha = 0.1215 g)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Weight Display Precision
            </Label>
            <Input
              type="number"
              defaultValue="4"
              className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Display up to 4 decimal places for milligram accuracy on live digital balances.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-border">
        <div className="border-b border-border pb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Billing Defaults & Zakat
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Default cut, polish, charges, and Shariah Zakat calculation parameters.
          </p>
        </div>

        <div className="space-y-5 max-w-3xl">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Zakat Rate (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={zakatPct}
              onChange={(e) => setZakatPct(e.target.value)}
              className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Standard Nisab Shariah rule: <strong>2.5%</strong> of net fine gold valuation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
