import React from 'react'
import { PageTitle } from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { useCustomersPage } from '@/hooks/useCustomersPage'
import { CustomersSummaryCards } from '@/components/customers/CustomersSummaryCards'
import { CustomersFilterBar } from '@/components/customers/CustomersFilterBar'
import { CustomersListDirectory } from '@/components/customers/CustomersListDirectory'
import { CustomerLedgerDetail } from '@/components/customers/CustomerLedgerDetail'
import { CustomersModals } from '@/components/customers/CustomersModals'

export const CustomersPage: React.FC = () => {
  const p = useCustomersPage()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background p-6 space-y-6">
      <PageTitle
        description="Customer account management, dual-currency (Gold & Cash) balance ledgers, and credit limits."
        action={
          <Button size="lg" onClick={p.openNewCustomer} className="gap-2 font-medium">
            <UserPlus className="size-4" /> Add Customer
          </Button>
        }
      >
        Customers & Dual Ledger
      </PageTitle>

      <CustomersSummaryCards
        totalCustomers={p.customers.length}
        totalReceivableCashPkr={p.totalReceivableCashPkr}
        totalReceivableGoldMg={p.totalReceivableGoldMg}
        totalAdvanceCashPkr={p.totalAdvanceCashPkr}
      />

      <CustomersFilterBar
        search={p.search}
        setSearch={p.setSearch}
        filterType={p.filterType}
        setFilterType={p.setFilterType}
        onReset={() => {
          p.setSearch('')
          p.setFilterType('all')
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        <CustomersListDirectory
          customers={p.filteredCustomers}
          selectedCustomerId={p.selectedCustomer?.id || null}
          onSelectCustomer={p.setSelectedCustomerIdForDetail}
        />

        <CustomerLedgerDetail
          selectedCustomer={p.selectedCustomer}
          customerLedger={p.customerLedger}
          customerBills={p.customerBills}
          customerOrders={p.customerOrders}
          onCredit={() => p.openCreditDebit('credit')}
          onDebit={() => p.openCreditDebit('debit')}
          onEdit={p.openEditCustomer}
        />
      </div>

      <CustomersModals p={p} />
    </div>
  )
}

export default CustomersPage
