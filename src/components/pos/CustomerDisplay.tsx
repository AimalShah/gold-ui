import React from 'react'
import { useCustomerDisplay } from '@/hooks/useCustomerDisplay'
import { CustomerDisplayHeader } from '@/components/pos/CustomerDisplayHeader'
import { CustomerDisplayScaleCard } from '@/components/pos/CustomerDisplayScaleCard'
import { CustomerDisplayMandiRates } from '@/components/pos/CustomerDisplayMandiRates'
import { CustomerDisplayItemCard } from '@/components/pos/CustomerDisplayItemCard'
import { CustomerDisplaySettlementCard } from '@/components/pos/CustomerDisplaySettlementCard'

interface CustomerDisplayProps {
  isPiP?: boolean
  onClose?: () => void
}

export const CustomerDisplay: React.FC<CustomerDisplayProps> = ({
  isPiP = false,
  onClose,
}) => {
  const { displayState, currentTime, settings, mandi, gramsPerTola } = useCustomerDisplay()

  return (
    <div
      className={`flex flex-col bg-stone-950 text-white font-sans select-none overflow-hidden ${
        isPiP ? 'h-full w-full' : 'min-h-screen w-screen'
      }`}
    >
      <CustomerDisplayHeader
        shopName={settings.shopName}
        mandi={mandi}
        currentTime={currentTime}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIVE SCALE & AUTHENTICITY (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <CustomerDisplayScaleCard
            scaleWeightMg={displayState.scaleWeightMg}
            gramsPerTola={gramsPerTola}
          />
          <CustomerDisplayMandiRates mandi={mandi} />
        </div>

        {/* RIGHT COLUMN: ACTIVE ITEM & TOTAL SETTLEMENT (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <CustomerDisplayItemCard
            activeItem={displayState.activeItem}
            scaleWeightMg={displayState.scaleWeightMg}
            gramsPerTola={gramsPerTola}
          />
          <CustomerDisplaySettlementCard
            customerName={displayState.customerName}
            totalNetMg={displayState.totalNetMg}
            scaleWeightMg={displayState.scaleWeightMg}
            totalAmountPkr={displayState.totalAmountPkr}
            wasoolPkr={displayState.wasoolPkr}
            balancePkr={displayState.balancePkr}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerDisplay
