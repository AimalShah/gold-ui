import { useState, useEffect } from 'react'

export function useDigitalClock() {
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return timeStr || '05:00:00 PM'
}
