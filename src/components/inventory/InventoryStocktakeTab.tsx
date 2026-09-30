import React from 'react'
import { InventoryItem } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface InventoryStocktakeTabProps {
  stocktakeScanned: string[]
  scanInput: string
  setScanInput: (v: string) => void
  onScanBarcode: (e: React.FormEvent) => void
  inventoryItems: InventoryItem[]
}

export const InventoryStocktakeTab: React.FC<InventoryStocktakeTabProps> = ({
  stocktakeScanned,
  scanInput,
  setScanInput,
  onScanBarcode,
  inventoryItems,
}) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">Physical Stock-Take & Barcode Audit</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Scan tags to audit showroom inventory against database records.</p>
        </div>
        <Badge variant="success">
          {stocktakeScanned.length} Items Verified
        </Badge>
      </div>

      <form onSubmit={onScanBarcode} className="flex gap-3">
        <Input
          type="text"
          placeholder="Scan barcode or enter SKU (e.g. 890122003, 890122004)..."
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          className="h-11"
          autoFocus
        />
        <Button type="submit" size="lg" className="px-6 font-medium">
          Verify Tag
        </Button>
      </form>

      <div className="rounded-lg border border-border divide-y divide-border text-sm">
        {inventoryItems.map((item) => {
          const isScanned = stocktakeScanned.includes(item.barcode) || stocktakeScanned.includes(item.tagSku)
          return (
            <div key={item.id} className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isScanned ? (
                  <CheckCircle className="size-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="size-5 text-amber-500" />
                )}
                <div>
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({item.barcode})</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">{formatGrams(item.netWeightMg)}g</span>
                <Badge variant={isScanned ? 'success' : 'destructive'}>
                  {isScanned ? 'Verified Present' : 'Unscanned / Missing'}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
