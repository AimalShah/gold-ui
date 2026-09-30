import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { InventoryItem } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { toast } from 'sonner'

export function useInventoryPage() {
  const {
    inventoryItems,
    addInventoryItem,
    rawStock,
    addRawStockLot,
    movements,
    karigars,
    mandi,
  } = useApp()

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'raw' | 'movements' | 'karigar' | 'stocktake'>('items')

  // Search & Filters for Finished Items
  const [itemSearch, setItemSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [karatFilter, setKaratFilter] = useState('all')
  const [itemViewMode, setItemViewMode] = useState<'grid' | 'table'>('grid')
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string; tag: string } | null>(null)

  // New Item Sheet State
  const [newItemOpen, setNewItemOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemCategory, setItemCategory] = useState<'Ring' | 'Necklace' | 'Bangle' | 'Earring' | 'Chain' | 'Set' | 'Other'>('Ring')
  const [itemKarat, setItemKarat] = useState(22)
  const [itemGrossMg, setItemGrossMg] = useState(11664)
  const [itemStoneMg, setItemStoneMg] = useState(500)
  const [itemMakingCharges, setItemMakingCharges] = useState(4500)
  const [itemMakingMode, setItemMakingMode] = useState<'fix' | 'per_tola'>('fix')
  const [itemStoneCost, setItemStoneCost] = useState(1500)
  const [itemTray, setItemTray] = useState('Showcase Tray A')
  const [itemImage, setItemImage] = useState('')

  // Add Raw Stock Dialog
  const [rawStockOpen, setRawStockOpen] = useState(false)
  const [rawMetal, setRawMetal] = useState<'gold' | 'silver'>('gold')
  const [rawKarat, setRawKarat] = useState(24)
  const [rawWeightMg, setRawWeightMg] = useState(116640)
  const [rawCostPerTola, setRawCostPerTola] = useState(284000)

  // Label print preview
  const [selectedItemForLabel, setSelectedItemForLabel] = useState<InventoryItem | null>(null)

  // Stocktake scan simulation state
  const [stocktakeScanned, setStocktakeScanned] = useState<string[]>(['890122001', '890122002'])
  const [scanInput, setScanInput] = useState('')

  const filteredItems = inventoryItems.filter((item) => {
    const matches =
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.tagSku.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.barcode.includes(itemSearch)
    if (!matches) return false
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
    if (karatFilter !== 'all' && item.karat.toString() !== karatFilter) return false
    return true
  })

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) {
      toast.error("Please enter product name.")
      return
    }

    const netMg = Math.max(0, itemGrossMg - itemStoneMg)
    const created = addInventoryItem({
      name: itemName,
      category: itemCategory,
      metal: 'gold',
      karat: itemKarat,
      grossWeightMg: itemGrossMg,
      stoneWeightMg: itemStoneMg,
      netWeightMg: netMg,
      makingChargesPkr: itemMakingCharges,
      makingChargesMode: itemMakingMode,
      stoneCostPkr: itemStoneCost,
      locationTray: itemTray,
      status: 'in_stock',
      image: itemImage.trim() || undefined,
    })

    toast.success(`Product ${created.tagSku} added to inventory!`)
    setNewItemOpen(false)
    setItemName('')
    setItemImage('')
  }

  const handleAddRawStock = () => {
    const fineWeightMg = Math.round(rawWeightMg * (rawKarat / 24))
    const tolas = rawWeightMg / 11664
    const value = Math.round(tolas * rawCostPerTola)

    addRawStockLot({
      metal: rawMetal,
      karat: rawKarat,
      weightMg: rawWeightMg,
      fineWeightMg,
      avgCostPerTolaPkr: rawCostPerTola,
      valuePkr: value,
    })

    toast.success(`Purchased and added ${formatGrams(rawWeightMg)}g of ${rawKarat}K ${rawMetal} to Raw Stock!`)
    setRawStockOpen(false)
  }

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scanInput.trim()) return
    if (!stocktakeScanned.includes(scanInput.trim())) {
      setStocktakeScanned(prev => [scanInput.trim(), ...prev])
      toast.success(`Scanned Barcode: ${scanInput}`)
    } else {
      toast.info("Item already scanned in this session.")
    }
    setScanInput('')
  }

  const handleExport = () => {
    toast.success("Exporting products catalogue as CSV...")
  }

  // Calculate Totals for Overview
  const totalFinishedGrossMg = inventoryItems.filter(i => i.status === 'in_stock').reduce((sum, i) => sum + i.grossWeightMg, 0)
  const totalFinishedNetMg = inventoryItems.filter(i => i.status === 'in_stock').reduce((sum, i) => sum + i.netWeightMg, 0)
  const totalRawGoldMg = rawStock.filter(r => r.metal === 'gold').reduce((sum, r) => sum + r.weightMg, 0)
  const totalRawFineGoldMg = rawStock.filter(r => r.metal === 'gold').reduce((sum, r) => sum + r.fineWeightMg, 0)
  const totalSilverMg = rawStock.filter(r => r.metal === 'silver').reduce((sum, r) => sum + r.weightMg, 0)
  const totalInventoryValuePkr = Math.round(((totalRawFineGoldMg + totalFinishedNetMg) / 11664) * mandi.pkrPerTola24k)

  return {
    inventoryItems,
    rawStock,
    movements,
    karigars,
    mandi,
    activeTab,
    setActiveTab,
    itemSearch,
    setItemSearch,
    categoryFilter,
    setCategoryFilter,
    karatFilter,
    setKaratFilter,
    itemViewMode,
    setItemViewMode,
    previewImage,
    setPreviewImage,
    filteredItems,
    newItemOpen,
    setNewItemOpen,
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
    itemMakingCharges,
    setItemMakingCharges,
    itemStoneCost,
    setItemStoneCost,
    itemTray,
    setItemTray,
    itemImage,
    setItemImage,
    handleCreateItem,
    rawStockOpen,
    setRawStockOpen,
    rawMetal,
    setRawMetal,
    rawKarat,
    setRawKarat,
    rawWeightMg,
    setRawWeightMg,
    rawCostPerTola,
    setRawCostPerTola,
    handleAddRawStock,
    selectedItemForLabel,
    setSelectedItemForLabel,
    stocktakeScanned,
    scanInput,
    setScanInput,
    handleScanBarcode,
    handleExport,
    totalFinishedGrossMg,
    totalFinishedNetMg,
    totalRawGoldMg,
    totalRawFineGoldMg,
    totalSilverMg,
    totalInventoryValuePkr,
  }
}
