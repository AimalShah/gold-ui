import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'
import { toast } from 'sonner'

export function useMixingForm() {
  const {
    settings,
    activeMixingSubtype,
    setActiveMixingSubtype,
    setCurrentPage,
    unitMode,
  } = useApp()

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA
  const activeTab = activeMixingSubtype || 'mixing'

  // Mixing State
  const [weightMg, setWeightMg] = useState<number>(116640) // 10 tolas default
  const [passaMg, setPassaMg] = useState<number>(0)
  const [patPerTolaMg, setPatPerTolaMg] = useState<number>(1458)
  const [mailMode, setMailMode] = useState<'inner' | 'outer'>('inner')

  // Alloy Ratios (Silver, Copper, Cadmium)
  const [silverRatio, setSilverRatio] = useState<number>(50)
  const [copperRatio, setCopperRatio] = useState<number>(35)
  const [cadmiumRatio, setCadmiumRatio] = useState<number>(15)

  // Carat Changer State
  const [changerWeightMg, setChangerWeightMg] = useState<number>(11664)
  const [fromCarat, setFromCarat] = useState<number>(16.5)
  const [toCarat, setToCarat] = useState<number>(18)

  // Calculations for Mixing
  const tolas = weightMg / (gramsPerTola * 1000)
  const calculatedMailMg = Math.round(tolas * patPerTolaMg) + passaMg
  const totalWeightMg = activeTab === 'cutting'
    ? Math.max(0, weightMg - calculatedMailMg)
    : weightMg + calculatedMailMg

  // Calculations for Carat Changer
  const targetWeightMg = Math.round(changerWeightMg * (fromCarat / (toCarat || 1)))
  const changerPassaMg = Math.abs(targetWeightMg - changerWeightMg)
  const isAddingAlloy = toCarat < fromCarat

  const ratioSum = silverRatio + copperRatio + cadmiumRatio
  const isRatioValid = ratioSum === 100

  const handleZero = () => {
    setWeightMg(0)
    setPassaMg(0)
    setChangerWeightMg(0)
    toast.info("Cleared calculations (F4)")
  }

  const handleSaveRecord = () => {
    toast.success("Alloy mixing batch calculation saved to audit log!")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if (!isInput) {
        const key = e.key.toUpperCase()
        if (key === 'I') {
          e.preventDefault()
          setMailMode('inner')
          toast.info("Mode: INNER MAIL (I)")
        } else if (key === 'O') {
          e.preventDefault()
          setMailMode('outer')
          toast.info("Mode: OUTER MAIL (O)")
        } else if (key === 'ESCAPE') {
          e.preventDefault()
          setCurrentPage('billing')
        }
      }

      if (e.key === 'F4') {
        e.preventDefault()
        handleZero()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mailMode])

  return {
    gramsPerTola,
    unitMode,
    activeTab,
    setActiveMixingSubtype,
    setCurrentPage,
    weightMg,
    setWeightMg,
    passaMg,
    setPassaMg,
    patPerTolaMg,
    setPatPerTolaMg,
    mailMode,
    setMailMode,
    silverRatio,
    setSilverRatio,
    copperRatio,
    setCopperRatio,
    cadmiumRatio,
    setCadmiumRatio,
    changerWeightMg,
    setChangerWeightMg,
    fromCarat,
    setFromCarat,
    toCarat,
    setToCarat,
    tolas,
    calculatedMailMg,
    totalWeightMg,
    targetWeightMg,
    changerPassaMg,
    isAddingAlloy,
    ratioSum,
    isRatioValid,
    handleZero,
    handleSaveRecord,
  }
}
