import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import {
  calculateTehleel,
  calculateImpurity,
  DEFAULT_GRAMS_PER_TOLA,
} from '@/lib/gold-math'
import { Customer } from '@/lib/types'
import { toast } from 'sonner'

export function useTehleelForm() {
  const {
    settings,
    mandi,
    addTehleelRecord,
    setCurrentPage,
    unitMode,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  const [metalType, setMetalType] = useState<string>('COPPER')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)

  const [firstWeightMg, setFirstWeightMg] = useState<number>(31310)
  const [secondWeightMg, setSecondWeightMg] = useState<number>(27500)
  const [cutPerTolaMg, setCutPerTolaMg] = useState<number>(243)
  const [ratePkr, setRatePkr] = useState<number>(mandi.pkrPerTola24k)

  const { impurityMg, pureGoldMg } = calculateImpurity(
    firstWeightMg,
    secondWeightMg,
    cutPerTolaMg,
    gramsPerTola
  )

  const { karat, permille, purityPercent } = calculateTehleel(firstWeightMg, pureGoldMg)
  const amountPkr = Math.round((pureGoldMg / (gramsPerTola * 1000)) * ratePkr)

  const handlePrint = () => {
    toast.success(`Printing Gold Karat Assay Certificate (${karat}K)...`)
  }

  const handleZero = () => {
    setFirstWeightMg(0)
    setSecondWeightMg(0)
    setCutPerTolaMg(0)
    toast.info("Tehleel form cleared (F4)")
  }

  const handleSave = () => {
    if (firstWeightMg <= 0) {
      toast.error("Please enter a valid 1st Weight.")
      return
    }

    const rec = addTehleelRecord({
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Assay',
      metalType: metalType as any,
      firstWeightMg,
      secondWeightMg,
      cutPerTolaMg,
      impurityMg,
      pureGoldMg,
      carat: karat,
      permille,
      purityPercent,
      ratePkr,
      amountPkr,
      notes: `Assay test for ${metalType} base. Pure Gold: ${(pureGoldMg / 1000).toFixed(3)}g`,
    })

    toast.success(`Tehleel test #${rec.testNo} saved (${karat}K / ${permille}‰)!`)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if (!isInput) {
        const key = e.key.toUpperCase()
        if (key === 'C') {
          e.preventDefault()
          setMetalType('COPPER')
        } else if (key === 'S') {
          e.preventDefault()
          setMetalType('SILVER')
        } else if (key === 'M') {
          e.preventDefault()
          setMetalType('ESILVER')
        } else if (key === 'U') {
          e.preventDefault()
          setMetalType('TEZABI')
        } else if (key === 'Y') {
          e.preventDefault()
          setMetalType('PURE SILVER')
        } else if (key === 'ESCAPE') {
          e.preventDefault()
          setCurrentPage('billing')
        } else if (key === 'P') {
          e.preventDefault()
          handlePrint()
        }
      }

      if (e.key === 'F8') {
        e.preventDefault()
        handleSave()
      } else if (e.key === 'F4') {
        e.preventDefault()
        handleZero()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [metalType, firstWeightMg, secondWeightMg, cutPerTolaMg, ratePkr, pureGoldMg, karat])

  return {
    gramsPerTola,
    unitMode,
    metalType,
    setMetalType,
    selectedCustomer,
    setSelectedCustomer,
    customerModalOpen,
    setCustomerModalOpen,
    firstWeightMg,
    setFirstWeightMg,
    secondWeightMg,
    setSecondWeightMg,
    cutPerTolaMg,
    setCutPerTolaMg,
    ratePkr,
    setRatePkr,
    impurityMg,
    pureGoldMg,
    karat,
    permille,
    purityPercent,
    amountPkr,
    handleSave,
    handlePrint,
    handleZero,
    setCurrentPage,
  }
}
