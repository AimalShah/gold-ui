import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'

export function useGlobalShortcuts() {
  const {
    commandOpen,
    setCommandOpen,
    setSwitchUserOpen,
    setCurrentPage,
    setHelpOpen,
    setCalcOpen,
    setMandiDialogOpen,
    setMixingDialogOpen,
    switchToBackOffice,
    switchToPos,
  } = useApp()

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen(!commandOpen)
        return
      }

      // Ctrl+U -> Switch User
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        setSwitchUserOpen(true)
        return
      }

      // Ctrl+F12 -> Settings
      if ((e.ctrlKey || e.metaKey) && e.key === 'F12') {
        e.preventDefault()
        setCurrentPage('settings')
        return
      }

      // F1 -> Help
      if (e.key === 'F1') {
        e.preventDefault()
        setHelpOpen(true)
        return
      }

      // F2 -> Calculator
      if (e.key === 'F2' && !e.ctrlKey) {
        e.preventDefault()
        setCalcOpen(true)
        return
      }

      // F6 -> Accounts
      if (e.key === 'F6') {
        e.preventDefault()
        setCurrentPage('accounts')
        return
      }

      // F10 -> SMS
      if (e.key === 'F10') {
        e.preventDefault()
        setCurrentPage('sms')
        return
      }

      // F11 -> Mandi Modal
      if (e.key === 'F11') {
        e.preventDefault()
        setMandiDialogOpen(true)
        return
      }

      // Alt Shortcuts for Modes & Pages
      if (e.altKey) {
        const k = e.key.toLowerCase()
        if (k === 'm') {
          e.preventDefault()
          switchToBackOffice()
          return
        } else if (k === 'p' || k === 'b') {
          e.preventDefault()
          switchToPos()
          return
        } else if (k === '1') {
          e.preventDefault()
          setCurrentPage('dashboard')
        } else if (k === 'i') {
          e.preventDefault()
          setCurrentPage('inventory')
        } else if (k === 'r') {
          e.preventDefault()
          setCurrentPage('reports')
        }
      }

      // Single letter keys outside text inputs
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      if (!isInput && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const k = e.key.toUpperCase()
        if (k === 'M') {
          e.preventDefault()
          setMixingDialogOpen(true)
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [
    commandOpen,
    setCommandOpen,
    setSwitchUserOpen,
    setCurrentPage,
    setHelpOpen,
    setCalcOpen,
    setMandiDialogOpen,
    setMixingDialogOpen,
    switchToBackOffice,
    switchToPos,
  ])
}
