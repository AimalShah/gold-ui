import React from 'react'
import { InventoryItem } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { Package, Eye, QrCode, Image as ImageIcon } from 'lucide-react'

interface InventoryFinishedProductsTabProps {
  itemViewMode: 'grid' | 'table'
  filteredItems: InventoryItem[]
  onPreviewImage: (preview: { url: string; name: string; tag: string }) => void
  onPrintLabel: (item: InventoryItem) => void
}

export const InventoryFinishedProductsTab: React.FC<InventoryFinishedProductsTabProps> = ({
  itemViewMode,
  filteredItems,
  onPreviewImage,
  onPrintLabel,
}) => {
  if (itemViewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden border border-border hover:shadow-md transition-shadow flex flex-col justify-between group p-0"
          >
            <div>
              <div
                onClick={() =>
                  item.image &&
                  onPreviewImage({ url: item.image, name: item.name, tag: item.tagSku })
                }
                className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden cursor-pointer flex items-center justify-center border-b border-border"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                    <Package className="size-10 stroke-1" />
                    <span className="text-xs mt-1">No Image</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <KaratBadge karat={item.karat} size="sm" />
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-background/90 text-foreground border border-border shadow-xs">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant="success">Selling</Badge>
                </div>

                {item.image && (
                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-foreground px-2 py-1 rounded text-xs flex items-center gap-1 font-medium shadow-xs border border-border">
                    <Eye className="size-3.5" /> Preview
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>{item.tagSku}</span>
                    <span>{item.locationTray}</span>
                  </div>
                  <h4 className="font-semibold text-base text-foreground tracking-tight line-clamp-1 mt-1" title={item.name}>
                    {item.name}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-muted/50 border border-border">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Net Gold</span>
                    <span className="font-semibold text-foreground text-sm">{formatGrams(item.netWeightMg)}g</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Gross Wt</span>
                    <span className="text-foreground">{formatGrams(item.grossWeightMg)}g</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted-foreground">Making Charges:</span>
                  <span className="font-semibold text-foreground">
                    {formatMoney(item.makingChargesPkr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border bg-muted/20 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintLabel(item)}
                className="w-full text-xs font-semibold gap-1.5"
              >
                <QrCode className="size-3.5" /> Print Barcode Tag
              </Button>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">SKU / Tag</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Purity</th>
              <th className="px-6 py-4 text-right">Net Wt</th>
              <th className="px-6 py-4 text-right">Gross Wt</th>
              <th className="px-6 py-4 text-right">Making</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onClick={() =>
                        onPreviewImage({ url: item.image!, name: item.name, tag: item.tagSku })
                      }
                      className="size-11 rounded-lg object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                      <ImageIcon className="size-5" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">{item.tagSku}</td>
                <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                <td className="px-6 py-4">
                  <KaratBadge karat={item.karat} size="sm" />
                </td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">
                  {formatGrams(item.netWeightMg)}g
                </td>
                <td className="px-6 py-4 text-right text-muted-foreground">
                  {formatGrams(item.grossWeightMg)}g
                </td>
                <td className="px-6 py-4 text-right font-medium text-foreground">
                  {formatMoney(item.makingChargesPkr)}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{item.locationTray}</td>
                <td className="px-6 py-4">
                  <Badge variant="success">Selling</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPrintLabel(item)}
                    className="gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <QrCode className="size-3.5" /> Print Tag
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
