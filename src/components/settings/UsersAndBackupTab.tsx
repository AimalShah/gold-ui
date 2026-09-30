import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HardDrive, Database } from 'lucide-react'
import { User } from '@/lib/types'

interface UsersAndBackupTabProps {
  users: User[]
  onBackupNow: () => void
  activeSubtab?: 'users' | 'backup'
}

export const UsersTab: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Operators & Permissions Matrix
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Authorized operator accounts and access levels.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-semibold text-foreground">{u.name}</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{u.username}</td>
                <td className="py-3 px-4 font-mono font-bold text-primary">{u.role}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                    Active
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const BackupTab: React.FC<{ onBackupNow: () => void }> = ({ onBackupNow }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Database Backup & Archival
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Instant local snapshot archive of customer ledgers, inventory, and bills.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4 max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" /> Immediate Database Snapshot
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Export complete system ledger and transactions snapshot to disk.
            </p>
          </div>
          <Button
            size="sm"
            onClick={onBackupNow}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-2 h-10 px-4 rounded-xl shadow-sm"
          >
            <Database className="h-3.5 w-3.5" /> Backup Now
          </Button>
        </div>
      </div>
    </div>
  )
}
