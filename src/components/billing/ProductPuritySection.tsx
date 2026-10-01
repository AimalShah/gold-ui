import React from 'react'
import { Input } from '@/components/ui/input'

interface Props {
  productName: string
  setProductName: (name: string) => void
  carat: number
  setCarat: (carat: number) => void
}

const PRODUCT_PRESETS = [
  'Bridal Necklace Set',
  'Gold Bangles / Kangan',
  'Gold Ring / Band',
  'Gold Chain / Mala',
  'Earrings / Tops / Jhumka',
  'Gold Bracelet / Kara',
  'Locket / Pendant Set',
  'Gold Biscuit / Bar (24K)',
  'Gold Coin (Tola / Gram)',
  'Nose Pin / Nath',
  'Custom Jewellery',
]

const KARAT_OPTIONS = [
  { value: 24, label: '24K Gold', purity: '99.9%' },
  { value: 22, label: '22K Jewellery', purity: '91.6%' },
  { value: 21, label: '21K Gulf', purity: '87.5%' },
  { value: 18, label: '18K Diamond Mount', purity: '75.0%' },
]

export const ProductPuritySection: React.FC<Props> = ({
  productName,
  setProductName,
  carat,
  setCarat,
}) => {
  const isPreset = PRODUCT_PRESETS.includes(productName)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
      {/* Product Description Dropdown & Custom Input */}
      <div className="sm:col-span-8 space-y-1">
        <label className="text-xs font-semibold text-foreground tracking-tight block">
          Product Description
        </label>
        <div className="flex items-center gap-1.5">
          <select
            value={isPreset ? productName : 'custom'}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setProductName('')
              } else {
                setProductName(e.target.value)
              }
            }}
            className="h-8.5 w-44 sm:w-48 text-xs font-medium bg-background border border-border/80 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer text-foreground shrink-0"
          >
            <option value="">Select Item...</option>
            {PRODUCT_PRESETS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
            <option value="custom">✎ Custom Entry</option>
          </select>

          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Item details / custom description..."
            className="h-8.5 text-xs font-medium flex-1 bg-background border-border/80 rounded-md focus-visible:ring-1 focus-visible:ring-primary/40"
          />
        </div>
      </div>

      {/* Gold Hallmark & Purity Dropdown */}
      <div className="sm:col-span-4 space-y-1">
        <label className="text-xs font-semibold text-foreground tracking-tight block">
          Gold Purity Hallmark
        </label>
        <select
          value={carat}
          onChange={(e) => setCarat(Number(e.target.value))}
          className="h-8.5 w-full text-xs font-bold font-mono bg-background border border-border/80 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer text-primary"
        >
          {KARAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.purity})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
