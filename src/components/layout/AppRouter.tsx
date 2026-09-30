import React from 'react'
import { useApp } from '@/context/AppContext'
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
import { SmsPage } from '@/pages/SmsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const AppRouter: React.FC = () => {
  const { currentPage, appMode } = useApp()

  if (appMode === 'pos') {
    return <BillingPage />
  }

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
    case 'sms':
      return <SmsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <BillingPage />
  }
}
