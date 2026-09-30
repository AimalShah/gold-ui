import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HOTKEYS, HotkeyItem } from '@/lib/hotkeys'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Search, Keyboard, Info } from 'lucide-react'

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onOpenChange }) => {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('main')

  const filteredHotkeys = HOTKEYS.filter(
    (h) =>
      h.keys.toLowerCase().includes(search.toLowerCase()) ||
      h.label.toLowerCase().includes(search.toLowerCase()) ||
      (h.description && h.description.toLowerCase().includes(search.toLowerCase()))
  )

  const renderHotkeyGroup = (items: HotkeyItem[], title: string) => {
    if (items.length === 0) return null
    return (
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 border-b border-border/80 pb-1">
          {title} ({items.length})
        </h4>
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-1.5 rounded hover:bg-muted/60 transition-colors border border-transparent hover:border-border text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground">{item.label}</span>
                {item.description && (
                  <p className="text-[11px] text-muted-foreground">{item.description}</p>
                )}
              </div>
              <HotkeyHint hotkey={item.keys} className="font-bold text-xs px-2 py-0.5" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getTabItems = (tab: string) => filteredHotkeys.filter((h) => h.tab === tab)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <Keyboard className="h-5 w-5 text-amber-600" />
              Gold King Help & Complete Hotkey Registry
            </DialogTitle>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <Info className="h-3.5 w-3.5" /> Press Esc to close
            </span>
          </div>

          {/* Search box across all tabs */}
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search any shortcut or feature (e.g. Rate, Carat, Purchi, F4, Zakat)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
              autoFocus
            />
          </div>
        </DialogHeader>

        {/* Tabs for sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-7 h-9 text-xs mb-3">
            <TabsTrigger value="main" className="text-xs">Main Window</TabsTrigger>
            <TabsTrigger value="tehleel" className="text-xs">Karat / Tehleel</TabsTrigger>
            <TabsTrigger value="mixing" className="text-xs">Pat / Changer</TabsTrigger>
            <TabsTrigger value="customers" className="text-xs">Customers</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="bills" className="text-xs">Bills</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-1">
            {/* Main Window 3-column layout */}
            <TabsContent value="main" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  {renderHotkeyGroup(
                    getTabItems('main').filter((h) => h.group === 'letter'),
                    'Single Letter Keys'
                  )}
                </div>
                <div>
                  {renderHotkeyGroup(
                    getTabItems('main').filter((h) => h.group === 'function'),
                    'Function Keys (F1-F12)'
                  )}
                </div>
                <div>
                  {renderHotkeyGroup(
                    getTabItems('main').filter((h) => h.group === 'combination'),
                    'Key Combinations'
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Other tabs */}
            {['tehleel', 'mixing', 'customers', 'reports', 'orders', 'bills'].map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderHotkeyGroup(getTabItems(tabKey), `${tabKey.toUpperCase()} Operations`)}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
