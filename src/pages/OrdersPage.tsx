import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CustomerOrder, CastingOrder, WorkshopWork } from '@/lib/types'
import { formatGrams, formatTMR, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { KaratBadge } from '@/components/shared/KaratBadge'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Hammer,
  Plus,
  Flame,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'

export const OrdersPage: React.FC = () => {
  const {
    orders,
    addCustomerOrder,
    updateOrderStatus,
    castingOrders,
    addCastingOrder,
    receiveCastingOrder,
    works,
    addWorkshopWork,
    updateWorkStatus,
    customers,
    karigars,
    mandi,
  } = useApp()

  const [mainTab, setMainTab] = useState<'customer_orders' | 'casting_orders' | 'works' | 'group_purchi'>('customer_orders')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  // Customer Order Dialog (I+O)
  const [customerOrderOpen, setCustomerOrderOpen] = useState(false)
  const [orderCustomer, setOrderCustomer] = useState(customers[0]?.id || '')
  const [orderItemDesc, setOrderItemDesc] = useState('')
  const [orderWeightMg, setOrderWeightMg] = useState(23328) // 2 tolas
  const [orderCarat, setOrderCarat] = useState(22)
  const [orderRateLocked, setOrderRateLocked] = useState(false)
  const [orderMakingCharges, setOrderMakingCharges] = useState(15000)
  const [orderAdvanceGoldMg, setOrderAdvanceGoldMg] = useState(0)
  const [orderAdvanceCashPkr, setOrderAdvanceCashPkr] = useState(50000)
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('2026-10-10')
  const [orderPriority, setOrderPriority] = useState<'normal' | 'urgent'>('normal')
  const [orderKarigar, setOrderKarigar] = useState(karigars[0]?.name || '')
  const [orderRemarks, setOrderRemarks] = useState('')

  // Casting Order Dialog (F5)
  const [castingOpen, setCastingOpen] = useState(false)
  const [castKarigarId, setCastKarigarId] = useState(karigars[0]?.id || '')
  const [castMetal, setCastMetal] = useState<'gold' | 'silver'>('gold')
  const [castCarat, setCastCarat] = useState(21)
  const [castIssuedMg, setCastIssuedMg] = useState(34992) // 3 tolas
  const [castWastagePercent, setCastWastagePercent] = useState(2.0)
  const [castPurpose, setCastPurpose] = useState('Bangles batch casting')
  const [castDueDate, setCastDueDate] = useState('2026-10-05')

  // Casting Receive Dialog
  const [receivingCastOrder, setReceivingCastOrder] = useState<CastingOrder | null>(null)
  const [castReturnedMg, setCastReturnedMg] = useState(0)

  // Works Form Dialog (F12)
  const [worksOpen, setWorksOpen] = useState(false)
  const [workKarigarId, setWorkKarigarId] = useState(karigars[0]?.id || '')
  const [workType, setWorkType] = useState<'Polish' | 'Setting' | 'Casting' | 'Repair' | 'Other'>('Setting')
  const [workWeightInMg, setWorkWeightInMg] = useState(23328)
  const [workWeightOutMg, setWorkWeightOutMg] = useState(23200)
  const [workLabourCharges, setWorkLabourCharges] = useState(4000)
  const [workRemarks, setWorkRemarks] = useState('')

  // Group Purchi Add (I+A / Section 6.8)
  const [groupRows, setGroupRows] = useState([
    { id: 1, desc: 'Gold Ring 22K', weightMg: 5832, cutMg: 122, rate: mandi.pkrPerTola24k },
    { id: 2, desc: 'Gold Earring Pair', weightMg: 11664, cutMg: 243, rate: mandi.pkrPerTola24k },
  ])

  const handleCreateCustomerOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const cust = customers.find((c) => c.id === orderCustomer)
    if (!cust) {
      toast.error("Please select a customer.")
      return
    }

    addCustomerOrder({
      date: new Date().toISOString().split('T')[0],
      customerId: cust.id,
      customerName: cust.name,
      itemDescription: orderItemDesc || 'Custom Jewellery Order',
      weightRequiredMg: orderWeightMg,
      carat: orderCarat,
      rateLocked: orderRateLocked,
      lockedRatePkr: orderRateLocked ? mandi.pkrPerTola24k : undefined,
      makingChargesPkr: orderMakingCharges,
      advanceGoldMg: orderAdvanceGoldMg,
      advanceCashPkr: orderAdvanceCashPkr,
      deliveryDate: orderDeliveryDate,
      priority: orderPriority,
      status: 'pending',
      karigarName: orderKarigar,
      remarks: orderRemarks,
    })

    toast.success("Customer order created successfully!")
    setCustomerOrderOpen(false)
  }

  const handleCreateCastingOrder = () => {
    const k = karigars.find((kar) => kar.id === castKarigarId)
    if (!k) return

    const expectedReturn = Math.round(castIssuedMg * (1 - castWastagePercent / 100))

    addCastingOrder({
      date: new Date().toISOString().split('T')[0],
      karigarId: k.id,
      karigarName: k.name,
      metal: castMetal,
      carat: castCarat,
      issuedWeightMg: castIssuedMg,
      expectedReturnMg: expectedReturn,
      wastageAllowedPercent: castWastagePercent,
      purpose: castPurpose,
      dueDate: castDueDate,
      status: 'issued',
    })

    toast.success(`Casting Order issued to ${k.name} (${formatGrams(castIssuedMg)}g)!`)
    setCastingOpen(false)
  }

  const handleSaveReceiveCasting = () => {
    if (!receivingCastOrder) return
    receiveCastingOrder(receivingCastOrder.id, castReturnedMg)
    toast.success(`Casting Order ${receivingCastOrder.orderNo} received. Stock & Wastage reconciled!`)
    setReceivingCastOrder(null)
  }

  const handleCreateWork = () => {
    const k = karigars.find((kar) => kar.id === workKarigarId)
    if (!k) return

    addWorkshopWork({
      date: new Date().toISOString().split('T')[0],
      karigarId: k.id,
      karigarName: k.name,
      workType,
      weightInMg: workWeightInMg,
      weightOutMg: workWeightOutMg,
      labourChargesPkr: workLabourCharges,
      status: 'In Progress',
      remarks: workRemarks,
    })

    toast.success(`Workshop Job registered for ${k.name}!`)
    setWorksOpen(false)
  }

  const kanbanColumns = [
    { id: 'pending', label: 'Pending Queue', color: 'border-amber-400 bg-amber-500/10' },
    { id: 'in_workshop', label: 'In Workshop (Karigar)', color: 'border-blue-400 bg-blue-500/10' },
    { id: 'ready', label: 'Ready for Delivery', color: 'border-emerald-400 bg-emerald-500/10' },
    { id: 'delivered', label: 'Delivered', color: 'border-zinc-400 bg-muted/40' },
  ]

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header Toolbar */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-foreground" />
          <h1 className="font-bold text-sm text-foreground">Workshop Orders, Casting & Job Works</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle (List vs Kanban for Customer Orders) */}
          {mainTab === 'customer_orders' && (
            <div className="flex rounded border bg-muted p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                }`}
              >
                <List className="h-3 w-3" /> List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                  viewMode === 'kanban' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
                }`}
              >
                <LayoutGrid className="h-3 w-3" /> Board
              </button>
            </div>
          )}

          {mainTab === 'customer_orders' && (
            <Button
              size="sm"
              onClick={() => setCustomerOrderOpen(true)}
              className="h-8 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs gap-1.5 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              New Order (I+O)
            </Button>
          )}

          {mainTab === 'casting_orders' && (
            <Button
              size="sm"
              onClick={() => setCastingOpen(true)}
              className="h-8 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs gap-1.5 shadow-xs"
            >
              <Flame className="h-4 w-4" />
              Issue Casting (F5)
            </Button>
          )}

          {mainTab === 'works' && (
            <Button
              size="sm"
              onClick={() => setWorksOpen(true)}
              className="h-8 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs gap-1.5 shadow-xs"
            >
              <Hammer className="h-4 w-4" />
              New Job Work (F12)
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <Tabs
        value={mainTab}
        onValueChange={(v) => setMainTab(v as any)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 border-b bg-card/30">
          <TabsList className="h-10 bg-transparent p-0 gap-4">
            <TabsTrigger
              value="customer_orders"
              className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none h-10 px-2"
            >
              Customer Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="casting_orders"
              className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none h-10 px-2"
            >
              Casting Orders ({castingOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="works"
              className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none h-10 px-2"
            >
              Workshop Works ({works.length})
            </TabsTrigger>
            <TabsTrigger
              value="group_purchi"
              className="text-xs font-semibold data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:text-foreground rounded-none h-10 px-2"
            >
              Group Purchi (I+A)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: Customer Orders (List or Kanban) */}
        <TabsContent value="customer_orders" className="flex-1 overflow-y-auto p-4 mt-0">
          {viewMode === 'list' ? (
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Required Wt</th>
                    <th className="py-3 px-4">Karat</th>
                    <th className="py-3 px-4 text-right">Advance Cash</th>
                    <th className="py-3 px-4">Delivery Date</th>
                    <th className="py-3 px-4">Karigar</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground">#{o.orderNo}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{o.date}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{o.customerName}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate">{o.itemDescription}</td>
                      <td className="py-3 px-4 font-mono text-right font-bold">{formatGrams(o.weightRequiredMg)}g</td>
                      <td className="py-3 px-4"><KaratBadge karat={o.carat} size="sm" /></td>
                      <td className="py-3 px-4 font-mono text-right font-semibold text-foreground">{formatMoney(o.advanceCashPkr)}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{o.deliveryDate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{o.karigarName || '—'}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={
                            o.status === 'ready'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : o.status === 'in_workshop'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Select
                          value={o.status}
                          onValueChange={(val: any) => updateOrderStatus(o.id, val)}
                        >
                          <SelectTrigger className="h-6 w-24 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_workshop">Workshop</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Kanban Board */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
              {kanbanColumns.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.id)
                return (
                  <div key={col.id} className="flex flex-col rounded-lg border bg-card shadow-xs overflow-hidden">
                    <div className={`p-2.5 border-b font-bold text-xs flex items-center justify-between ${col.color}`}>
                      <span>{col.label}</span>
                      <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-background/80">
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {colOrders.map((o) => (
                        <div key={o.id} className="p-3 rounded-md border bg-background shadow-xs space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-bold text-amber-700">#{o.orderNo}</span>
                            <span className="text-[10px] text-muted-foreground">{o.deliveryDate}</span>
                          </div>
                          <div className="font-semibold text-foreground">{o.itemDescription}</div>
                          <div className="text-[11px] text-muted-foreground flex justify-between">
                            <span>Cust: {o.customerName}</span>
                            <span className="font-mono font-bold">{formatGrams(o.weightRequiredMg)}g</span>
                          </div>
                          <div className="pt-1 border-t flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">Karigar: {o.karigarName || 'None'}</span>
                            <KaratBadge karat={o.carat} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: Casting Orders (F5) */}
        <TabsContent value="casting_orders" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Cast #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Karigar / Caster</th>
                  <th className="py-3 px-4">Metal / Karat</th>
                  <th className="py-3 px-4 text-right">Issued Wt</th>
                  <th className="py-3 px-4 text-right">Expected Return</th>
                  <th className="py-3 px-4 text-right">Returned Wt</th>
                  <th className="py-3 px-4 text-right">Wastage Allowed</th>
                  <th className="py-3 px-4 text-right">Actual Wastage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {castingOrders.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">#{c.orderNo}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{c.date}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{c.karigarName}</td>
                    <td className="py-3 px-4 uppercase font-mono">{c.metal} {c.carat}K</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-foreground">{formatGrams(c.issuedWeightMg)}g</td>
                    <td className="py-3 px-4 font-mono text-right">{formatGrams(c.expectedReturnMg)}g</td>
                    <td className="py-3 px-4 font-mono text-right font-bold text-foreground">
                      {c.returnedWeightMg ? `${formatGrams(c.returnedWeightMg)}g` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-right">{c.wastageAllowedPercent}%</td>
                    <td className="py-3 px-4 font-mono text-right font-semibold">
                      {c.actualWastageMg ? `${formatGrams(c.actualWastageMg)}g` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={c.status === 'received' ? 'bg-muted text-foreground' : 'bg-muted/40 text-muted-foreground'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.status === 'issued' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReceivingCastOrder(c)
                            setCastReturnedMg(c.expectedReturnMg)
                          }}
                          className="h-6 text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        >
                          Receive
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 3: Works Form (F12) */}
        <TabsContent value="works" className="flex-1 overflow-y-auto p-4 mt-0">
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted/70 sticky top-0 border-b text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Job #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Karigar</th>
                  <th className="py-3 px-4">Work Type</th>
                  <th className="py-3 px-4 text-right">Weight In</th>
                  <th className="py-3 px-4 text-right">Weight Out</th>
                  <th className="py-3 px-4 text-right">Labour Charges</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {works.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">#{w.jobNo}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{w.date}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{w.karigarName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">{w.workType}</Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-right">{formatGrams(w.weightInMg)}g</td>
                    <td className="py-3 px-4 font-mono text-right font-bold">{formatGrams(w.weightOutMg)}g</td>
                    <td className="py-3 px-4 font-mono text-right font-semibold text-foreground">
                      {formatMoney(w.labourChargesPkr)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={w.status === 'Completed' ? 'bg-muted text-foreground' : 'bg-muted/40 text-muted-foreground'}>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-[11px] truncate max-w-[150px]">{w.remarks || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      {w.status !== 'Completed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateWorkStatus(w.id, 'Completed')}
                          className="h-6 text-[10px] text-emerald-700 hover:bg-emerald-50 font-semibold"
                        >
                          Mark Done
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* TAB 4: Group Purchi Add (I+A / Section 6.8) */}
        <TabsContent value="group_purchi" className="flex-1 overflow-y-auto p-4 mt-0 space-y-4">
          <div className="p-4 bg-card rounded-lg border shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Group Purchi / Multi-Item Slip (I+A)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Build multi-item purchase slip and save as a batch transaction.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setGroupRows((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      desc: `Item ${prev.length + 1}`,
                      weightMg: 11664,
                      cutMg: 243,
                      rate: mandi.pkrPerTola24k,
                    },
                  ])
                }}
                className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1"
              >
                <Plus className="h-3 w-3" /> Add Row (Ctrl+Enter)
              </Button>
            </div>

            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Gross Wt (g)</th>
                  <th className="py-2 px-3 text-right">Cut (g)</th>
                  <th className="py-2 px-3 text-right">Net Wt (g)</th>
                  <th className="py-2 px-3 text-right">Rate / Tola</th>
                  <th className="py-2 px-3 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {groupRows.map((r, i) => {
                  const net = Math.max(0, r.weightMg - r.cutMg)
                  const amt = Math.round((net / 11664) * r.rate)
                  return (
                    <tr key={r.id}>
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3 font-sans font-medium">{r.desc}</td>
                      <td className="py-2 px-3 text-right">{formatGrams(r.weightMg)}g</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">−{formatGrams(r.cutMg)}g</td>
                      <td className="py-2 px-3 text-right font-bold">{formatGrams(net)}g</td>
                      <td className="py-2 px-3 text-right">{r.rate.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold">{formatMoney(amt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="pt-3 border-t flex justify-between items-center text-xs">
              <div className="text-muted-foreground">
                Total Items: <strong>{groupRows.length}</strong>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Temporary group cleared")}
                  className="text-xs"
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.success("Group Purchi saved and converted to Bill!")}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                >
                  Save Group & Print
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: Customer Order (I+O) */}
      <Dialog open={customerOrderOpen} onOpenChange={setCustomerOrderOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-6 overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-semibold text-foreground">
              New Customer Jewellery Order (I+O)
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomerOrder} className="space-y-3.5 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select Customer *</Label>
              <Select value={orderCustomer} onValueChange={setOrderCustomer}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Pick customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.id}) • {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Item Description *</Label>
              <Input
                value={orderItemDesc}
                onChange={(e) => setOrderItemDesc(e.target.value)}
                placeholder="e.g. 21K Antique Bridal Choker with Ruby stones"
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weight Required (Tola/Masha/Ratti/Grams)</Label>
              <WeightInput
                value={orderWeightMg}
                onChange={setOrderWeightMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Karat</Label>
                <Select value={orderCarat.toString()} onValueChange={(v) => setOrderCarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K (Pure Gold)</SelectItem>
                    <SelectItem value="22">22K (Jewellery)</SelectItem>
                    <SelectItem value="21">21K (Arabian)</SelectItem>
                    <SelectItem value="18">18K (Diamond Mount)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Making Charges (PKR)</Label>
                <MoneyInput
                  value={orderMakingCharges}
                  onChange={setOrderMakingCharges}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Advance Cash Received</Label>
                <MoneyInput
                  value={orderAdvanceCashPkr}
                  onChange={setOrderAdvanceCashPkr}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Due Date</Label>
                <Input
                  type="date"
                  value={orderDeliveryDate}
                  onChange={(e) => setOrderDeliveryDate(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Assign Workshop Karigar</Label>
                <Select value={orderKarigar} onValueChange={setOrderKarigar}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {karigars.map((k) => (
                      <SelectItem key={k.id} value={k.name}>
                        {k.name} ({k.speciality})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Priority</Label>
                <Select value={orderPriority} onValueChange={(v: any) => setOrderPriority(v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="urgent">URGENT Rush Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold cursor-pointer">Lock Today's Gold Rate?</Label>
                <p className="text-[10px] text-muted-foreground">Locks rate at Rs {mandi.pkrPerTola24k.toLocaleString()}/tola</p>
              </div>
              <Switch checked={orderRateLocked} onCheckedChange={setOrderRateLocked} />
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setCustomerOrderOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-foreground hover:bg-foreground/90 text-background font-medium">
                Save Order Slip
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Issue Casting Order (F5) */}
      <Dialog open={castingOpen} onOpenChange={setCastingOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-semibold text-foreground">
              Issue Casting Order (F5)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Workshop Karigar / Caster *</Label>
              <Select value={castKarigarId} onValueChange={setCastKarigarId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {karigars.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Issued Metal Weight (Au)</Label>
              <WeightInput
                value={castIssuedMg}
                onChange={setCastIssuedMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Karat</Label>
                <Select value={castCarat.toString()} onValueChange={(v) => setCastCarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-8 text-xs font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K</SelectItem>
                    <SelectItem value="22">22K</SelectItem>
                    <SelectItem value="21">21K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Allowed Wastage (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={castWastagePercent}
                  onChange={(e) => setCastWastagePercent(parseFloat(e.target.value) || 0)}
                  className="h-8 font-mono text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Purpose / Casting Items</Label>
              <Input
                value={castPurpose}
                onChange={(e) => setCastPurpose(e.target.value)}
                placeholder="e.g. Ring batch casting"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setCastingOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateCastingOrder} className="bg-foreground hover:bg-foreground/90 text-background font-medium">
              Issue Casting (F5)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Receive Casting Dialog */}
      <Dialog open={!!receivingCastOrder} onOpenChange={(open) => !open && setReceivingCastOrder(null)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-semibold text-foreground">
              Receive Casting Order — #{receivingCastOrder?.orderNo}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Karigar: <strong>{receivingCastOrder?.karigarName}</strong> • Issued: {formatGrams(receivingCastOrder?.issuedWeightMg || 0)}g
            </p>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Actual Returned Weight (g)</Label>
              <WeightInput
                value={castReturnedMg}
                onChange={setCastReturnedMg}
              />
            </div>

            {receivingCastOrder && (
              <div className="p-3 bg-muted/40 rounded border space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Issued Weight:</span>
                  <span>{formatGrams(receivingCastOrder.issuedWeightMg)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-sans">Expected Return:</span>
                  <span>{formatGrams(receivingCastOrder.expectedReturnMg)}g</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span className="text-muted-foreground font-sans">Actual Wastage:</span>
                  <span className="text-red-600">
                    {formatGrams(Math.max(0, receivingCastOrder.issuedWeightMg - castReturnedMg))}g
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setReceivingCastOrder(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveReceiveCasting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Reconcile & Receive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Works Form (F12) */}
      <Dialog open={worksOpen} onOpenChange={setWorksOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-semibold text-foreground">
              Workshop Job Works Form (F12)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-3 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Assigned Karigar *</Label>
              <Select value={workKarigarId} onValueChange={setWorkKarigarId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {karigars.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Work Type</Label>
                <Select value={workType} onValueChange={(v: any) => setWorkType(v)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Setting">Stone Setting</SelectItem>
                    <SelectItem value="Polish">Polish & Rhodium</SelectItem>
                    <SelectItem value="Casting">Casting</SelectItem>
                    <SelectItem value="Repair">Repair / Sizing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Labour Charges (PKR)</Label>
                <MoneyInput
                  value={workLabourCharges}
                  onChange={setWorkLabourCharges}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weight In</Label>
              <WeightInput
                value={workWeightInMg}
                onChange={setWorkWeightInMg}
                compact={true}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weight Out (Expected/Finished)</Label>
              <WeightInput
                value={workWeightOutMg}
                onChange={setWorkWeightOutMg}
                compact={true}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Job Narration / Remarks</Label>
              <Input
                value={workRemarks}
                onChange={(e) => setWorkRemarks(e.target.value)}
                placeholder="e.g. Microsetting 24 zircon stones"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setWorksOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateWork} className="bg-foreground hover:bg-foreground/90 text-background font-medium">
              Issue Job Work (F12)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
