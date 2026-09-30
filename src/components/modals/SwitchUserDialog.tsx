import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/context/AppContext'
import { UserCheck, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface SwitchUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SwitchUserDialog: React.FC<SwitchUserDialogProps> = ({ open, onOpenChange }) => {
  const { users, currentUser, setCurrentUser } = useApp()
  const [selectedUserId, setSelectedUserId] = useState(currentUser.id)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSwitch = (e: React.FormEvent) => {
    e.preventDefault()
    const targetUser = users.find((u) => u.id === selectedUserId)
    if (!targetUser) return

    // Allow quick demo password or blank
    setCurrentUser(targetUser)
    toast.success(`Switched active operator to ${targetUser.name} (${targetUser.role})`)
    onOpenChange(false)
    setPassword('')
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
            <UserCheck className="h-5 w-5 text-amber-600" />
            Switch Active Operator / User Login (Ctrl+U)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSwitch} className="space-y-4 py-3 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Operator Account</Label>
            <div className="grid grid-cols-1 gap-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`p-2.5 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedUserId === u.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                      : 'border-border hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-foreground">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.username} • {u.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Authorization Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (optional in prototype demo)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="h-9 pr-9 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              Confirm & Switch User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
