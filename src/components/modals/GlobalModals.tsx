import React from 'react'
import { useApp } from '@/context/AppContext'
import { HelpDialog } from '@/components/modals/HelpDialog'
import { CommandPalette } from '@/components/modals/CommandPalette'
import { CalculatorDialog } from '@/components/modals/CalculatorDialog'
import { MandiDialog } from '@/components/modals/MandiDialog'
import { MixingChooserDialog } from '@/components/modals/MixingChooserDialog'
import { SwitchUserDialog } from '@/components/modals/SwitchUserDialog'
import { BackOfficeLoginModal } from '@/components/modals/BackOfficeLoginModal'

export const GlobalModals: React.FC = () => {
  const {
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

  return (
    <>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <CalculatorDialog open={calcOpen} onOpenChange={setCalcOpen} />
      <MandiDialog open={mandiDialogOpen} onOpenChange={setMandiDialogOpen} />
      <MixingChooserDialog open={mixingDialogOpen} onOpenChange={setMixingDialogOpen} />
      <SwitchUserDialog open={switchUserOpen} onOpenChange={setSwitchUserOpen} />
      <BackOfficeLoginModal />
    </>
  )
}
