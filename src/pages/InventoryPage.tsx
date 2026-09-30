import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { InventoryItem, RawStockLot } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
import { cn } from '@/lib/utils'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { PageTitle } from '@/components/shared/PageTitle'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import {
  Boxes,
  Plus,
  QrCode,
  Tag,
  Search,
  CheckCircle,
  AlertTriangle,
  Printer,
  Package,
  LayoutGrid,
  List,
  Eye,
  Download,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

export const InventoryPage: React.FC = () => {
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
  const [rawWeightMg, setRawWeightMg] = useState(116640) // 10 tolas
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Header with PageTitle and Action buttons */}
      <PageTitle
        description="Comprehensive catalogue of jewellery pieces, bullion bars, and Karigar alloy stock."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRawStockOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" /> Add Raw Bullion
            </Button>
            <Button
              size="lg"
              onClick={() => setNewItemOpen(true)}
              className="gap-2 font-medium"
            >
              <Plus className="size-4" /> Add Product
            </Button>
          </div>
        }
      >
        Products & Inventory
      </PageTitle>

      {/* 2. Top Action Bar Card (Matching ProductActions in ecommerce-admin) */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
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

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1 font-medium">
              Showing {filteredItems.length} Products
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

      {/* 3. Product Filters Card (Matching ProductFilters in ecommerce-admin) */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search input */}
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

          {/* Category dropdown */}
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

          {/* Purity Karat dropdown */}
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

          {/* Reset button */}
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

      {/* 4. Tab Navigation for Finished Items, Raw Stock, Movements, Karigar, Stocktake */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-lg">
          <TabsTrigger value="items" className="text-xs font-medium">
            Finished Products ({inventoryItems.length})
          </TabsTrigger>
          <TabsTrigger value="overview" className="text-xs font-medium">
            Stock Valuation & KPIs
          </TabsTrigger>
          <TabsTrigger value="raw" className="text-xs font-medium">
            Raw Bullion Lots ({rawStock.length})
          </TabsTrigger>
          <TabsTrigger value="movements" className="text-xs font-medium">
            Movements Ledger ({movements.length})
          </TabsTrigger>
          <TabsTrigger value="karigar" className="text-xs font-medium">
            Karigar Allocations ({karigars.length})
          </TabsTrigger>
          <TabsTrigger value="stocktake" className="text-xs font-medium">
            Stock-Take Barcode Audit
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FINISHED PRODUCTS */}
        <TabsContent value="items" className="pt-4">
          {itemViewMode === 'grid' ? (
            /* Gallery Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border border-border hover:shadow-md transition-shadow flex flex-col justify-between group p-0"
                >
                  <div>
                    {/* Image Header with Zoom preview */}
                    <div
                      onClick={() => item.image && setPreviewImage({ url: item.image, name: item.name, tag: item.tagSku })}
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

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <KaratBadge karat={item.karat} size="sm" />
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-background/90 text-foreground border border-border shadow-xs">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge variant="success">
                          Selling
                        </Badge>
                      </div>

                      {item.image && (
                        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-foreground px-2 py-1 rounded text-xs flex items-center gap-1 font-medium shadow-xs border border-border">
                          <Eye className="size-3.5" /> Preview
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
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

                      {/* Weight Grid */}
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

                  {/* Card Footer Actions */}
                  <div className="p-3 border-t border-border bg-muted/20 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItemForLabel(item)}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <QrCode className="size-3.5" /> Print Barcode Tag
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Table View */
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
                              onClick={() => setPreviewImage({ url: item.image!, name: item.name, tag: item.tagSku })}
                              className="size-11 rounded-lg object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                              loading="lazy"
                            />
                          ) : (
                            <div className="size-11 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                              <ImageIcon className="size-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {item.tagSku}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {item.category}
                        </td>
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
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {item.locationTray}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="success">
                            Selling
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItemForLabel(item)}
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
          )}
        </TabsContent>

        {/* TAB 2: OVERVIEW & KPIS */}
        <TabsContent value="overview" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Total Fine Gold (24K)</span>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatGrams(totalRawFineGoldMg + totalFinishedNetMg)} g
              </p>
              <span className="text-xs text-muted-foreground font-mono">{formatTMR(totalRawFineGoldMg + totalFinishedNetMg)}</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Raw Bullion Gold</span>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatGrams(totalRawGoldMg)} g
              </p>
              <span className="text-xs text-muted-foreground">{rawStock.length} Active Lots</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Finished Items</span>
              <p className="text-2xl font-bold text-foreground mt-1">
                {inventoryItems.length} Pieces
              </p>
              <span className="text-xs text-muted-foreground">Net Wt: {formatGrams(totalFinishedNetMg)}g</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Silver (Chandi)</span>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatGrams(totalSilverMg)} g
              </p>
              <span className="text-xs text-muted-foreground">500 Tolas Bullion</span>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Stock Valuation</span>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatMoney(totalInventoryValuePkr)}
              </p>
              <span className="text-xs text-muted-foreground">@ Rs {mandi.pkrPerTola24k.toLocaleString()}/tola</span>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: RAW BULLION */}
        <TabsContent value="raw" className="pt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Lot #</th>
                    <th className="px-6 py-4">Metal</th>
                    <th className="px-6 py-4">Purity</th>
                    <th className="px-6 py-4 text-right">Gross Weight</th>
                    <th className="px-6 py-4 text-right">Fine Weight (24K)</th>
                    <th className="px-6 py-4 text-right">Cost Rate / Tola</th>
                    <th className="px-6 py-4 text-right">Estimated Value</th>
                    <th className="px-6 py-4">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rawStock.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary">{r.id}</td>
                      <td className="px-6 py-4 font-medium capitalize">{r.metal}</td>
                      <td className="px-6 py-4 font-medium">{r.karat}K</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">{formatGrams(r.weightMg)}g</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">{formatGrams(r.fineWeightMg)}g</td>
                      <td className="px-6 py-4 text-right">{formatMoney(r.avgCostPerTolaPkr)}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{formatMoney(r.valuePkr)}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{r.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: MOVEMENTS */}
        <TabsContent value="movements" className="pt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Item / Bullion Lot</th>
                    <th className="px-6 py-4 text-right">Weight In</th>
                    <th className="px-6 py-4 text-right">Weight Out</th>
                    <th className="px-6 py-4 text-right font-bold">Balance</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">{m.date}</td>
                      <td className="px-6 py-4">
                        <Badge variant={m.type === 'Purchase' ? 'success' : 'processing'}>
                          {m.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{m.itemOrLot}</td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600">{m.weightInMg ? `${formatGrams(m.weightInMg)}g` : '—'}</td>
                      <td className="px-6 py-4 text-right font-semibold text-red-600">{m.weightOutMg ? `${formatGrams(m.weightOutMg)}g` : '—'}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(m.balanceMg)}g</td>
                      <td className="px-6 py-4 font-mono text-xs text-primary">{m.ref}</td>
                      <td className="px-6 py-4 text-muted-foreground">{m.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: KARIGAR */}
        <TabsContent value="karigar" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {karigars.map((k) => (
              <Card key={k.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{k.name}</h3>
                    <p className="text-xs text-muted-foreground">{k.speciality}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{k.city} · {k.phone}</p>
                  </div>
                  <Badge variant="secondary">
                    {k.activeJobs} Active Jobs
                  </Badge>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gold Held:</span>
                    <span className="font-bold text-primary">{formatGrams(k.goldHeldMg)}g</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground text-right">{formatTMR(k.goldHeldMg)}</div>
                  <div className="flex justify-between pt-1 border-t border-border">
                    <span className="text-muted-foreground">Silver Held:</span>
                    <span className="font-semibold">{formatGrams(k.silverHeldMg)}g</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Issue metal to ${k.name}`)}
                    className="flex-1"
                  >
                    Issue Metal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Receive metal from ${k.name}`)}
                    className="flex-1"
                  >
                    Receive Metal
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 6: STOCK-TAKE AUDIT */}
        <TabsContent value="stocktake" className="pt-4 space-y-4">
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

            <form onSubmit={handleScanBarcode} className="flex gap-3">
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
        </TabsContent>
      </Tabs>

      {/* MODAL 1: New Product Sheet */}
      <Sheet open={newItemOpen} onOpenChange={setNewItemOpen}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="text-lg font-bold text-foreground">
              Add New Product
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Add necessary product information, weights, image, and showroom tag.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreateItem} className="space-y-4 py-4 text-sm">
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
              <WeightInput
                value={itemGrossMg}
                onChange={setItemGrossMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Stone Weight</Label>
                <WeightInput
                  value={itemStoneMg}
                  onChange={setItemStoneMg}
                  compact={true}
                />
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

            {/* Product Image URL with Presets */}
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
              <Button type="button" variant="outline" onClick={() => setNewItemOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Save Product
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* MODAL 2: Add Raw Stock Lot */}
      <Dialog open={rawStockOpen} onOpenChange={setRawStockOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-foreground">
              Add Raw Bullion Stock
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Metal</Label>
                <Select value={rawMetal} onValueChange={(v: any) => setRawMetal(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold (Tezabi / Passa)</SelectItem>
                    <SelectItem value="silver">Silver (Chandi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Purity Karat</Label>
                <Select value={rawKarat.toString()} onValueChange={(v) => setRawKarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K Pure Bullion</SelectItem>
                    <SelectItem value="22">22K Standard</SelectItem>
                    <SelectItem value="21">21K Arabian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Weight</Label>
              <WeightInput
                value={rawWeightMg}
                onChange={setRawWeightMg}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Purchase Cost Rate / Tola (PKR)</Label>
              <MoneyInput
                value={rawCostPerTola}
                onChange={setRawCostPerTola}
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" onClick={() => setRawStockOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRawStock} className="font-semibold">
              Add to Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Label Print Preview */}
      <Dialog open={!!selectedItemForLabel} onOpenChange={(open) => !open && setSelectedItemForLabel(null)}>
        <DialogContent className="max-w-sm p-6 text-center">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold flex items-center justify-center gap-2">
              <QrCode className="size-5 text-foreground" />
              Jewellery Tag Barcode
            </DialogTitle>
          </DialogHeader>

          {selectedItemForLabel && (
            <div className="py-4 flex flex-col items-center space-y-2">
              <div className="w-56 p-4 rounded-lg border border-border bg-card text-foreground shadow-sm text-xs leading-tight">
                <div className="font-bold text-xs uppercase tracking-wide">Zorvex Jewellers</div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">{selectedItemForLabel.name}</div>
                <div className="my-3 h-10 bg-muted/80 rounded flex items-center justify-center text-foreground tracking-[5px] text-xs font-mono font-bold border border-border">
                  ||||||||||||||||||||||
                </div>
                <div className="text-xs font-mono font-bold">{selectedItemForLabel.barcode}</div>
                <div className="flex justify-between pt-2 border-t border-border text-[11px] font-semibold mt-2">
                  <span>{selectedItemForLabel.karat}K</span>
                  <span>{formatGrams(selectedItemForLabel.grossWeightMg)}g</span>
                  <span>Rs {selectedItemForLabel.makingChargesPkr}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-3 flex justify-between sm:justify-between">
            <Button variant="outline" size="sm" onClick={() => setSelectedItemForLabel(null)}>
              Close
            </Button>
            <Button size="sm" onClick={() => {
              toast.success("Printing tag on Zebra thermal printer...")
              setSelectedItemForLabel(null)
            }} className="font-semibold gap-1.5">
              <Printer className="size-4" /> Print Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: High-Res Image Preview Zoom */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-background border border-border">
          {previewImage && (
            <div>
              <div className="aspect-4/3 w-full bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={previewImage.url}
                  alt={previewImage.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 flex items-center justify-between bg-card border-t border-border">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{previewImage.name}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{previewImage.tag}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewImage(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default InventoryPage
