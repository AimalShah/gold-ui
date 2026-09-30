import React from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Store,
  Scale,
  Percent,
  Palette,
  Printer,
  Shield,
  Database,
  Keyboard,
} from 'lucide-react'

export const SettingsSidebarNav: React.FC = () => {
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/60 p-4 shrink-0">
      <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1.5 text-left items-stretch">
        <TabsTrigger
          value="shop"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Store className="h-4 w-4" /> Shop Profile
        </TabsTrigger>
        <TabsTrigger
          value="units"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Scale className="h-4 w-4" /> Units & Rounding
        </TabsTrigger>
        <TabsTrigger
          value="billing"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Percent className="h-4 w-4" /> % Billing & Zakat
        </TabsTrigger>
        <TabsTrigger
          value="appearance"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Palette className="h-4 w-4" /> Appearance & Theme
        </TabsTrigger>
        <TabsTrigger
          value="printing"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Printer className="h-4 w-4" /> Printing & Receipts
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Shield className="h-4 w-4" /> Operators & Roles
        </TabsTrigger>
        <TabsTrigger
          value="backup"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Database className="h-4 w-4" /> Database & Backup
        </TabsTrigger>
        <TabsTrigger
          value="hotkeys"
          className="justify-start gap-3 h-11 text-xs font-medium rounded-xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=active]:shadow-primary/25"
        >
          <Keyboard className="h-4 w-4" /> Hotkeys Registry
        </TabsTrigger>
      </TabsList>
    </div>
  )
}
