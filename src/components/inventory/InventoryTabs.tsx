import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InventoryFinishedProductsTab } from '@/components/inventory/InventoryFinishedProductsTab'
import { InventoryOverviewTab } from '@/components/inventory/InventoryOverviewTab'
import { InventoryRawBullionTab } from '@/components/inventory/InventoryRawBullionTab'
import { InventoryMovementsTab } from '@/components/inventory/InventoryMovementsTab'
import { InventoryKarigarTab } from '@/components/inventory/InventoryKarigarTab'
import { InventoryStocktakeTab } from '@/components/inventory/InventoryStocktakeTab'
import { useInventoryPage } from '@/hooks/useInventoryPage'

interface InventoryTabsProps {
  p: ReturnType<typeof useInventoryPage>
}

export const InventoryTabs: React.FC<InventoryTabsProps> = ({ p }) => {
  return (
    <Tabs value={p.activeTab} onValueChange={(v) => p.setActiveTab(v as any)} className="w-full">
      <TabsList className="bg-card border border-border p-1 rounded-lg">
        <TabsTrigger value="items" className="text-xs font-medium">
          Finished Products ({p.inventoryItems.length})
        </TabsTrigger>
        <TabsTrigger value="overview" className="text-xs font-medium">
          Stock Valuation & KPIs
        </TabsTrigger>
        <TabsTrigger value="raw" className="text-xs font-medium">
          Raw Bullion Lots ({p.rawStock.length})
        </TabsTrigger>
        <TabsTrigger value="movements" className="text-xs font-medium">
          Movements Ledger ({p.movements.length})
        </TabsTrigger>
        <TabsTrigger value="karigar" className="text-xs font-medium">
          Karigar Allocations ({p.karigars.length})
        </TabsTrigger>
        <TabsTrigger value="stocktake" className="text-xs font-medium">
          Stock-Take Barcode Audit
        </TabsTrigger>
      </TabsList>

      <TabsContent value="items" className="pt-4">
        <InventoryFinishedProductsTab
          itemViewMode={p.itemViewMode}
          filteredItems={p.filteredItems}
          onPreviewImage={p.setPreviewImage}
          onPrintLabel={p.setSelectedItemForLabel}
        />
      </TabsContent>

      <TabsContent value="overview" className="pt-4 space-y-6">
        <InventoryOverviewTab
          totalFineGoldMg={p.totalRawFineGoldMg + p.totalFinishedNetMg}
          totalRawGoldMg={p.totalRawGoldMg}
          rawStockLotsCount={p.rawStock.length}
          inventoryItemsCount={p.inventoryItems.length}
          totalFinishedNetMg={p.totalFinishedNetMg}
          totalSilverMg={p.totalSilverMg}
          totalInventoryValuePkr={p.totalInventoryValuePkr}
          mandiRate24k={p.mandi.pkrPerTola24k}
        />
      </TabsContent>

      <TabsContent value="raw" className="pt-4">
        <InventoryRawBullionTab rawStock={p.rawStock} />
      </TabsContent>

      <TabsContent value="movements" className="pt-4">
        <InventoryMovementsTab movements={p.movements} />
      </TabsContent>

      <TabsContent value="karigar" className="pt-4">
        <InventoryKarigarTab karigars={p.karigars} />
      </TabsContent>

      <TabsContent value="stocktake" className="pt-4 space-y-4">
        <InventoryStocktakeTab
          stocktakeScanned={p.stocktakeScanned}
          scanInput={p.scanInput}
          setScanInput={p.setScanInput}
          onScanBarcode={p.handleScanBarcode}
          inventoryItems={p.inventoryItems}
        />
      </TabsContent>
    </Tabs>
  )
}
