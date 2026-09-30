import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CustomerOrder, CastingOrder } from '@/lib/types'
import { formatGrams } from '@/lib/gold-math'
import { toast } from 'sonner'

export function useOrdersPage() {
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

  return {
    orders,
    customers,
    karigars,
    mandi,
    castingOrders,
    works,
    mainTab,
    setMainTab,
    viewMode,
    setViewMode,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredOrders,
    updateOrderStatus,
    updateWorkStatus,
    customerOrderOpen,
    setCustomerOrderOpen,
    orderCustomer,
    setOrderCustomer,
    orderItemDesc,
    setOrderItemDesc,
    orderWeightMg,
    setOrderWeightMg,
    orderCarat,
    setOrderCarat,
    orderRateLocked,
    setOrderRateLocked,
    orderMakingCharges,
    setOrderMakingCharges,
    orderAdvanceGoldMg,
    setOrderAdvanceGoldMg,
    orderAdvanceCashPkr,
    setOrderAdvanceCashPkr,
    orderDeliveryDate,
    setOrderDeliveryDate,
    orderPriority,
    setOrderPriority,
    orderKarigar,
    setOrderKarigar,
    orderRemarks,
    setOrderRemarks,
    handleCreateCustomerOrder,
    castingOpen,
    setCastingOpen,
    castKarigarId,
    setCastKarigarId,
    castMetal,
    setCastMetal,
    castCarat,
    setCastCarat,
    castIssuedMg,
    setCastIssuedMg,
    castWastagePercent,
    setCastWastagePercent,
    castPurpose,
    setCastPurpose,
    castDueDate,
    setCastDueDate,
    handleCreateCastingOrder,
    receivingCastOrder,
    setReceivingCastOrder,
    castReturnedMg,
    setCastReturnedMg,
    handleSaveReceiveCasting,
    worksOpen,
    setWorksOpen,
    workKarigarId,
    setWorkKarigarId,
    workType,
    setWorkType,
    workWeightInMg,
    setWorkWeightInMg,
    workWeightOutMg,
    setWorkWeightOutMg,
    workLabourCharges,
    setWorkLabourCharges,
    workRemarks,
    setWorkRemarks,
    handleCreateWork,
    groupRows,
    setGroupRows,
  }
}
