import React from 'react'
import { Input } from '@/components/ui/input'
import { Tag } from 'lucide-react'

interface Props {
  productName: string
  setProductName: (name: string) => void
  carat: number
  setCarat: (carat: number) => void
}

const PRESETS = [
  'Bridal Necklace Set', 'Gold Bangles / Kangan', 'Gold Ring / Band', 'Gold Chain / Mala',
  'Earrings / Tops / Jhumka', 'Gold Bracelet / Kara', 'Locket / Pendant Set',
  'Gold Biscuit / Bar (24K)', 'Gold Coin (Tola / Gram)', 'Nose Pin / Nath',
]

const KARATS = [
  { value: 24, label: '24K Gold', purity: 'Pure 99.9%' },
  { value: 22, label: '22K Jewellery', purity: 'Standard 91.6%' },
  { value: 21, label: '21K Gulf', purity: 'Fine 87.5%' },
  { value: 18, label: '18K Diamond', purity: 'Mount 75.0%' },
]

export const ProductPuritySection: React.FC<Props> = ({
  productName, setProductName, carat, setCarat,
}) => {
  const isPreset = PRESETS.includes(productName)
  const currentKarat = KARATS.find((k) => k.value === carat)

  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-3.5 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-1.5">
          <Tag className="size-3.5 text-primary" strokeWidth={1.75} />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">Item & Hallmark Specification</span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          {carat}K • {currentKarat?.purity || 'Standard'}
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Product Description</label>
        <div className="flex items-center gap-1.5">
          <select
            value={isPreset ? productName : 'custom'}
            onChange={(e) => setProductName(e.target.value === 'custom' ? '' : e.target.value)}
            className="h-9 w-36 sm:w-44 text-xs font-medium bg-background border border-border/80 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer text-foreground shrink-0"
          >
            <option value="">Quick Preset...</option>
            {PRESETS.map((item) => <option key={item} value={item}>{item}</option>)}
            <option value="custom">✎ Custom Entry</option>
          </select>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Item details / custom tag..."
            className="h-9 text-xs font-medium flex-1 bg-background border-border/80 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block">Gold Purity Hallmark</label>
        <select
          value={carat}
          onChange={(e) => setCarat(Number(e.target.value))}
          className="h-9 w-full text-xs font-bold font-mono bg-background border border-border/80 rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer text-foreground"
        >
          {KARATS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label} — {opt.purity}</option>)}
        </select>
      </div>
    </div>
  )
}
