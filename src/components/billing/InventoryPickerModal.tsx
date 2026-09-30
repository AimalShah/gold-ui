import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InventoryItem } from '@/lib/types'
import { useApp } from '@/context/AppContext'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Boxes, Search, Check, Sparkles } from 'lucide-react'

interface InventoryPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectItem: (item: InventoryItem) => void
}

export const InventoryPickerModal: React.FC<InventoryPickerModalProps> = ({
  open,
  onOpenChange,
  onSelectItem,
}) => {
  const { inventoryItems } = useApp()
  const [search, setSearch] = useState('')

  const availableItems = inventoryItems.filter(
    (i) =>
      i.status === 'in_stock' &&
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.tagSku.toLowerCase().includes(search.toLowerCase()) ||
        i.barcode.includes(search) ||
        i.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <Boxes className="h-5 w-5 text-amber-600" />
            Pick Finished Jewellery from Stock Inventory (NEW)
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Scan barcode or search SKU to attach item directly to current bill.
          </p>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Scan barcode or search SKU tag (e.g. RN-22K-001, 890122001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs font-mono"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md divide-y divide-border/60">
          {availableItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No in-stock jewellery items matched your query.
            </div>
          ) : (
            availableItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item)
                  onOpenChange(false)
                }}
                className="p-3 flex items-center justify-between hover:bg-amber-500/10 cursor-pointer transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300">
                      {item.name}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300">
                      {item.karat}K
                    </Badge>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                      {item.tagSku}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>Category: {item.category}</span>
                    <span>•</span>
                    <span>Tray: {item.locationTray}</span>
                    <span>•</span>
                    <span>Barcode: {item.barcode}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs space-y-0.5">
                  <div className="font-bold text-foreground">
                    {formatGrams(item.netWeightMg)}g <span className="text-[10px] text-muted-foreground font-sans font-normal">(Net)</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Gross: {formatGrams(item.grossWeightMg)}g | Stone: {formatGrams(item.stoneWeightMg)}g
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                    Making: {formatMoney(item.makingChargesPkr)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-2 border-t flex justify-between sm:justify-between items-center text-xs text-muted-foreground">
          <span>Available items: <strong>{availableItems.length}</strong></span>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
