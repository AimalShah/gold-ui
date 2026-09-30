import React from 'react'
import { Customer } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send } from 'lucide-react'

interface SmsComposerCardProps {
  recipientType: string
  setRecipientType: (t: string) => void
  customers: Customer[]
  selectedCustomerPhone: string
  setSelectedCustomerPhone: (p: string) => void
  templates: { label: string; text: string }[]
  message: string
  setMessage: (m: string) => void
  isSending: boolean
  onSend: (e: React.FormEvent) => void
}

export const SmsComposerCard: React.FC<SmsComposerCardProps> = ({
  recipientType,
  setRecipientType,
  customers,
  selectedCustomerPhone,
  setSelectedCustomerPhone,
  templates,
  message,
  setMessage,
  isSending,
  onSend,
}) => {
  return (
    <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
      <div className="border-b border-border pb-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
          Compose SMS Broadcast
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Send rate alerts, invoice notifications, or payment reminders.
        </p>
      </div>

      <form onSubmit={onSend} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Recipients Target</Label>
          <Select value={recipientType} onValueChange={setRecipientType}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers ({customers.length})</SelectItem>
              <SelectItem value="debtors">
                Debtors with Pending Balance ({customers.filter((c) => c.cashBalancePkr > 0 || c.goldBalanceMg > 0).length})
              </SelectItem>
              <SelectItem value="single">Single Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recipientType === 'single' && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Choose Customer</Label>
            <Select value={selectedCustomerPhone} onValueChange={setSelectedCustomerPhone}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.phone}>
                    {c.name} ({c.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Template quick-pick */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Message Templates</Label>
          <div className="space-y-1.5">
            {templates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(t.text)}
                className="w-full text-left p-2 rounded-lg border border-border hover:bg-muted text-xs transition-colors truncate block cursor-pointer"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message text area */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold">Message Body</Label>
            <span className="text-[10px] text-muted-foreground font-mono">
              {message.length} characters ({Math.ceil(message.length / 160)} SMS)
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg border border-border text-xs font-sans bg-transparent resize-none focus:outline-hidden focus:ring-2 focus:ring-primary"
            placeholder="Type message text here..."
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 h-9"
        >
          <Send className="h-3.5 w-3.5" />
          {isSending ? 'Sending via Gateway...' : 'Send SMS Now (F10)'}
        </Button>
      </form>
    </div>
  )
}
