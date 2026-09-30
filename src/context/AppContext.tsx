import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Customer,
  LedgerEntry,
  Bill,
  CustomerOrder,
  CastingOrder,
  WorkshopWork,
  TehleelRecord,
  InventoryItem,
  RawStockLot,
  StockMovement,
  Karigar,
  MandiRate,
  RateHistoryPoint,
  SmsLogEntry,
  ExpenseEntry,
  UserAccount,
  AppSettings,
} from '@/lib/types'
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_MANDI,
  INITIAL_RATE_HISTORY,
  INITIAL_CUSTOMERS,
  INITIAL_LEDGER,
  INITIAL_BILLS,
  INITIAL_ORDERS,
  INITIAL_CASTING_ORDERS,
  INITIAL_WORKS,
  INITIAL_TEHLEEL,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_RAW_STOCK,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_KARIGARS,
  INITIAL_EXPENSES,
  INITIAL_SMS_LOGS,
} from '@/lib/mock-data'

interface AppContextType {
  // Navigation & Page State
  currentPage: string
  setCurrentPage: (page: string) => void
  selectedCustomerIdForDetail: string | null
  setSelectedCustomerIdForDetail: (id: string | null) => void

  // Dialogs Visibility
  helpOpen: boolean
  setHelpOpen: (open: boolean) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
  calcOpen: boolean
  setCalcOpen: (open: boolean) => void
  switchUserOpen: boolean
  setSwitchUserOpen: (open: boolean) => void
  mandiDialogOpen: boolean
  setMandiDialogOpen: (open: boolean) => void
  mixingDialogOpen: boolean
  setMixingDialogOpen: (open: boolean) => void
  activeMixingSubtype: 'mixing' | 'carat_changer' | 'cutting'
  setActiveMixingSubtype: (t: 'mixing' | 'carat_changer' | 'cutting') => void

  // Global Shell & User
  currentUser: UserAccount
  setCurrentUser: (user: UserAccount) => void
  users: UserAccount[]
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void
  mandi: MandiRate
  updateMandi: (newMandi: Partial<MandiRate>) => void
  rateHistory: RateHistoryPoint[]

  // Core Data
  customers: Customer[]
  addCustomer: (c: Omit<Customer, 'id' | 'lastTransactionDate'>) => Customer
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  
  ledger: LedgerEntry[]
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => void

  bills: Bill[]
  addBill: (bill: Omit<Bill, 'id' | 'billNo'>) => Bill
  deleteBill: (id: string) => void

  orders: CustomerOrder[]
  addCustomerOrder: (order: Omit<CustomerOrder, 'id' | 'orderNo'>) => CustomerOrder
  updateOrderStatus: (id: string, status: CustomerOrder['status']) => void

  castingOrders: CastingOrder[]
  addCastingOrder: (order: Omit<CastingOrder, 'id' | 'orderNo'>) => void
  receiveCastingOrder: (id: string, returnedMg: number) => void

  works: WorkshopWork[]
  addWorkshopWork: (work: Omit<WorkshopWork, 'id' | 'jobNo'>) => void
  updateWorkStatus: (id: string, status: WorkshopWork['status']) => void

  tehleelRecords: TehleelRecord[]
  addTehleelRecord: (rec: Omit<TehleelRecord, 'id' | 'testNo'>) => TehleelRecord

