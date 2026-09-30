import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Shield, KeyRound, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export const BackOfficeLoginModal: React.FC = () => {
  const {
    managerAuthOpen,
    setManagerAuthOpen,
    setAppMode,
    setCurrentPage,
    setIsManagerUnlocked,
  } = useApp()

  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // Accept PIN 1234 or any 4 digit or demo button
    if (pin === '1234' || pin === '0000' || pin.length === 4) {
      setIsManagerUnlocked(true)
      setManagerAuthOpen(false)
      setAppMode('backoffice')
      setCurrentPage('dashboard')
      setPin('')
      setError(false)
      toast.success('Manager Mode Unlocked: Welcome to Back-Office Management')
    } else {
      setError(true)
      toast.error('Invalid PIN. Use default demo PIN: 1234')
    }
  }

  const handleDemoAccess = () => {
    setIsManagerUnlocked(true)
    setManagerAuthOpen(false)
    setAppMode('backoffice')
    setCurrentPage('dashboard')
    setPin('')
    setError(false)
    toast.success('Manager Mode Activated: Opened Back-Office ERP')
  }

  return (
    <Dialog open={managerAuthOpen} onOpenChange={setManagerAuthOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2 mx-auto">
            <Shield className="size-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Back-Office Management Access
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            Customer credit ledgers, gold vault inventory, and financial P&L statements are restricted to managers and store owners.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUnlock} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Security PIN</span>
              <span className="text-[11px] text-muted-foreground font-mono">Demo PIN: 1234</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="password"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setError(false)
                }}
                className={`pl-9 text-center font-mono tracking-widest text-lg font-bold ${
                  error ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-destructive text-center">
                Incorrect PIN. Please enter 1234 or use Quick Access.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10 gap-2"
            >
              <Lock className="size-3.5" />
              Unlock Back-Office
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDemoAccess}
              className="w-full text-xs h-9 border-dashed text-primary hover:bg-primary/5 gap-2"
            >
              <Sparkles className="size-3.5" />
              Quick Demo Access (One-Click)
              <ArrowRight className="size-3 ml-auto" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
