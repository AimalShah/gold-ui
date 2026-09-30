import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { CustomerDisplayState } from '@/lib/types'
import { DEFAULT_GRAMS_PER_TOLA } from '@/lib/gold-math'

export function useCustomerDisplay() {
  const { customerDisplayState, settings, mandi } = useApp()
  const [displayState, setDisplayState] = useState<CustomerDisplayState>(customerDisplayState)
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString())

  const gramsPerTola = settings.gramsPerTola || DEFAULT_GRAMS_PER_TOLA

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Listen to cross-window BroadcastChannel and localStorage for instant sync
  useEffect(() => {
    setDisplayState(customerDisplayState)

    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel('islam_jewellers_cfd')
      channel.onmessage = (event) => {
        if (event.data) {
          setDisplayState(event.data)
        }
      }
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'islam_jewellers_cfd_state' && e.newValue) {
        try {
          setDisplayState(JSON.parse(e.newValue))
        } catch (err) {}
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      channel?.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [customerDisplayState])

  return {
    displayState,
    currentTime,
    settings,
    mandi,
    gramsPerTola,
  }
}
