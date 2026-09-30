import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Printer, LayoutGrid, List, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface InventoryActionAndFilterBarProps {
  filteredCount: number
  itemViewMode: 'grid' | 'table'
  setItemViewMode: (v: 'grid' | 'table') => void
  itemSearch: string
  setItemSearch: (v: string) => void
  categoryFilter: string
  setCategoryFilter: (v: string) => void
  karatFilter: string
  setKaratFilter: (v: string) => void
  onExport: () => void
}

export const InventoryActionAndFilterBar: React.FC<InventoryActionAndFilterBarProps> = ({
  filteredCount,
  itemViewMode,
  setItemViewMode,
  itemSearch,
  setItemSearch,
  categoryFilter,
  setCategoryFilter,
  karatFilter,
  setKaratFilter,
  onExport,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Action Bar Card */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2 text-xs"
            >
              <Download className="size-3.5" /> Export Products CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Printing barcode catalog...")}
              className="gap-2 text-xs"
            >
              <Printer className="size-3.5" /> Print Catalog
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1 font-medium">
              Showing {filteredCount} Products
            </span>
            <div className="flex rounded-md border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setItemViewMode('grid')}
                className={cn(
                  "p-1.5 rounded text-xs transition-colors",
                  itemViewMode === 'grid'
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Gallery View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setItemViewMode('table')}
                className={cn(
                  "p-1.5 rounded text-xs transition-colors",
                  itemViewMode === 'table'
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Table View"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Product Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:basis-[40%]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search product SKU, barcode, name..."
              className="h-11 pl-10"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 md:basis-[25%]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Ring">Rings</SelectItem>
              <SelectItem value="Necklace">Necklaces</SelectItem>
              <SelectItem value="Bangle">Bangles / Karas</SelectItem>
              <SelectItem value="Earring">Earrings</SelectItem>
              <SelectItem value="Chain">Chains</SelectItem>
              <SelectItem value="Set">Bridal Sets</SelectItem>
              <SelectItem value="Other">Bullion & Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={karatFilter} onValueChange={setKaratFilter}>
            <SelectTrigger className="h-11 md:basis-[20%]">
              <SelectValue placeholder="All Purity Karats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purity Karats</SelectItem>
              <SelectItem value="24">24K Fine Gold</SelectItem>
              <SelectItem value="22">22K Standard</SelectItem>
              <SelectItem value="21">21K Arabian</SelectItem>
              <SelectItem value="18">18K Diamond</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 w-full md:basis-[15%]">
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full"
              onClick={() => {
                setItemSearch('')
                setCategoryFilter('all')
                setKaratFilter('all')
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
