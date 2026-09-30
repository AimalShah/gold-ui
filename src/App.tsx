import React, { useEffect } from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatusFooter } from '@/components/layout/StatusFooter'
import { HelpDialog } from '@/components/modals/HelpDialog'
import { CommandPalette } from '@/components/modals/CommandPalette'
import { CalculatorDialog } from '@/components/modals/CalculatorDialog'
import { MandiDialog } from '@/components/modals/MandiDialog'
import { MixingChooserDialog } from '@/components/modals/MixingChooserDialog'
import { SwitchUserDialog } from '@/components/modals/SwitchUserDialog'
import { Toaster } from '@/components/ui/sonner'

// Page Components
import { DashboardPage } from '@/pages/DashboardPage'
import { BillingPage } from '@/pages/BillingPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { BillsPage } from '@/pages/BillsPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { TehleelPage } from '@/pages/TehleelPage'
import { MixingPage } from '@/pages/MixingPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { RatesPage } from '@/pages/RatesPage'
import { SmsPage } from '@/pages/SmsPage'
import { SettingsPage } from '@/pages/SettingsPage'

const MainAppContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    helpOpen,
    setHelpOpen,
    commandOpen,
    setCommandOpen,
    calcOpen,
    setCalcOpen,
    mandiDialogOpen,
    setMandiDialogOpen,
    mixingDialogOpen,
    setMixingDialogOpen,
    switchUserOpen,
    setSwitchUserOpen,
  } = useApp()

  // Global Keydown Handler for Shell-level shortcuts
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

      // Alt Shortcuts for Pages
      if (e.altKey) {
        const k = e.key.toLowerCase()
        if (k === '1') {
          e.preventDefault()
          setCurrentPage('dashboard')
        } else if (k === 'b') {
          e.preventDefault()
          setCurrentPage('billing')
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
  }, [commandOpen, setCommandOpen, setSwitchUserOpen, setCurrentPage, setHelpOpen, setCalcOpen, setMandiDialogOpen, setMixingDialogOpen])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'billing':
        return <BillingPage />
      case 'customers':
        return <CustomersPage />
      case 'bills':
        return <BillsPage />
      case 'orders':
        return <OrdersPage />
      case 'tehleel':
        return <TehleelPage />
      case 'mixing':
        return <MixingPage />
      case 'inventory':
        return <InventoryPage />
      case 'accounts':
        return <AccountsPage />
      case 'reports':
        return <ReportsPage />
      case 'rates':
        return <RatesPage />
      case 'sms':
        return <SmsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <BillingPage />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-sans select-none">
      {/* 1. Global Top Bar */}
      <TopBar />

      {/* 2. Main Middle Workspace: Sidebar + Page Canvas */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          {renderCurrentPage()}
        </main>
      </div>

      {/* 3. Global Status Footer */}
      <StatusFooter />

      {/* Global Modals */}
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <CalculatorDialog open={calcOpen} onOpenChange={setCalcOpen} />
      <MandiDialog open={mandiDialogOpen} onOpenChange={setMandiDialogOpen} />
      <MixingChooserDialog open={mixingDialogOpen} onOpenChange={setMixingDialogOpen} />
      <SwitchUserDialog open={switchUserOpen} onOpenChange={setSwitchUserOpen} />

      {/* Global Toast Notifications (Sonner) */}
      <Toaster position="top-right" richColors />
    </div>
  )
}

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  )
}

export default App
