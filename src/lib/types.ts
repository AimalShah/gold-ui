import { ChargesMode } from './gold-math'

export interface Customer {
  id: string
  name: string
  phone: string
  altPhone?: string
  cnic?: string
  city: string
  address: string
  group: string
  goldBalanceMg: number // positive = owes gold, negative = shop owes
  cashBalancePkr: number // positive = owes cash, negative = advance
  creditLimitPkr: number
  creditLimitGoldMg: number
  smsAlerts: boolean
  active: boolean
  lastTransactionDate: string
  notes?: string
}

export interface LedgerEntry {
  id: string
  customerId: string
  date: string
  ref: string
  type: 'bill' | 'credit' | 'debit' | 'order' | 'tehleel'
  description: string
  goldInMg: number
  goldOutMg: number
  cashInPkr: number
  cashOutPkr: number
  runningGoldMg: number
  runningCashPkr: number
}

export interface BillItem {
  id: string
  description: string
  weightMg: number
  cutPerTolaMg: number
  cutTotalMg: number
  polishPerTolaMg: number
  polishTotalMg: number
  totalWeightMg: number
  goldRatePkr: number
  chargesPkr: number
  carat: number
  totalPricePkr: number
  inventoryItemId?: string
}

export interface Bill {
  id: string
  billNo: string
  date: string
  customerId?: string
  customerName: string
  type: 'sale' | 'purchase' | 'general' | 'group'
  metal: 'gold' | 'silver'
  items: BillItem[]
  totalWeightMg: number
  cutTotalMg: number
  polishTotalMg: number
  netWeightMg: number
  goldRatePkr: number
  carat: number
  chargesMode: ChargesMode
  chargesPkr: number
  totalPricePkr: number
  wasoolPkr: number
  balancePkr: number
  zakatPkr: number
  user: string
  notes?: string
}

export type OrderStatus = 'pending' | 'in_workshop' | 'ready' | 'delivered' | 'cancelled'

export interface CustomerOrder {
  id: string
  orderNo: string
  date: string
  customerId: string
  customerName: string
  itemDescription: string
  weightRequiredMg: number
  carat: number
  rateLocked: boolean
  lockedRatePkr?: number
  makingChargesPkr: number
  advanceGoldMg: number
  advanceCashPkr: number
  deliveryDate: string
  priority: 'normal' | 'urgent'
  status: OrderStatus
  karigarId?: string
  karigarName?: string
  remarks?: string
  designImage?: string
}

export interface CastingOrder {
  id: string
  orderNo: string
  date: string
  karigarId: string
  karigarName: string
  metal: 'gold' | 'silver'
  carat: number
  issuedWeightMg: number
  expectedReturnMg: number
  returnedWeightMg?: number
  wastageAllowedPercent: number
  actualWastageMg?: number
  purpose: string
  dueDate: string
  status: 'issued' | 'received' | 'overdue'
  remarks?: string
}

export interface WorkshopWork {
  id: string
  jobNo: string
  date: string
  karigarId: string
  karigarName: string
  orderRef?: string
  workType: 'Polish' | 'Setting' | 'Casting' | 'Repair' | 'Other'
  weightInMg: number
  weightOutMg: number
  labourChargesPkr: number
  status: 'In Progress' | 'Completed' | 'Delivered'
  completedDate?: string
  remarks?: string
}

export interface TehleelRecord {
  id: string
  date: string
  testNo: string
  customerId?: string
  customerName?: string
  metalType: 'COPPER' | 'SILVER' | 'ESILVER' | 'PURE SILVER' | 'TEZABI'
  firstWeightMg: number
  secondWeightMg: number
  cutPerTolaMg: number
  impurityMg: number
  pureGoldMg: number
  carat: number
  permille: number
  purityPercent: number
  ratePkr: number
  amountPkr: number
  notes?: string
}

export interface InventoryItem {
  id: string
  tagSku: string
  barcode: string
  name: string
  category: 'Ring' | 'Necklace' | 'Bangle' | 'Earring' | 'Chain' | 'Set' | 'Other'
  metal: 'gold' | 'silver'
  karat: number
  grossWeightMg: number
  stoneWeightMg: number
  netWeightMg: number
  makingChargesPkr: number
  makingChargesMode: 'fix' | 'per_tola'
  stoneCostPkr: number
  designNo?: string
  karigarName?: string
  locationTray: string
  status: 'in_stock' | 'sold' | 'with_karigar' | 'reserved'
  image?: string
}

export interface RawStockLot {
  id: string
  metal: 'gold' | 'silver'
  karat: number
  weightMg: number
  fineWeightMg: number
  avgCostPerTolaPkr: number
  valuePkr: number
  lastUpdated: string
}

export interface StockMovement {
  id: string
  date: string
  type: 'Purchase' | 'Sale' | 'Issue' | 'Receive' | 'Adjust' | 'Melt'
  itemOrLot: string
  weightInMg: number
  weightOutMg: number
  balanceMg: number
  ref: string
  user: string
}

export interface Karigar {
  id: string
  name: string
  phone: string
  city: string
  speciality: string
  goldHeldMg: number
  silverHeldMg: number
  activeJobs: number
}

export interface MandiRate {
  goldUsdOz: number
  usdPkr: number
  pkrPerTola24k: number
  pkrPerGram24k: number
  pkrPerTolaSilver: number
  lastUpdated: string
}

export interface RateHistoryPoint {
  date: string
  ratePkr: number
  silverRatePkr: number
}

export interface SmsLogEntry {
  id: string
  timestamp: string
  recipientName: string
  phone: string
  message: string
  status: 'sent' | 'delivered' | 'failed'
}

export interface ExpenseEntry {
  id: string
  date: string
  category: 'Shop Maintenance' | 'Karigar Labour' | 'Utilities' | 'Staff Tea / Meal' | 'Packaging' | 'Miscellaneous'
  amountPkr: number
  paidTo: string
  note: string
  user: string
}

export interface UserAccount {
  id: string
  username: string
  name: string
  role: 'Owner' | 'Manager' | 'Cashier'
  active: boolean
  avatar?: string
}

export interface AppSettings {
  shopName: string
  address: string
  phone: string
  billFooter: string
  gramsPerTola: number
  rattiDecimals: number
  weightDecimals: number
  defaultUnitMode: 'auto' | 'grams' | 'tola'
  defaultCutPerTolaMg: number
  defaultPolishPerTolaMg: number
  defaultChargesMode: ChargesMode
  zakatPercent: number
  allowNegativeWeight: boolean
  theme: 'light' | 'dark'
  fontSize: 'compact' | 'normal' | 'large'
  defaultPrinter: string
  printTemplate: 'A4' | 'A5' | 'thermal80'
  autoRefreshMandi: boolean
  mandiRefreshIntervalSec: number
  kachaMode: boolean
}
