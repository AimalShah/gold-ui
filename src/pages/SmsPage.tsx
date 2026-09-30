import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
} from 'lucide-react'
import { PageTitle } from '@/components/shared/PageTitle'
import { toast } from 'sonner'

export const SmsPage: React.FC = () => {
  const { smsLogs, sendSms, customers, mandi, settings } = useApp()

  const [recipientType, setRecipientType] = useState('all')
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState(customers[0]?.phone || '')
  const [message, setMessage] = useState(
    `ISLAM JEWELLERS: Today 24K Gold Rate is Rs ${mandi.pkrPerTola24k.toLocaleString()}/tola. Kindly settle accounts or contact for bookings.`
  )
  const [isSending, setIsSending] = useState(false)

  const templates = [
    { label: 'Today Mandi Rate Broadcast', text: `ISLAM JEWELLERS: Today 24K Gold Rate is Rs ${mandi.pkrPerTola24k.toLocaleString()}/tola. Silver rate Rs ${mandi.pkrPerTolaSilver.toLocaleString()}/tola.` },
    { label: 'Payment / Ledger Reminder', text: `ISLAM JEWELLERS: Respected customer, please review and settle your pending dual account ledger before the weekend.` },
    { label: 'Order Ready Notification', text: `ISLAM JEWELLERS: Your custom jewellery order has been crafted and is ready for pickup at our main showroom.` },
  ]

  const handleTemplateSelect = (text: string) => {
    setMessage(text)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error("Please enter SMS message body.")
      return
    }

    setIsSending(true)
    setTimeout(() => {
      let recipientLabel = 'All Registered Customers (Broadcast)'
      let phone = 'Broadcast'

      if (recipientType === 'debtors') {
        recipientLabel = 'Debtors with Pending Balance'
        phone = 'Multiple'
      } else if (recipientType === 'single') {
        const c = customers.find(cust => cust.phone === selectedCustomerPhone)
        recipientLabel = c ? c.name : 'Individual'
        phone = selectedCustomerPhone
      }

      sendSms(recipientLabel, phone, message)
      setIsSending(false)
      toast.success("SMS broadcast dispatched via gateway!")
    }, 500)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <PageTitle
            title="SMS Gateway & Broadcast (F10)"
            description="Broadcast Mandi rates, send invoice alerts, and automated ledger payment reminders"
          >
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              GSM Gateway Connected
            </Badge>
          </PageTitle>

          {/* Split: Left Compose, Right History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Compose SMS Form (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 space-y-5 shadow-2xs">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Compose SMS Broadcast
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Send rate alerts, invoice notifications, or payment reminders.
                </p>
              </div>

              <form onSubmit={handleSend} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Recipients Target</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers ({customers.length})</SelectItem>
                      <SelectItem value="debtors">Debtors with Pending Balance ({customers.filter(c => c.cashBalancePkr > 0 || c.goldBalanceMg > 0).length})</SelectItem>
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
                        onClick={() => handleTemplateSelect(t.text)}
                        className="w-full text-left p-2 rounded-lg border border-border hover:bg-muted text-xs transition-colors truncate block"
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

          {/* SMS Delivery Log (7 cols) */}
          <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xs">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  SMS Transmission Logs
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Recent messages sent from Gold King terminal</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {smsLogs.length} Messages
              </Badge>
            </div>

            <div className="border border-border rounded-lg divide-y divide-border overflow-y-auto max-h-[460px]">
              {smsLogs.map((log) => (
                <div key={log.id} className="p-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{log.recipientName}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/40 p-2.5 rounded-lg border border-border">
                    {log.message}
                  </p>
                  <div className="flex justify-between items-center text-[10px] pt-0.5">
                    <span className="text-muted-foreground">Phone: {log.phone}</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-mono text-[9px] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      {log.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
