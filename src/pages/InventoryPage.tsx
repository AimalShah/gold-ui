import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { InventoryItem, RawStockLot } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
import { cn } from '@/lib/utils'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
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
  ArrowRightLeft,
  Users,
  CheckCircle,
  AlertTriangle,
  Flame,
  Printer,
  Package,
  LayoutGrid,
  List,
  Eye,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'

export const InventoryPage: React.FC = () => {
  const {
    inventoryItems,
    addInventoryItem,
    updateInventoryStatus,
    rawStock,
    addRawStockLot,
    movements,
    karigars,
    mandi,
  } = useApp()

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'raw' | 'movements' | 'karigar' | 'stocktake' | 'labels'>('overview')

  // Search & Filters for Finished Items
  const [itemSearch, setItemSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
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
    return true
  })

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) {
      toast.error("Please enter item name.")
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

    toast.success(`Inventory Item ${created.tagSku} added to stock!`)
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

  // Calculate Totals for Overview
  const totalFinishedGrossMg = inventoryItems.filter(i => i.status === 'in_stock').reduce((sum, i) => sum + i.grossWeightMg, 0)
  const totalFinishedNetMg = inventoryItems.filter(i => i.status === 'in_stock').reduce((sum, i) => sum + i.netWeightMg, 0)
  const totalRawGoldMg = rawStock.filter(r => r.metal === 'gold').reduce((sum, r) => sum + r.weightMg, 0)
  const totalRawFineGoldMg = rawStock.filter(r => r.metal === 'gold').reduce((sum, r) => sum + r.fineWeightMg, 0)
  const totalSilverMg = rawStock.filter(r => r.metal === 'silver').reduce((sum, r) => sum + r.weightMg, 0)
  const totalInventoryValuePkr = Math.round(((totalRawFineGoldMg + totalFinishedNetMg) / 11664) * mandi.pkrPerTola24k)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Jewellery Inventory & Raw Bullion Stock (NEW)</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRawStockOpen(true)}
            className="h-8 text-xs gap-1.5 font-semibold"
          >
            <Plus className="h-3.5 w-3.5 text-amber-600" />
            Add Raw Bullion
          </Button>

          <Button
            size="sm"
            onClick={() => setNewItemOpen(true)}
            className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5"
          >
            <Tag className="h-3.5 w-3.5" />
            New Jewellery Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 border-b bg-card/30">
          <TabsList className="h-10 bg-transparent p-0 gap-4">
            <TabsTrigger value="overview" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Overview & KPIs
            </TabsTrigger>
            <TabsTrigger value="items" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Finished Jewellery ({inventoryItems.length})
            </TabsTrigger>
            <TabsTrigger value="raw" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Raw Bullion Lots ({rawStock.length})
            </TabsTrigger>
            <TabsTrigger value="movements" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Movements Ledger ({movements.length})
            </TabsTrigger>
            <TabsTrigger value="karigar" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Karigar Held Metal
            </TabsTrigger>
            <TabsTrigger value="stocktake" className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none h-10 px-2">
              Stock-take Scan
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Overview */}
        <TabsContent value="overview" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-lg border bg-card shadow-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Fine Gold (24K)</span>
              <div className="text-xl font-mono font-bold text-foreground">
                {formatGrams(totalRawFineGoldMg + totalFinishedNetMg)} g
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">{formatTMR(totalRawFineGoldMg + totalFinishedNetMg)}</span>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-card shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Raw Bullion Gold</span>
              <div className="text-xl font-mono font-bold text-foreground">
                {formatGrams(totalRawGoldMg)} g
              </div>
              <span className="text-[11px] text-muted-foreground">{rawStock.length} Active Lots</span>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-card shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Finished Jewellery</span>
              <div className="text-xl font-mono font-bold text-foreground">
                {inventoryItems.filter(i => i.status === 'in_stock').length} Items
              </div>
              <span className="text-[11px] text-muted-foreground">Net Wt: {formatGrams(totalFinishedNetMg)}g</span>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-card shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Chandi / Silver</span>
              <div className="text-xl font-mono font-bold text-foreground">
                {formatGrams(totalSilverMg)} g
              </div>
              <span className="text-[11px] text-muted-foreground">500 Tolas Bullion</span>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-card shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Stock Value</span>
              <div className="text-xl font-mono font-bold text-foreground">
                {formatMoney(totalInventoryValuePkr)}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">@ Mandi Rs {mandi.pkrPerTola24k.toLocaleString()}</span>
            </div>
          </div>

          {/* Visual Showcase Strip of Finished Inventory */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Showcase Jewellery Stock
                </h3>
                <p className="text-[11px] text-muted-foreground">High-value finished inventory in showroom display</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('items')}
                className="text-xs text-foreground font-semibold"
              >
                View All {inventoryItems.length} Items →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {inventoryItems.slice(0, 7).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.image) setPreviewImage({ url: item.image, name: item.name, tag: item.tagSku })
                  }}
                  className="rounded-lg border border-border bg-muted/20 overflow-hidden hover:border-foreground/40 transition-all cursor-pointer group"
                >
                  <div className="aspect-square w-full bg-muted/50 overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-6 w-6 stroke-1" />
                      </div>
                    )}
                    <span className="absolute top-1 left-1 font-mono text-[9px] font-bold px-1 py-0.2 rounded bg-background/90 text-foreground border border-border">
                      {item.karat}K
                    </span>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <p className="text-[11px] font-semibold text-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {formatGrams(item.netWeightMg)}g Net
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent movements table preview */}
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b pb-2 flex items-center justify-between">
              <span>Recent Inventory Stock Movements</span>
              <span className="text-[11px] text-amber-700 font-mono">Real-time ledger</span>
            </h3>

            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Item / Lot</th>
                  <th className="py-2 px-3 text-right">Weight In</th>
                  <th className="py-2 px-3 text-right">Weight Out</th>
                  <th className="py-2 px-3">Ref</th>
                  <th className="py-2 px-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 px-3 font-sans text-muted-foreground">{m.date}</td>
                    <td className="py-2 px-3 font-sans">
                      <Badge variant="outline" className={m.type === 'Purchase' ? 'text-emerald-700' : 'text-blue-700'}>
                        {m.type}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 font-sans font-medium text-foreground">{m.itemOrLot}</td>
                    <td className="py-2 px-3 text-right text-emerald-700">{m.weightInMg ? `${formatGrams(m.weightInMg)}g` : '—'}</td>
                    <td className="py-2 px-3 text-right text-red-600">{m.weightOutMg ? `${formatGrams(m.weightOutMg)}g` : '—'}</td>
                    <td className="py-2 px-3 text-amber-700">{m.ref}</td>
                    <td className="py-2 px-3 text-muted-foreground font-sans">{m.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 2: Finished Jewellery Items */}
        <TabsContent value="items" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tag SKU, barcode, item name..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  className="pl-9 h-8 text-xs font-medium"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Ring">Rings</SelectItem>
                  <SelectItem value="Necklace">Necklaces</SelectItem>
                  <SelectItem value="Bangle">Bangles</SelectItem>
                  <SelectItem value="Chain">Chains</SelectItem>
                  <SelectItem value="Earring">Earrings</SelectItem>
                  <SelectItem value="Set">Bridal Sets</SelectItem>
                  <SelectItem value="Other">Bullion & Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {filteredItems.length} Items Found
              </span>

              {/* View Mode Toggle: Grid vs Table */}
              <div className="flex rounded-md border border-border bg-muted p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setItemViewMode('grid')}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                    itemViewMode === 'grid'
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Gallery Cards View with Product Photos"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemViewMode('table')}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                    itemViewMode === 'table'
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List Table View"
                >
                  <List className="h-3.5 w-3.5" />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW 1: GALLERY GRID WITH IMAGES */}
          {itemViewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with Zoom on Click */}
                    <div
                      onClick={() => item.image && setPreviewImage({ url: item.image, name: item.name, tag: item.tagSku })}
                      className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden cursor-pointer flex items-center justify-center border-b border-border/80"
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
                          <Package className="h-10 w-10 stroke-1" />
                          <span className="text-[10px] mt-1 font-mono">No Photo</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <KaratBadge karat={item.karat} size="sm" />
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/90 text-foreground border border-border shadow-xs font-bold">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-mono bg-background/90 border-border",
                            item.status === 'in_stock' ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                          )}
                        >
                          {item.status === 'in_stock' ? 'In Stock' : item.status}
                        </Badge>
                      </div>

                      {item.image && (
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 text-foreground px-2 py-1 rounded text-[10px] flex items-center gap-1 font-medium shadow-xs border border-border">
                          <Eye className="h-3 w-3" /> Zoom
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-muted-foreground">{item.tagSku}</span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{item.locationTray}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground tracking-tight line-clamp-1 mt-0.5" title={item.name}>
                          {item.name}
                        </h4>
                      </div>

                      {/* Weight pill */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg bg-muted/40 border border-border">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-sans block">Net Gold Wt</span>
                          <span className="font-bold text-foreground text-sm">{formatGrams(item.netWeightMg)}g</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground font-sans block">Gross Wt</span>
                          <span className="text-muted-foreground">{formatGrams(item.grossWeightMg)}g</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <span className="text-muted-foreground">Making Charges:</span>
                        <span className="font-mono font-semibold text-foreground">
                          {formatMoney(item.makingChargesPkr)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-3 border-t border-border bg-muted/20 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItemForLabel(item)}
                      className="flex-1 h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5 text-muted-foreground" />
                      Print Tag
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VIEW 2: STRUCTURED TABLE WITH THUMBNAILS */
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Photo</th>
                    <th className="py-2.5 px-3">SKU / Tag</th>
                    <th className="py-2.5 px-3">Barcode</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Karat</th>
                    <th className="py-2.5 px-3 text-right">Gross Wt</th>
                    <th className="py-2.5 px-3 text-right">Stone Wt</th>
                    <th className="py-2.5 px-3 text-right font-bold text-foreground">Net Wt (Au)</th>
                    <th className="py-2.5 px-3 text-right">Making</th>
                    <th className="py-2.5 px-3">Tray / Location</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2 px-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            onClick={() => setPreviewImage({ url: item.image!, name: item.name, tag: item.tagSku })}
                            className="h-10 w-10 rounded-md object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-foreground">{item.tagSku}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{item.barcode}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3">{item.category}</td>
                      <td className="py-2.5 px-3"><KaratBadge karat={item.karat} size="sm" /></td>
                      <td className="py-2.5 px-3 font-mono text-right">{formatGrams(item.grossWeightMg)}g</td>
                      <td className="py-2.5 px-3 font-mono text-right text-muted-foreground">{formatGrams(item.stoneWeightMg)}g</td>
                      <td className="py-2.5 px-3 font-mono text-right font-bold text-foreground">{formatGrams(item.netWeightMg)}g</td>
                      <td className="py-2.5 px-3 font-mono text-right text-foreground">{formatMoney(item.makingChargesPkr)}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{item.locationTray}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant="outline" className={item.status === 'in_stock' ? 'bg-muted text-foreground border-border' : 'bg-muted text-muted-foreground'}>
                          {item.status === 'in_stock' ? 'In Stock' : item.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedItemForLabel(item)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Print Barcode Tag"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* TAB 3: Raw Stock */}
        <TabsContent value="raw" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Lot #</th>
                  <th className="py-2.5 px-3">Metal</th>
                  <th className="py-2.5 px-3">Purity Karat</th>
                  <th className="py-2.5 px-3 text-right">Gross Weight</th>
                  <th className="py-2.5 px-3 text-right">Fine Weight (24K)</th>
                  <th className="py-2.5 px-3 text-right">Avg Cost / Tola</th>
                  <th className="py-2.5 px-3 text-right font-bold">Estimated Value</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {rawStock.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{r.id}</td>
                    <td className="py-2.5 px-3 font-sans capitalize font-semibold">{r.metal}</td>
                    <td className="py-2.5 px-3">{r.karat}K</td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatGrams(r.weightMg)}g</td>
                    <td className="py-2.5 px-3 text-right text-amber-700 font-bold">{formatGrams(r.fineWeightMg)}g</td>
                    <td className="py-2.5 px-3 text-right">{formatMoney(r.avgCostPerTolaPkr)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">{formatMoney(r.valuePkr)}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-[11px]">{r.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 4: Movements */}
        <TabsContent value="movements" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Item / Bullion Lot</th>
                  <th className="py-2.5 px-3 text-right">Weight In</th>
                  <th className="py-2.5 px-3 text-right">Weight Out</th>
                  <th className="py-2.5 px-3 text-right font-bold">Balance</th>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-3 font-sans">{m.date}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold">{m.type}</td>
                    <td className="py-2.5 px-3 font-sans">{m.itemOrLot}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">{m.weightInMg ? `${formatGrams(m.weightInMg)}g` : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-red-600">{m.weightOutMg ? `${formatGrams(m.weightOutMg)}g` : '—'}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatGrams(m.balanceMg)}g</td>
                    <td className="py-2.5 px-3 text-amber-700">{m.ref}</td>
                    <td className="py-2.5 px-3 font-sans text-muted-foreground">{m.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 5: Karigar */}
        <TabsContent value="karigar" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {karigars.map((k) => (
              <div key={k.id} className="p-4 rounded-lg border bg-card space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{k.name}</h3>
                    <p className="text-xs text-muted-foreground">{k.speciality}</p>
                    <p className="text-[11px] text-muted-foreground">{k.city} • {k.phone}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {k.activeJobs} Jobs
                  </Badge>
                </div>

                <div className="p-2.5 bg-muted/40 rounded border space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Gold Held Balance:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{formatGrams(k.goldHeldMg)}g</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground text-right">{formatTMR(k.goldHeldMg)}</div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-muted-foreground font-sans">Silver Held:</span>
                    <span>{formatGrams(k.silverHeldMg)}g</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Issue metal to ${k.name}`)}
                    className="flex-1 text-xs"
                  >
                    Issue Metal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(`Receive metal from ${k.name}`)}
                    className="flex-1 text-xs"
                  >
                    Receive Metal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 6: Stock-take Scan */}
        <TabsContent value="stocktake" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="p-4 bg-card rounded-lg border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Physical Stock-take & Barcode Audit Session
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scan jewellery tag barcodes to compare physical stock with system records.
                </p>
              </div>

              <Badge className="bg-emerald-600 text-white font-mono">
                {stocktakeScanned.length} Scanned
              </Badge>
            </div>

            <form onSubmit={handleScanBarcode} className="flex gap-2">
              <Input
                type="text"
                placeholder="Scan barcode or enter SKU (e.g. 890122003, 890122004)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="h-9 text-xs font-mono"
                autoFocus
              />
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs">
                Scan Item
              </Button>
            </form>

            <div className="border rounded-md divide-y text-xs">
              {inventoryItems.map((item) => {
                const isScanned = stocktakeScanned.includes(item.barcode) || stocktakeScanned.includes(item.tagSku)
                return (
                  <div key={item.id} className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isScanned ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <div>
                        <span className="font-bold">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono ml-2">({item.barcode})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono">{formatGrams(item.netWeightMg)}g</span>
                      <Badge variant="outline" className={isScanned ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-700 border-red-300'}>
                        {isScanned ? 'Verified Present' : 'Unscanned / Missing'}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: New Jewellery Item Sheet */}
      <Sheet open={newItemOpen} onOpenChange={setNewItemOpen}>
        <SheetContent className="w-[450px] sm:max-w-[500px] flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="text-base font-bold text-amber-900 dark:text-amber-300">
              New Finished Jewellery Stock Item
            </SheetTitle>
            <SheetDescription className="text-xs">
              Assign tag SKU, barcode, gross & net weights, making charges and display tray.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreateItem} className="space-y-3.5 py-4 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Item Title *</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. 22K Kundan Choker Necklace"
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Select value={itemCategory} onValueChange={(v: any) => setItemCategory(v)}>
                  <SelectTrigger className="h-8 text-xs">
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

              <div className="space-y-1">
                <Label className="text-xs">Purity Karat</Label>
                <Select value={itemKarat.toString()} onValueChange={(v) => setItemKarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K Pure</SelectItem>
                    <SelectItem value="22">22K Standard</SelectItem>
                    <SelectItem value="21">21K Arabian</SelectItem>
                    <SelectItem value="18">18K Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Gross Weight (WeightInput)</Label>
              <WeightInput
                value={itemGrossMg}
                onChange={setItemGrossMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Stone / Bead Weight</Label>
                <WeightInput
                  value={itemStoneMg}
                  onChange={setItemStoneMg}
                  compact={true}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Stone Cost (PKR)</Label>
                <MoneyInput
                  value={itemStoneCost}
                  onChange={setItemStoneCost}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Making Charges (PKR)</Label>
                <MoneyInput
                  value={itemMakingCharges}
                  onChange={setItemMakingCharges}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Location / Tray</Label>
                <Input
                  value={itemTray}
                  onChange={(e) => setItemTray(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Product Image URL with Presets */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Product Image URL</span>
                <span className="text-[10px] text-muted-foreground font-mono">Quick Preset or Web URL</span>
              </Label>
              <Input
                value={itemImage}
                onChange={(e) => setItemImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-8 text-xs font-mono"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { label: 'Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Bangle', url: 'https://images.unsplash.com/photo-1611591475812-70b028448f21?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Necklace', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Chain', url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Earring', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Gold Bar', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80' },
                  { label: 'Bridal Set', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setItemImage(preset.url)}
                    className="px-2 py-0.5 rounded text-[10px] border border-border bg-muted/50 hover:bg-muted font-medium transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
              {itemImage && (
                <div className="h-20 w-full rounded border overflow-hidden mt-1.5 bg-muted/20">
                  <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border flex justify-between items-center font-mono">
              <span className="text-xs font-sans font-semibold text-foreground">Calculated Net Gold:</span>
              <span className="text-base font-bold text-foreground">
                {formatGrams(Math.max(0, itemGrossMg - itemStoneMg), 3)} g
              </span>
            </div>

            <SheetFooter className="pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setNewItemOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-semibold cursor-pointer">
                Save & Generate Barcode
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* MODAL 2: Add Raw Stock Lot */}
      <Dialog open={rawStockOpen} onOpenChange={setRawStockOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold text-foreground">
              Purchase & Add Raw Bullion Stock
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Metal</Label>
                <Select value={rawMetal} onValueChange={(v: any) => setRawMetal(v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold (Tezabi / Passa)</SelectItem>
                    <SelectItem value="silver">Silver (Chandi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Purity Karat</Label>
                <Select value={rawKarat.toString()} onValueChange={(v) => setRawKarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K (Pure Bullion)</SelectItem>
                    <SelectItem value="22">22K</SelectItem>
                    <SelectItem value="21">21K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weight</Label>
              <WeightInput
                value={rawWeightMg}
                onChange={setRawWeightMg}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Purchase Cost Rate / Tola (PKR)</Label>
              <MoneyInput
                value={rawCostPerTola}
                onChange={setRawCostPerTola}
                className="h-9 font-bold"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setRawStockOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddRawStock} className="bg-foreground text-background hover:bg-foreground/90 font-semibold cursor-pointer">
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
              <QrCode className="h-5 w-5 text-foreground" />
              Jewellery Tag Barcode Preview
            </DialogTitle>
          </DialogHeader>

          {selectedItemForLabel && (
            <div className="py-4 flex flex-col items-center space-y-2">
              <div className="w-56 p-3 rounded-md border bg-white text-zinc-950 font-mono shadow-sm text-xs leading-tight">
                <div className="font-bold font-serif text-[11px]">GOLD KING JEWELLERS</div>
                <div className="text-[10px] text-zinc-500 font-sans truncate">{selectedItemForLabel.name}</div>
                {/* Barcode representation */}
                <div className="my-2 h-10 bg-zinc-900 flex items-center justify-center text-white tracking-[6px] text-xs font-mono font-bold">
                  ||||||||||||||||||||||||||
                </div>
                <div className="text-[10px] font-bold">{selectedItemForLabel.barcode}</div>
                <div className="flex justify-between pt-1 border-t border-zinc-200 text-[10px] font-bold">
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
              toast.success("Sending to Zebra barcode label printer...")
              setSelectedItemForLabel(null)
            }} className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-1.5 cursor-pointer">
              <Printer className="h-4 w-4" /> Print Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: High-Res Jewellery Image Zoom Preview */}
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
