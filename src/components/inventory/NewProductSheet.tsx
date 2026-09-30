import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { formatGrams } from '@/lib/gold-math'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NewProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  setItemName: (v: string) => void
  itemCategory: 'Ring' | 'Necklace' | 'Bangle' | 'Earring' | 'Chain' | 'Set' | 'Other'
  setItemCategory: (v: 'Ring' | 'Necklace' | 'Bangle' | 'Earring' | 'Chain' | 'Set' | 'Other') => void
  itemKarat: number
  setItemKarat: (v: number) => void
  itemGrossMg: number
  setItemGrossMg: (v: number) => void
  itemStoneMg: number
  setItemStoneMg: (v: number) => void
  itemStoneCost: number
  setItemStoneCost: (v: number) => void
  itemMakingCharges: number
  setItemMakingCharges: (v: number) => void
  itemTray: string
  setItemTray: (v: string) => void
  itemImage: string
  setItemImage: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const NewProductSheet: React.FC<NewProductSheetProps> = ({
  open,
  onOpenChange,
  itemName,
  setItemName,
  itemCategory,
  setItemCategory,
  itemKarat,
  setItemKarat,
  itemGrossMg,
  setItemGrossMg,
  itemStoneMg,
  setItemStoneMg,
  itemStoneCost,
  setItemStoneCost,
  itemMakingCharges,
  setItemMakingCharges,
  itemTray,
  setItemTray,
  itemImage,
  setItemImage,
  onSubmit,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="text-lg font-bold text-foreground">
            Add New Product
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Add necessary product information, weights, image, and showroom tag.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-4 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Product Title *</Label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. 22K Kundan Choker Necklace"
              className="h-10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={itemCategory} onValueChange={(v: any) => setItemCategory(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ring">Ring</SelectItem>
                  <SelectItem value="Necklace">Necklace</SelectItem>
                  <SelectItem value="Bangle">Bangles / Kara</SelectItem>
                  <SelectItem value="Earring">Earrings / Jhumka</SelectItem>
                  <SelectItem value="Chain">Chain</SelectItem>
                  <SelectItem value="Set">Complete Set</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Purity Karat</Label>
              <Select value={itemKarat.toString()} onValueChange={(v) => setItemKarat(parseInt(v, 10))}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24K Pure Gold</SelectItem>
                  <SelectItem value="22">22K Standard</SelectItem>
                  <SelectItem value="21">21K Arabian</SelectItem>
                  <SelectItem value="18">18K Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Gross Weight</Label>
            <WeightInput value={itemGrossMg} onChange={setItemGrossMg} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Stone Weight</Label>
              <WeightInput value={itemStoneMg} onChange={setItemStoneMg} compact={true} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Stone Cost (PKR)</Label>
              <MoneyInput
                value={itemStoneCost}
                onChange={setItemStoneCost}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Making Charges (PKR)</Label>
              <MoneyInput
                value={itemMakingCharges}
                onChange={setItemMakingCharges}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Showcase Tray</Label>
              <Input
                value={itemTray}
                onChange={(e) => setItemTray(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Product Image URL</span>
              <span className="text-[11px] text-muted-foreground">Quick Presets:</span>
            </Label>
            <Input
              value={itemImage}
              onChange={(e) => setItemImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="h-10"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
                { label: 'Bangle', url: 'https://images.unsplash.com/photo-1611591475812-70b028448f21?auto=format&fit=crop&w=600&q=80' },
                { label: 'Necklace', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' },
                { label: 'Chain', url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80' },
                { label: 'Earring', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80' },
                { label: 'Gold Bar', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setItemImage(preset.url)}
                  className="px-2 py-1 rounded text-xs border border-border bg-secondary hover:bg-secondary/80 font-medium transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
            {itemImage && (
              <div className="h-24 w-full rounded-lg border border-border overflow-hidden mt-2 bg-muted/20">
                <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-muted/50 border border-border flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground">Calculated Net Gold:</span>
            <span className="text-base font-bold text-foreground">
              {formatGrams(Math.max(0, itemGrossMg - itemStoneMg), 3)} g
            </span>
          </div>

          <SheetFooter className="pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Save Product
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
