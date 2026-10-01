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
  { value: 24, label: '24 Karat', purity: 'Pure 99.9%' },
  { value: 22, label: '22 Karat', purity: 'Jewellery 91.6%' },
  { value: 21, label: '21 Karat', purity: 'Gulf Standard 87.5%' },
  { value: 18, label: '18 Karat', purity: 'Diamond Mount 75.0%' },
]

export const ProductPuritySection: React.FC<Props> = ({
  productName,
  setProductName,
  carat,
  setCarat,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-foreground block">
          Product Description
        </label>
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. 22 Karat Bridal Necklace Set, Handcrafted Bangles"
          className="h-10 text-sm font-medium w-full bg-background border-border rounded-lg"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">
            Gold Purity Standard
          </label>
          <span className="text-xs text-muted-foreground">Select benchmark</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KARAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCarat(opt.value)}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-all cursor-pointer w-full relative',
                carat === opt.value
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary'
                  : 'border-border bg-background hover:bg-muted/50 text-foreground'
              )}
            >
              <div className="text-sm font-bold tracking-tight">{opt.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{opt.purity}</div>
              {carat === opt.value && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
