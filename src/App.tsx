import React from 'react'
import { AppProvider, useApp } from '@/context/AppContext'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { StatusFooter } from '@/components/layout/StatusFooter'
import { AppRouter } from '@/components/layout/AppRouter'
import { GlobalModals } from '@/components/modals/GlobalModals'
import { Toaster } from '@/components/ui/sonner'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'

const MainAppContent: React.FC = () => {
  const { appMode } = useApp()
  useGlobalShortcuts()

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-sans select-none">
      {/* 1. Global Header */}
      <TopBar />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {appMode === 'backoffice' && <Sidebar />}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          <AppRouter />
        </main>
      </div>

      {/* 3. Global Status Footer */}
      {appMode === 'backoffice' && <StatusFooter />}

      {/* 4. Global Modals & Notifications */}
      <GlobalModals />
      <Toaster position="bottom-right" richColors />
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
