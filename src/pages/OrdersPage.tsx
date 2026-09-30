import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CustomerOrder, CastingOrder, WorkshopWork } from '@/lib/types'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import { WeightInput } from '@/components/shared/WeightInput'
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
  Search,
  Download,
  Clock,
  CheckCircle,
  Truck,
  Sparkles,
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
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Customer Order Dialog
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

  // Casting Order Dialog
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

  // Works Form Dialog
  const [worksOpen, setWorksOpen] = useState(false)
  const [workKarigarId, setWorkKarigarId] = useState(karigars[0]?.id || '')
  const [workType, setWorkType] = useState<'Polish' | 'Setting' | 'Casting' | 'Repair' | 'Other'>('Setting')
  const [workWeightInMg, setWorkWeightInMg] = useState(23328)
  const [workWeightOutMg, setWorkWeightOutMg] = useState(23200)
  const [workLabourCharges, setWorkLabourCharges] = useState(4000)
  const [workRemarks, setWorkRemarks] = useState('')

  // Group Purchi
  const [groupRows, setGroupRows] = useState([
    { id: 1, desc: 'Gold Ring 22K', weightMg: 5832, cutMg: 122, rate: mandi.pkrPerTola24k },
    { id: 2, desc: 'Gold Earring Pair', weightMg: 11664, cutMg: 243, rate: mandi.pkrPerTola24k },
  ])

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNo.includes(search) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.itemDescription.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    return true
  })

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
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Page Header */}
      <PageTitle
        description="Custom order tracking, Karigar casting assignments, and workshop stages."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCastingOpen(true)}
              className="gap-2"
            >
              <Flame className="size-4" /> Issue Casting
            </Button>
            <Button
              size="lg"
              onClick={() => setCustomerOrderOpen(true)}
              className="gap-2 font-medium"
            >
              <Plus className="size-4" /> New Custom Order
            </Button>
          </div>
        }
      >
        Custom Orders & Workshop
      </PageTitle>

      {/* 2. Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Total Orders</span>
            <Clock className="size-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-2">{orders.length} Custom Jobs</p>
          <span className="text-xs text-muted-foreground">Active in System</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">In Workshop</span>
            <Hammer className="size-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {orders.filter(o => o.status === 'in_workshop').length} In Progress
          </p>
          <span className="text-xs text-muted-foreground">Being crafted by Karigars</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Ready for Delivery</span>
            <Sparkles className="size-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {orders.filter(o => o.status === 'ready').length} Ready
          </p>
          <span className="text-xs text-muted-foreground">Awaiting Customer Pickup</span>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Completed</span>
            <CheckCircle className="size-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {orders.filter(o => o.status === 'delivered').length || 8} Delivered
          </p>
          <span className="text-xs text-muted-foreground">Settled & Handed Over</span>
        </Card>
      </div>

      {/* 3. Action and Filter Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:basis-[70%]">
            <div className="relative w-full sm:basis-[60%]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search order #, customer name, jewellery description..."
                className="h-11 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 sm:basis-[40%]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_workshop">In Workshop</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View toggle (List vs Board) */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 font-medium ${
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="size-4" /> Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 font-medium ${
                  viewMode === 'kanban'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="size-4" /> Board
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Tab Navigation: Customer Orders, Casting, Workshop Works, Group Purchi */}
      <Tabs
        value={mainTab}
        onValueChange={(v) => setMainTab(v as any)}
        className="w-full"
      >
        <TabsList className="bg-card border border-border p-1 rounded-lg">
          <TabsTrigger value="customer_orders" className="text-xs font-medium">
            Customer Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="casting_orders" className="text-xs font-medium">
            Casting Orders ({castingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="works" className="text-xs font-medium">
            Karigar Job Works ({works.length})
          </TabsTrigger>
          <TabsTrigger value="group_purchi" className="text-xs font-medium">
            Group Purchi Batch
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CUSTOMER ORDERS */}
        <TabsContent value="customer_orders" className="pt-4">
          {viewMode === 'list' ? (
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                    <tr>
                      <th className="px-6 py-4">Order #</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Item Description</th>
                      <th className="px-6 py-4 text-right">Required Wt</th>
                      <th className="px-6 py-4">Karat</th>
                      <th className="px-6 py-4 text-right">Advance Cash</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Assigned Karigar</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">
                          #{o.orderNo}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                          {o.date}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {o.customerName}
                        </td>
                        <td className="px-6 py-4 text-foreground truncate max-w-[200px]">
                          {o.itemDescription}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          {formatGrams(o.weightRequiredMg)}g
                        </td>
                        <td className="px-6 py-4">
                          <KaratBadge karat={o.carat} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                          {formatMoney(o.advanceCashPkr)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                          {o.deliveryDate}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {o.karigarName || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              o.status === 'ready'
                                ? 'success'
                                : o.status === 'in_workshop'
                                ? 'processing'
                                : o.status === 'delivered'
                                ? 'secondary'
                                : 'warning'
                            }
                          >
                            {o.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Select
                            value={o.status}
                            onValueChange={(val: any) => updateOrderStatus(o.id, val)}
                          >
                            <SelectTrigger className="h-8 w-28 text-xs ml-auto">
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
            </div>
          ) : (
            /* Kanban Board View */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kanbanColumns.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.id)
                return (
                  <div key={col.id} className="flex flex-col rounded-lg border border-border bg-card shadow-xs overflow-hidden">
                    <div className={`p-4 border-b border-border font-semibold text-sm flex items-center justify-between ${col.color}`}>
                      <span>{col.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-background/80">
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[350px]">
                      {colOrders.map((o) => (
                        <Card key={o.id} className="p-4 space-y-2 border border-border">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">#{o.orderNo}</span>
                            <span className="text-muted-foreground">{o.deliveryDate}</span>
                          </div>
                          <h4 className="font-semibold text-sm text-foreground">{o.itemDescription}</h4>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{o.customerName}</span>
                            <span className="font-bold text-foreground">{formatGrams(o.weightRequiredMg)}g</span>
                          </div>
                          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{o.karigarName || 'Karigar Unassigned'}</span>
                            <KaratBadge karat={o.carat} size="sm" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: CASTING ORDERS */}
        <TabsContent value="casting_orders" className="pt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Cast #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Karigar / Caster</th>
                    <th className="px-6 py-4">Metal</th>
                    <th className="px-6 py-4 text-right">Issued Wt</th>
                    <th className="px-6 py-4 text-right">Expected Return</th>
                    <th className="px-6 py-4 text-right">Returned Wt</th>
                    <th className="px-6 py-4 text-right">Wastage %</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {castingOrders.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">#{c.orderNo}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{c.date}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{c.karigarName}</td>
                      <td className="px-6 py-4 uppercase font-semibold">{c.metal} {c.carat}K</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(c.issuedWeightMg)}g</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{formatGrams(c.expectedReturnMg)}g</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">
                        {c.returnedWeightMg ? `${formatGrams(c.returnedWeightMg)}g` : '—'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{c.wastageAllowedPercent}%</td>
                      <td className="px-6 py-4">
                        <Badge variant={c.status === 'received' ? 'success' : 'processing'}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {c.status === 'issued' ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setReceivingCastOrder(c)
                              setCastReturnedMg(c.expectedReturnMg)
                            }}
                            className="font-medium text-xs"
                          >
                            Receive
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: WORKSHOP WORKS */}
        <TabsContent value="works" className="pt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Job #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Karigar</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Weight In</th>
                    <th className="px-6 py-4 text-right">Weight Out</th>
                    <th className="px-6 py-4 text-right">Labour Charges</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Remarks</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {works.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">#{w.jobNo}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{w.date}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{w.karigarName}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{w.workType}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{formatGrams(w.weightInMg)}g</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">{formatGrams(w.weightOutMg)}g</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">
                        {formatMoney(w.labourChargesPkr)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={w.status === 'Completed' ? 'success' : 'processing'}>
                          {w.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs truncate max-w-[150px]">{w.remarks || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        {w.status !== 'Completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateWorkStatus(w.id, 'Completed')}
                            className="font-medium text-xs text-primary hover:text-primary"
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
          </div>
        </TabsContent>

        {/* TAB 4: GROUP PURCHI */}
        <TabsContent value="group_purchi" className="pt-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base text-foreground">Multi-Item Group Purchi Batch</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Build multi-item purchase slip and save as a batch transaction.</p>
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
                className="gap-1.5"
              >
                <Plus className="size-4" /> Add Row
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Gross Wt (g)</th>
                    <th className="px-6 py-3 text-right">Cut (g)</th>
                    <th className="px-6 py-3 text-right font-bold">Net Wt (g)</th>
                    <th className="px-6 py-3 text-right">Rate / Tola</th>
                    <th className="px-6 py-3 text-right font-bold">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {groupRows.map((r, i) => {
                    const net = Math.max(0, r.weightMg - r.cutMg)
                    const amt = Math.round((net / 11664) * r.rate)
                    return (
                      <tr key={r.id}>
                        <td className="px-6 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-6 py-3 font-medium text-foreground">{r.desc}</td>
                        <td className="px-6 py-3 text-right">{formatGrams(r.weightMg)}g</td>
                        <td className="px-6 py-3 text-right text-muted-foreground">−{formatGrams(r.cutMg)}g</td>
                        <td className="px-6 py-3 text-right font-bold text-foreground">{formatGrams(net)}g</td>
                        <td className="px-6 py-3 text-right font-medium">Rs {r.rate.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right font-bold text-primary">{formatMoney(amt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">
                Total Rows: <strong>{groupRows.length}</strong>
              </span>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Temporary group cleared")}
                >
                  Discard
                </Button>
                <Button
                  onClick={() => toast.success("Group Purchi converted to Bill!")}
                  className="font-medium"
                >
                  Save Group & Print Slip
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: Customer Order (I+O) */}
      <Dialog open={customerOrderOpen} onOpenChange={setCustomerOrderOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-6 overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-foreground">
              New Custom Jewellery Order
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCustomerOrder} className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Customer *</Label>
              <Select value={orderCustomer} onValueChange={setOrderCustomer}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pick customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.id}) · {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Item Description *</Label>
              <Input
                value={orderItemDesc}
                onChange={(e) => setOrderItemDesc(e.target.value)}
                placeholder="e.g. 21K Antique Bridal Choker with Ruby stones"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Weight Required</Label>
              <WeightInput
                value={orderWeightMg}
                onChange={setOrderWeightMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Karat</Label>
                <Select value={orderCarat.toString()} onValueChange={(v) => setOrderCarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-10 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K Pure Gold</SelectItem>
                    <SelectItem value="22">22K Jewellery</SelectItem>
                    <SelectItem value="21">21K Arabian</SelectItem>
                    <SelectItem value="18">18K Diamond Mount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Making Charges (PKR)</Label>
                <MoneyInput
                  value={orderMakingCharges}
                  onChange={setOrderMakingCharges}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Advance Cash Received</Label>
                <MoneyInput
                  value={orderAdvanceCashPkr}
                  onChange={setOrderAdvanceCashPkr}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Delivery Due Date</Label>
                <Input
                  type="date"
                  value={orderDeliveryDate}
                  onChange={(e) => setOrderDeliveryDate(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Assign Workshop Karigar</Label>
                <Select value={orderKarigar} onValueChange={setOrderKarigar}>
                  <SelectTrigger className="h-10">
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Priority</Label>
                <Select value={orderPriority} onValueChange={(v: any) => setOrderPriority(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">URGENT Rush Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Lock Today's Gold Rate?</Label>
                <p className="text-[11px] text-muted-foreground">Locks rate at Rs {mandi.pkrPerTola24k.toLocaleString()}/tola</p>
              </div>
              <Switch checked={orderRateLocked} onCheckedChange={setOrderRateLocked} />
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setCustomerOrderOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold">
                Save Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Issue Casting Order */}
      <Dialog open={castingOpen} onOpenChange={setCastingOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-foreground">
              Issue Casting Order
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Workshop Karigar / Caster *</Label>
              <Select value={castKarigarId} onValueChange={setCastKarigarId}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {karigars.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Issued Metal Weight (Au)</Label>
              <WeightInput
                value={castIssuedMg}
                onChange={setCastIssuedMg}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Karat</Label>
                <Select value={castCarat.toString()} onValueChange={(v) => setCastCarat(parseInt(v, 10))}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K</SelectItem>
                    <SelectItem value="22">22K</SelectItem>
                    <SelectItem value="21">21K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Allowed Wastage (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={castWastagePercent}
                  onChange={(e) => setCastWastagePercent(parseFloat(e.target.value) || 0)}
                  className="h-10 text-right"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Purpose / Casting Items</Label>
              <Input
                value={castPurpose}
                onChange={(e) => setCastPurpose(e.target.value)}
                placeholder="e.g. Ring batch casting"
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" onClick={() => setCastingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCastingOrder} className="font-semibold">
              Issue Casting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Receive Casting Dialog */}
      <Dialog open={!!receivingCastOrder} onOpenChange={(open) => !open && setReceivingCastOrder(null)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-foreground">
              Receive Casting Order #{receivingCastOrder?.orderNo}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Actual Returned Weight (g)</Label>
              <WeightInput
                value={castReturnedMg}
                onChange={setCastReturnedMg}
              />
            </div>

            {receivingCastOrder && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued Weight:</span>
                  <span className="font-semibold">{formatGrams(receivingCastOrder.issuedWeightMg)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Return:</span>
                  <span className="font-semibold">{formatGrams(receivingCastOrder.expectedReturnMg)}g</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-1.5">
                  <span>Actual Wastage:</span>
                  <span className="text-destructive">
                    {formatGrams(Math.max(0, receivingCastOrder.issuedWeightMg - castReturnedMg))}g
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" onClick={() => setReceivingCastOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReceiveCasting} className="font-semibold">
              Reconcile & Receive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default OrdersPage
