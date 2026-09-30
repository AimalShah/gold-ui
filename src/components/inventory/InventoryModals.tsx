import React from 'react'
import { NewProductSheet } from '@/components/inventory/NewProductSheet'
import { AddRawStockModal } from '@/components/inventory/AddRawStockModal'
import { PrintLabelModal } from '@/components/inventory/PrintLabelModal'
import { ImagePreviewModal } from '@/components/inventory/ImagePreviewModal'
import { useInventoryPage } from '@/hooks/useInventoryPage'

interface InventoryModalsProps {
  p: ReturnType<typeof useInventoryPage>
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({ p }) => {
  return (
    <>
      <NewProductSheet
        open={p.newItemOpen}
        onOpenChange={p.setNewItemOpen}
        itemName={p.itemName}
        setItemName={p.setItemName}
        itemCategory={p.itemCategory}
        setItemCategory={p.setItemCategory}
        itemKarat={p.itemKarat}
        setItemKarat={p.setItemKarat}
        itemGrossMg={p.itemGrossMg}
        setItemGrossMg={p.setItemGrossMg}
        itemStoneMg={p.itemStoneMg}
        setItemStoneMg={p.setItemStoneMg}
        itemStoneCost={p.itemStoneCost}
        setItemStoneCost={p.setItemStoneCost}
        itemMakingCharges={p.itemMakingCharges}
        setItemMakingCharges={p.setItemMakingCharges}
        itemTray={p.itemTray}
        setItemTray={p.setItemTray}
        itemImage={p.itemImage}
        setItemImage={p.setItemImage}
        onSubmit={p.handleCreateItem}
      />

      <AddRawStockModal
        open={p.rawStockOpen}
        onOpenChange={p.setRawStockOpen}
        rawMetal={p.rawMetal}
        setRawMetal={p.setRawMetal}
        rawKarat={p.rawKarat}
        setRawKarat={p.setRawKarat}
        rawWeightMg={p.rawWeightMg}
        setRawWeightMg={p.setRawWeightMg}
        rawCostPerTola={p.rawCostPerTola}
        setRawCostPerTola={p.setRawCostPerTola}
        onAdd={p.handleAddRawStock}
      />

      <PrintLabelModal
        selectedItemForLabel={p.selectedItemForLabel}
        onClose={() => p.setSelectedItemForLabel(null)}
      />

      <ImagePreviewModal
        previewImage={p.previewImage}
        onClose={() => p.setPreviewImage(null)}
      />
    </>
  )
}
