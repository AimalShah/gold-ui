import React from 'react'
import { Customer } from '@/lib/types'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Flame, User, X } from 'lucide-react'

interface TehleelInputsCardProps {
  metalType: string
  setMetalType: (m: string) => void
  selectedCustomer: Customer | null
  setSelectedCustomer: (c: Customer | null) => void
  onOpenCustomerModal: () => void
  firstWeightMg: number
  setFirstWeightMg: (w: number) => void
  secondWeightMg: number
  setSecondWeightMg: (w: number) => void
  cutPerTolaMg: number
  setCutPerTolaMg: (c: number) => void
  ratePkr: number
  setRatePkr: (r: number) => void
  unitMode: 'auto' | 'grams' | 'tola'
}

export const TehleelInputsCard: React.FC<TehleelInputsCardProps> = ({
  metalType,
  setMetalType,
  selectedCustomer,
  setSelectedCustomer,
  onOpenCustomerModal,
  firstWeightMg,
  setFirstWeightMg,
  secondWeightMg,
  setSecondWeightMg,
  cutPerTolaMg,
  setCutPerTolaMg,
  ratePkr,
  setRatePkr,
  unitMode,
}) => {
  return (
    <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
      <div className="border-b border-border pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-2">
            <Flame className="size-4 text-amber-500" />
            1. Assay Test Parameters & Scale Weights
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cupellation testing for copper, silver, and chemical alloys
          </p>
        </div>
      </div>

      {/* Metal / Alloy Base Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Metal / Alloy Base</label>
        <ToggleGroup
          type="single"
          value={metalType}
          onValueChange={(val) => val && setMetalType(val)}
          className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full"
        >
          <ToggleGroupItem value="COPPER" className="text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Copper (C)
          </ToggleGroupItem>
          <ToggleGroupItem value="SILVER" className="text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Silver (S)
          </ToggleGroupItem>
          <ToggleGroupItem value="ESILVER" className="text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            E-Silver (M)
          </ToggleGroupItem>
          <ToggleGroupItem value="TEZABI" className="text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Tezabi (U)
          </ToggleGroupItem>
          <ToggleGroupItem value="PURE SILVER" className="text-xs font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Pure Ag (Y)
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Customer Picker */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">Customer (Optional)</label>
          <Button variant="ghost" size="sm" onClick={onOpenCustomerModal} className="h-6 text-xs text-primary gap-1">
            <User className="size-3" /> Select Account
          </Button>
        </div>
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/40 text-xs">
            <span className="font-semibold text-foreground">{selectedCustomer.name}</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="h-6 size-6 p-0">
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic p-2.5 rounded-lg border border-dashed border-border">
            Walk-in Assay Client
          </div>
        )}
      </div>

      {/* 1st & 2nd Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            1st Weight (Gross Sample)
            <HotkeyHint hotkey="1" className="h-4 text-[9px]" />
          </label>
          <WeightInput value={firstWeightMg} onChange={setFirstWeightMg} activeUnit={unitMode} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            2nd Weight (Fine Button)
            <HotkeyHint hotkey="2" className="h-4 text-[9px]" />
          </label>
          <WeightInput value={secondWeightMg} onChange={setSecondWeightMg} activeUnit={unitMode} />
        </div>
      </div>

      {/* Cut per tola & Market rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Cut per Tola Deduction (Ratti/Masha)</label>
          <WeightInput value={cutPerTolaMg} onChange={setCutPerTolaMg} activeUnit={unitMode} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Gold Rate / Tola (PKR)</label>
          <MoneyInput value={ratePkr} onChange={setRatePkr} />
        </div>
      </div>
    </div>
  )
}
