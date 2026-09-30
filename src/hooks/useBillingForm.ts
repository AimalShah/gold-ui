import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  calculateGoldValue,
  calculateTotalPrice,
  DEFAULT_GRAMS_PER_TOLA,
  ChargesMode,
} from '@/lib/gold-math'
import { Customer, Bill } from '@/lib/types'
import { toast } from 'sonner'

export function useBillingForm() {
  const {
    settings,
    mandi,
    addBill,
    currentUser,
    unitMode,
    setCurrentPage,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchInput, setCustomerSearchInput] = useState<string>('')
  const [billType, setBillType] = useState<'sale' | 'purchase'>('sale')

  // Item Details
  const [productName, setProductName] = useState<string>('22 Karat Gold Jewellery')
  const [carat, setCarat] = useState<number>(22)
  const [weightMg, setWeightMg] = useState<number>(11664) // 1 tola default (11.664g)
  const [stoneDeductionMg, setStoneDeductionMg] = useState<number>(0)
  const [polishDeductionMg, setPolishDeductionMg] = useState<number>(122)

  // Rate & Charges
  const defaultRate = mandi.pkrPerTola24k
  const [goldRatePkr, setGoldRatePkr] = useState<number>(defaultRate)
  const [chargesMode, setChargesMode] = useState<ChargesMode>('per_tola')
  const [chargesPkr, setChargesPkr] = useState<number>(1500)

  // Payment
  const [amountReceivedPkr, setAmountReceivedPkr] = useState<number>(0)

  // Modals state
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [lastSavedBill, setLastSavedBill] = useState<Bill | null>(null)

  // Derived Calculations
  const netWeightMg = Math.max(0, weightMg - stoneDeductionMg - polishDeductionMg)
  const goldValuePkr = calculateGoldValue(netWeightMg, goldRatePkr, carat, gramsPerTola)
  const totalAmountPkr = calculateTotalPrice(goldValuePkr, chargesPkr, chargesMode, netWeightMg, gramsPerTola)
  const balanceDuePkr = totalAmountPkr - amountReceivedPkr

  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomer(cust)
    setCustomerSearchInput(cust.name)
    toast.success(`Customer selected: ${cust.name}`)
  }

  const handleScaleCapture = (capturedMg: number) => {
    setWeightMg(capturedMg)
    toast.success(`Weight updated from scale: ${(capturedMg / 1000).toFixed(3)}g`)
  }

  const doClearForm = () => {
    setWeightMg(0)
    setStoneDeductionMg(0)
    setPolishDeductionMg(0)
    setChargesPkr(0)
    setAmountReceivedPkr(0)
    setSelectedCustomer(null)
    setCustomerSearchInput('')
    setProductName('22 Karat Gold Jewellery')
    toast.info('Form cleared')
  }

  const handleSaveBill = () => {
    if (weightMg <= 0) {
      toast.error('Please enter or capture a valid weight before saving.')
      return
    }

    if (amountReceivedPkr < totalAmountPkr && !selectedCustomer) {
      toast.error('Unpaid balance remaining. Please select a customer account to record ledger debt.')
      setCustomerModalOpen(true)
      return
    }

    const saved = addBill({
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: 'gold',
      items: [
        {
          id: `item-${Date.now()}`,
          description: productName,
          weightMg,
          cutPerTolaMg: stoneDeductionMg,
          cutTotalMg: stoneDeductionMg,
          polishPerTolaMg: polishDeductionMg,
          polishTotalMg: polishDeductionMg,
          totalWeightMg: netWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr: totalAmountPkr,
        },
      ],
      totalWeightMg: weightMg,
      cutTotalMg: stoneDeductionMg,
      polishTotalMg: polishDeductionMg,
      netWeightMg,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr: totalAmountPkr,
      wasoolPkr: amountReceivedPkr || totalAmountPkr,
      balancePkr: amountReceivedPkr > 0 ? totalAmountPkr - amountReceivedPkr : 0,
      zakatPkr: Math.round(totalAmountPkr * 0.025),
      user: currentUser.name,
    })

    setLastSavedBill(saved)
    toast.success(`Invoice #${saved.billNo} saved successfully.`)
  }

  const handlePrintCurrent = () => {
    const currentBillRepresentation: Bill = {
      id: 'current-preview',
      billNo: (10080 + 3).toString(),
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Cash Customer',
      type: billType,
      metal: 'gold',
      items: [
        {
          id: 'item-preview',
          description: productName,
          weightMg,
          cutPerTolaMg: stoneDeductionMg,
          cutTotalMg: stoneDeductionMg,
          polishPerTolaMg: polishDeductionMg,
          polishTotalMg: polishDeductionMg,
          totalWeightMg: netWeightMg,
          goldRatePkr,
          chargesPkr,
          carat,
          totalPricePkr: totalAmountPkr,
        },
      ],
      totalWeightMg: weightMg,
      cutTotalMg: stoneDeductionMg,
      polishTotalMg: polishDeductionMg,
      netWeightMg,
      goldRatePkr,
      carat,
      chargesMode,
      chargesPkr,
      totalPricePkr: totalAmountPkr,
      wasoolPkr: amountReceivedPkr || totalAmountPkr,
      balancePkr: amountReceivedPkr > 0 ? totalAmountPkr - amountReceivedPkr : 0,
      zakatPkr: Math.round(totalAmountPkr * 0.025),
      user: currentUser.name,
    }
    setLastSavedBill(currentBillRepresentation)
    setPrintPreviewOpen(true)
  }

  return {
    gramsPerTola,
    defaultRate,
    unitMode,
    setCurrentPage,
    // State
    selectedCustomer,
    setSelectedCustomer,
    customerSearchInput,
    setCustomerSearchInput,
    billType,
    setBillType,
    productName,
    setProductName,
    carat,
    setCarat,
    weightMg,
    setWeightMg,
    stoneDeductionMg,
    setStoneDeductionMg,
    polishDeductionMg,
    setPolishDeductionMg,
    goldRatePkr,
    setGoldRatePkr,
    chargesMode,
    setChargesMode,
    chargesPkr,
    setChargesPkr,
    amountReceivedPkr,
    setAmountReceivedPkr,
    // Modals
    customerModalOpen,
    setCustomerModalOpen,
    confirmClearOpen,
    setConfirmClearOpen,
    printPreviewOpen,
    setPrintPreviewOpen,
    lastSavedBill,
    // Derived
    netWeightMg,
    goldValuePkr,
    totalAmountPkr,
    balanceDuePkr,
    // Handlers
    handleSelectCustomer,
    handleScaleCapture,
    doClearForm,
    handleSaveBill,
    handlePrintCurrent,
  }
}
