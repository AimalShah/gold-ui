import React from 'react'
import { useTehleelForm } from '@/hooks/useTehleelForm'
import { CustomerSelectModal } from '@/components/billing/CustomerSelectModal'
import { PageTitle } from '@/components/shared/PageTitle'
import { Badge } from '@/components/ui/badge'
import { TehleelInputsCard } from '@/components/tehleel/TehleelInputsCard'
import { TehleelResultsCard } from '@/components/tehleel/TehleelResultsCard'

export const TehleelPage: React.FC = () => {
  const form = useTehleelForm()

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <PageTitle
            title="Tehleel & Gold Karat Assay Calculator"
            description="Computerized cupellation, acid nitric testing, and fine gold percentage verification"
          >
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
              Assay Laboratory Ready
            </Badge>
          </PageTitle>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <TehleelInputsCard
              metalType={form.metalType}
              setMetalType={form.setMetalType}
              selectedCustomer={form.selectedCustomer}
              setSelectedCustomer={form.setSelectedCustomer}
              onOpenCustomerModal={() => form.setCustomerModalOpen(true)}
              firstWeightMg={form.firstWeightMg}
              setFirstWeightMg={form.setFirstWeightMg}
              secondWeightMg={form.secondWeightMg}
              setSecondWeightMg={form.setSecondWeightMg}
              cutPerTolaMg={form.cutPerTolaMg}
              setCutPerTolaMg={form.setCutPerTolaMg}
              ratePkr={form.ratePkr}
              setRatePkr={form.setRatePkr}
              unitMode={form.unitMode}
            />

            <TehleelResultsCard
              karat={form.karat}
              permille={form.permille}
              purityPercent={form.purityPercent}
              pureGoldMg={form.pureGoldMg}
              impurityMg={form.impurityMg}
              amountPkr={form.amountPkr}
              gramsPerTola={form.gramsPerTola}
              onSave={form.handleSave}
              onPrint={form.handlePrint}
              onZero={form.handleZero}
            />
          </div>
        </div>
      </div>

      <CustomerSelectModal
        open={form.customerModalOpen}
        onOpenChange={form.setCustomerModalOpen}
        onSelectCustomer={(cust) => {
          form.setSelectedCustomer(cust)
          form.setCustomerModalOpen(false)
        }}
        onNewCustomer={() => {
          form.setCustomerModalOpen(false)
          form.setCurrentPage('customers')
        }}
      />
    </div>
  )
}

export default TehleelPage
