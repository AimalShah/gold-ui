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
    <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-primary" strokeWidth={2} />
          <span className="text-sm font-bold text-foreground uppercase tracking-wide">Item & Hallmark</span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25">
          {carat}K • {currentKarat?.purity || 'Standard'}
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide block">Product Description</label>
        <div className="flex items-center gap-2">
          <select
            value={isPreset ? productName : 'custom'}
            onChange={(e) => setProductName(e.target.value === 'custom' ? '' : e.target.value)}
            className="h-10 w-40 sm:w-48 text-sm font-semibold bg-background border border-border rounded-lg px-2.5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground shrink-0"
          >
            <option value="">Quick Preset...</option>
            {PRESETS.map((item) => <option key={item} value={item}>{item}</option>)}
            <option value="custom">✎ Custom Entry</option>
          </select>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Item details / custom tag..."
            className="h-10 text-sm font-semibold flex-1 bg-background border-border rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide block">Gold Purity Hallmark</label>
        <select
          value={carat}
          onChange={(e) => setCarat(Number(e.target.value))}
          className="h-10 w-full text-sm font-bold font-mono bg-background border border-border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground"
        >
          {KARATS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label} — {opt.purity}</option>)}
        </select>
      </div>
    </div>
  )
}