  inventoryItems: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'tagSku' | 'barcode'>) => InventoryItem
  updateInventoryStatus: (id: string, status: InventoryItem['status']) => void

  rawStock: RawStockLot[]
  addRawStockLot: (lot: Omit<RawStockLot, 'id' | 'lastUpdated'>) => void

  movements: StockMovement[]
  addStockMovement: (mov: Omit<StockMovement, 'id'>) => void

  karigars: Karigar[]
  expenses: ExpenseEntry[]
  addExpense: (exp: Omit<ExpenseEntry, 'id'>) => void

  smsLogs: SmsLogEntry[]
  sendSms: (recipient: string, phone: string, message: string) => void

  // Quick unit mode
  unitMode: 'auto' | 'grams' | 'tola'
  setUnitMode: (m: 'auto' | 'grams' | 'tola') => void
  metalMode: 'gold' | 'silver'
  setMetalMode: (m: 'gold' | 'silver') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('billing')
  const [selectedCustomerIdForDetail, setSelectedCustomerIdForDetail] = useState<string | null>(null)

  // Dialog states
  const [helpOpen, setHelpOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [switchUserOpen, setSwitchUserOpen] = useState(false)
  const [mandiDialogOpen, setMandiDialogOpen] = useState(false)
  const [mixingDialogOpen, setMixingDialogOpen] = useState(false)
  const [activeMixingSubtype, setActiveMixingSubtype] = useState<'mixing' | 'carat_changer' | 'cutting'>('mixing')

  const [users] = useState<UserAccount[]>(INITIAL_USERS)
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0])
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)
  const [mandi, setMandi] = useState<MandiRate>(INITIAL_MANDI)
  const [rateHistory, setRateHistory] = useState<RateHistoryPoint[]>(INITIAL_RATE_HISTORY)

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS)
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER)
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS)
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS)
  const [castingOrders, setCastingOrders] = useState<CastingOrder[]>(INITIAL_CASTING_ORDERS)
  const [works, setWorks] = useState<WorkshopWork[]>(INITIAL_WORKS)
  const [tehleelRecords, setTehleelRecords] = useState<TehleelRecord[]>(INITIAL_TEHLEEL)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS)
  const [rawStock, setRawStock] = useState<RawStockLot[]>(INITIAL_RAW_STOCK)
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS)
  const [karigars, setKarigars] = useState<Karigar[]>(INITIAL_KARIGARS)
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(INITIAL_EXPENSES)
  const [smsLogs, setSmsLogs] = useState<SmsLogEntry[]>(INITIAL_SMS_LOGS)

  const [unitMode, setUnitMode] = useState<'auto' | 'grams' | 'tola'>('auto')
  const [metalMode, setMetalMode] = useState<'gold' | 'silver'>('gold')

  // Dark/Light theme class effect
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const updateMandi = (newMandi: Partial<MandiRate>) => {
    setMandi(prev => {
      const updated = { ...prev, ...newMandi, lastUpdated: new Date().toLocaleTimeString() }
      if (newMandi.pkrPerTola24k && newMandi.pkrPerTola24k !== prev.pkrPerTola24k) {
        setRateHistory(rh => [
          ...rh.slice(-9),
          {
            date: new Date().toISOString().split('T')[0],
            ratePkr: newMandi.pkrPerTola24k!,
            silverRatePkr: newMandi.pkrPerTolaSilver || prev.pkrPerTolaSilver,
          }
        ])
      }
      return updated
    })
  }

  const addCustomer = (data: Omit<Customer, 'id' | 'lastTransactionDate'>): Customer => {
    const nextNum = 1000 + customers.length + 1
    const newCust: Customer = {
      ...data,
      id: `CUST-${nextNum}`,
      lastTransactionDate: new Date().toISOString().split('T')[0],
    }
    setCustomers(prev => [newCust, ...prev])
    return newCust
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const addLedgerEntry = (entry: Omit<LedgerEntry, 'id'>) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: `LED-${Date.now()}`,
    }
    setLedger(prev => [newEntry, ...prev])
  }

  const addBill = (billData: Omit<Bill, 'id' | 'billNo'>): Bill => {
    const nextNo = (10080 + bills.length + 1).toString()
    const newBill: Bill = {
      ...billData,
      id: `b-${nextNo}`,
      billNo: nextNo,
    }
    setBills(prev => [newBill, ...prev])

    // Update customer ledger & balance if customer attached
    if (newBill.customerId) {
      const cust = customers.find(c => c.id === newBill.customerId)
      if (cust) {
        const netCashChange = newBill.totalPricePkr - newBill.wasoolPkr
        const updatedCash = cust.cashBalancePkr + netCashChange
        const updatedGold = cust.goldBalanceMg + (newBill.type === 'purchase' ? -newBill.netWeightMg : 0)

        updateCustomer(cust.id, {
          cashBalancePkr: updatedCash,
          goldBalanceMg: updatedGold,
          lastTransactionDate: newBill.date,
        })

        addLedgerEntry({
          customerId: cust.id,
          date: newBill.date,
          ref: `BILL-${newBill.billNo}`,
          type: 'bill',
          description: `${newBill.metal.toUpperCase()} Bill #${newBill.billNo} (${(newBill.netWeightMg / 1000).toFixed(3)}g)`,
          goldInMg: newBill.type === 'purchase' ? newBill.netWeightMg : 0,
          goldOutMg: newBill.type === 'sale' ? newBill.netWeightMg : 0,
          cashInPkr: newBill.wasoolPkr,
          cashOutPkr: newBill.totalPricePkr,
          runningGoldMg: updatedGold,
          runningCashPkr: updatedCash,
        })
      }
    }

    // Add stock movement
    addStockMovement({
      date: new Date().toLocaleString(),
      type: newBill.type === 'purchase' ? 'Purchase' : 'Sale',
      itemOrLot: `Bill #${newBill.billNo} (${newBill.metal.toUpperCase()})`,
      weightInMg: newBill.type === 'purchase' ? newBill.netWeightMg : 0,
      weightOutMg: newBill.type === 'sale' ? newBill.netWeightMg : 0,
      balanceMg: 1540000,
      ref: `BILL-${newBill.billNo}`,
      user: currentUser.name,
    })

    return newBill
  }

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id))
  }

  const addCustomerOrder = (orderData: Omit<CustomerOrder, 'id' | 'orderNo'>): CustomerOrder => {
    const nextNo = `ORD-${500 + orders.length + 1}`
    const newOrder: CustomerOrder = {
      ...orderData,
      id: nextNo,
      orderNo: nextNo,
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (id: string, status: CustomerOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const addCastingOrder = (data: Omit<CastingOrder, 'id' | 'orderNo'>) => {
    const nextNo = `CAST-${100 + castingOrders.length + 1}`
    setCastingOrders(prev => [{ ...data, id: nextNo, orderNo: nextNo }, ...prev])
  }

  const receiveCastingOrder = (id: string, returnedMg: number) => {
    setCastingOrders(prev => prev.map(c => {
      if (c.id === id) {
        const actualWastage = Math.max(0, c.issuedWeightMg - returnedMg)
        return {
          ...c,
          returnedWeightMg: returnedMg,
          actualWastageMg: actualWastage,
          status: 'received',
        }
      }
      return c
    }))
  }

  const addWorkshopWork = (data: Omit<WorkshopWork, 'id' | 'jobNo'>) => {
    const nextNo = `JOB-${200 + works.length + 1}`
    setWorks(prev => [{ ...data, id: nextNo, jobNo: nextNo }, ...prev])
  }

  const updateWorkStatus = (id: string, status: WorkshopWork['status']) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, status, completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : w.completedDate } : w))
  }

  const addTehleelRecord = (data: Omit<TehleelRecord, 'id' | 'testNo'>): TehleelRecord => {
    const nextNo = `TEH-2026-${String(tehleelRecords.length + 42).padStart(3, '0')}`
    const newRec: TehleelRecord = {
      ...data,
      id: `teh-${Date.now()}`,
      testNo: nextNo,
    }
    setTehleelRecords(prev => [newRec, ...prev])
    return newRec
  }

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'tagSku' | 'barcode'>): InventoryItem => {
    const num = 1000 + inventoryItems.length + 1
    const tag = `${item.category.slice(0, 2).toUpperCase()}-${item.karat}K-${String(num).slice(-3)}`
    const barcode = `890122${String(num).slice(-3)}`
    const newItem: InventoryItem = {
      ...item,
      id: `INV-${num}`,
      tagSku: tag,
      barcode,
    }
    setInventoryItems(prev => [newItem, ...prev])
    return newItem
  }

  const updateInventoryStatus = (id: string, status: InventoryItem['status']) => {
    setInventoryItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const addRawStockLot = (lot: Omit<RawStockLot, 'id' | 'lastUpdated'>) => {
    const newLot: RawStockLot = {
      ...lot,
      id: `RAW-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    setRawStock(prev => [newLot, ...prev])
  }

  const addStockMovement = (mov: Omit<StockMovement, 'id'>) => {
    const newMov: StockMovement = {
      ...mov,
      id: `MOV-${Date.now()}`,
    }
    setMovements(prev => [newMov, ...prev])
  }

  const addExpense = (exp: Omit<ExpenseEntry, 'id'>) => {
    setExpenses(prev => [{ ...exp, id: `EXP-${Date.now()}` }, ...prev])
  }

  const sendSms = (recipient: string, phone: string, message: string) => {
    const newSms: SmsLogEntry = {
      id: `SMS-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recipientName: recipient,
      phone,
      message,
      status: 'delivered',
    }
    setSmsLogs(prev => [newSms, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCustomerIdForDetail,
        setSelectedCustomerIdForDetail,
        helpOpen,
        setHelpOpen,
        commandOpen,
        setCommandOpen,
        calcOpen,
        setCalcOpen,
        switchUserOpen,
        setSwitchUserOpen,
        mandiDialogOpen,
        setMandiDialogOpen,
        mixingDialogOpen,
        setMixingDialogOpen,
        activeMixingSubtype,
        setActiveMixingSubtype,
        currentUser,
        setCurrentUser,
        users,
        settings,
        updateSettings,
        mandi,
        updateMandi,
        rateHistory,
        customers,
        addCustomer,
        updateCustomer,
        ledger,
        addLedgerEntry,
        bills,
        addBill,
        deleteBill,
        orders,
        addCustomerOrder,
        updateOrderStatus,
        castingOrders,
        addCastingOrder,
        receiveCastingOrder,
        works,
        addWorkshopWork,
        updateWorkStatus,
        tehleelRecords,
        addTehleelRecord,
        inventoryItems,
        addInventoryItem,
        updateInventoryStatus,
        rawStock,
        addRawStockLot,
        movements,
        addStockMovement,
        karigars,
        expenses,
        addExpense,
        smsLogs,
        sendSms,
        unitMode,
        setUnitMode,
        metalMode,
        setMetalMode,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
