import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useInventoryPage } from '@/hooks/useInventoryPage'
import { InventoryActionAndFilterBar } from '@/components/inventory/InventoryActionAndFilterBar'
import { InventoryTabs } from '@/components/inventory/InventoryTabs'
import { InventoryModals } from '@/components/inventory/InventoryModals'

export const InventoryPage: React.FC = () => {
  const p = useInventoryPage()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <PageTitle
        description="Comprehensive catalogue of jewellery pieces, bullion bars, and Karigar alloy stock."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => p.setRawStockOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" /> Add Raw Bullion
            </Button>
            <Button
              size="lg"
              onClick={() => p.setNewItemOpen(true)}
              className="gap-2 font-medium"
            >
              <Plus className="size-4" /> Add Product
            </Button>
          </div>
        }
      >
        Products & Inventory
      </PageTitle>

      <InventoryActionAndFilterBar
        filteredCount={p.filteredItems.length}
        itemViewMode={p.itemViewMode}
        setItemViewMode={p.setItemViewMode}
        itemSearch={p.itemSearch}
        setItemSearch={p.setItemSearch}
        categoryFilter={p.categoryFilter}
        setCategoryFilter={p.setCategoryFilter}
        karatFilter={p.karatFilter}
        setKaratFilter={p.setKaratFilter}
        onExport={p.handleExport}
      />

      <InventoryTabs p={p} />
      <InventoryModals p={p} />
    </div>
  )
}

export default InventoryPage
