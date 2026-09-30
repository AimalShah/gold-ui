import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ShopProfileTabProps {
  shopName: string
  setShopName: (v: string) => void
  address: string
  setAddress: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  billFooter: string
  setBillFooter: (v: string) => void
}

export const ShopProfileTab: React.FC<ShopProfileTabProps> = ({
  shopName,
  setShopName,
  address,
  setAddress,
  phone,
  setPhone,
  billFooter,
  setBillFooter,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Shop Branding & Information
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          This information appears on bills, reports and certificates.
        </p>
      </div>

      <div className="space-y-5 max-w-3xl">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Jewellery Shop Name *
          </Label>
          <Input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="h-12 font-bold text-base bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
            placeholder="e.g. ISLAM JEWELLERS"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Showroom Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-11 text-xs md:text-sm bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
            placeholder="Showroom street and market address"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Contact Phone / Mobile
          </Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 text-xs md:text-sm font-mono bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
            placeholder="+92 300 1234567"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Receipt / Memo Footer Note
          </Label>
          <textarea
            value={billFooter}
            onChange={(e) => setBillFooter(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-xl border border-border text-xs md:text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
            placeholder="Terms and conditions printed at the bottom of customer receipts"
          />
        </div>
      </div>
    </div>
  )
}
