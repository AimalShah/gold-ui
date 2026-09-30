import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Plus, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { AccountsSummaryCards } from '@/components/accounts/AccountsSummaryCards'
import { AccountsTabsContent } from '@/components/accounts/AccountsTabsContent'
import { AddExpenseModal } from '@/components/accounts/AddExpenseModal'

export const AccountsPage: React.FC = () => {
  const { ledger, customers, expenses, addExpense, currentUser } = useApp()

  const [activeTab, setActiveTab] = useState<'day_book' | 'cash_book' | 'gold_book' | 'balances' | 'expenses'>('day_book')
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [dayClosed, setDayClosed] = useState(false)

  const handleDayClose = () => {
    setDayClosed(true)
    toast.success("Day Book successfully balanced and locked for today. No modifications permitted.")
  }

  // Calculate Totals
  const totalGoldIn = ledger.reduce((sum, l) => sum + (l.goldInMg || 0), 0)
  const totalGoldOut = ledger.reduce((sum, l) => sum + (l.goldOutMg || 0), 0)
  const totalCashIn = ledger.reduce((sum, l) => sum + (l.cashInPkr || 0), 0)
  const totalCashOut = ledger.reduce((sum, l) => sum + (l.cashOutPkr || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amountPkr, 0)
  const netCashInHand = totalCashIn - totalCashOut - totalExpenses

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      {/* 1. Page Header */}
      <PageTitle
        description="Daily Roznamcha, dual cash book, gold bullion journal, and shop expenses."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setExpenseDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" /> Add Expense
            </Button>
            <Button
              size="lg"
              variant={dayClosed ? "secondary" : "default"}
              onClick={handleDayClose}
              disabled={dayClosed}
              className="gap-2 font-medium"
            >
              <Lock className="size-4" />
              {dayClosed ? 'Day Book Locked' : 'Close & Lock Day'}
            </Button>
          </div>
        }
      >
        Day Book & Accounts
      </PageTitle>

      {/* 2. Top Summary KPI Cards */}
      <AccountsSummaryCards
        totalCashIn={totalCashIn}
        totalCashOut={totalCashOut}
        netCashInHand={netCashInHand}
        totalGoldIn={totalGoldIn}
        totalGoldOut={totalGoldOut}
      />

      {/* 3. Tabbed Ledger Sheets */}
      <AccountsTabsContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ledger={ledger}
        customers={customers}
        expenses={expenses}
      />

      {/* 4. Add Expense Modal */}
      <AddExpenseModal
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onAddExpense={(data) => {
          addExpense({
            date: new Date().toISOString().split('T')[0],
            category: data.category,
            amountPkr: data.amountPkr,
            paidTo: data.paidTo,
            note: data.note,
            user: currentUser.name,
          })
        }}
      />
    </div>
  )
}

export default AccountsPage
