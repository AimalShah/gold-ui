import React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  productName: string
  setProductName: (name: string) => void
  carat: number
  setCarat: (carat: number) => void
}

const KARAT_OPTIONS = [
  { value: 24, label: '24K Gold', purity: 'Pure 99.9%' },
  { value: 22, label: '22K Jewellery', purity: 'Standard 91.6%' },
  { value: 21, label: '21K Gulf', purity: 'Fine 87.5%' },
  { value: 18, label: '18K Diamond', purity: 'Mount 75.0%' },
]

export const ProductPuritySection: React.FC<Props> = ({
  productName,
  setProductName,
  carat,
  setCarat,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground tracking-tight block">
          Product Description
        </label>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. 22 Karat Bridal Necklace Set, Handcrafted Bangles"
          className="h-9 text-xs font-medium w-full bg-background border-border/80 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground tracking-tight">
            Gold Hallmark & Purity
          </label>
          <span className="text-[11px] text-muted-foreground">Select purity benchmark</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KARAT_OPTIONS.map((opt) => {
            const isSelected = carat === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCarat(opt.value)}
                className={cn(
                  'p-2 rounded-lg border text-left transition-all cursor-pointer w-full',
                  isSelected
                    ? 'border-primary/60 bg-primary/10 text-foreground shadow-2xs ring-1 ring-primary/30'
                    : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-bold tracking-tight', isSelected ? 'text-primary' : 'text-foreground')}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono font-semibold px-1 rounded bg-primary/20 text-primary">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{opt.purity}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
