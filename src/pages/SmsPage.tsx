import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/components/ui/badge'
import { PageTitle } from '@/components/shared/PageTitle'
import { toast } from 'sonner'
import { SmsComposerCard } from '@/components/sms/SmsComposerCard'
import { SmsLogsCard } from '@/components/sms/SmsLogsCard'

export const SmsPage: React.FC = () => {
  const { smsLogs, sendSms, customers, mandi } = useApp()

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
        const c = customers.find((cust) => cust.phone === selectedCustomerPhone)
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <SmsComposerCard
              recipientType={recipientType}
              setRecipientType={setRecipientType}
              customers={customers}
              selectedCustomerPhone={selectedCustomerPhone}
              setSelectedCustomerPhone={setSelectedCustomerPhone}
              templates={templates}
              message={message}
              setMessage={setMessage}
              isSending={isSending}
              onSend={handleSend}
            />

            <SmsLogsCard smsLogs={smsLogs} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmsPage
