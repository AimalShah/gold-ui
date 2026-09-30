import React from 'react'
import { Badge } from '@/components/ui/badge'

interface SmsLog {
  id: string
  recipientName: string
  phone: string
  message: string
  timestamp: string
  status: string
}

interface SmsLogsCardProps {
  smsLogs: SmsLog[]
}

export const SmsLogsCard: React.FC<SmsLogsCardProps> = ({ smsLogs }) => {
  return (
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
  )
}
