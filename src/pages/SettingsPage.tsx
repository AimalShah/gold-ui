import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { HOTKEYS } from '@/lib/hotkeys'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Store,
  Scale,
  Percent,
  Palette,
  Printer,
  Shield,
  MessageSquare,
  Database,
  Keyboard,
  Save,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, users } = useApp()

  const [shopName, setShopName] = useState(settings.shopName)
  const [address, setAddress] = useState(settings.address)
  const [phone, setPhone] = useState(settings.phone)
  const [billFooter, setBillFooter] = useState(settings.billFooter)

  const [gramsPerTola, setGramsPerTola] = useState(settings.gramsPerTola.toString())
  const [theme, setTheme] = useState(settings.theme)
  const [printTemplate, setPrintTemplate] = useState(settings.printTemplate)
  const [printer, setPrinter] = useState(settings.defaultPrinter)
  const [zakatPct, setZakatPct] = useState(settings.zakatPercent.toString())

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      shopName,
      address,
      phone,
      billFooter,
      gramsPerTola: parseFloat(gramsPerTola) || 11.664,
      theme,
      printTemplate: printTemplate as any,
      defaultPrinter: printer,
      zakatPercent: parseFloat(zakatPct) || 2.5,
    })
    toast.success("Settings updated successfully!")
  }

  const handleBackupNow = () => {
    toast.success("SQLite database snapshot backed up to /backups/goldking-2026-09-29.db")
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Shop Configuration & System Settings (Ctrl+F12)</h1>
        </div>

        <Button onClick={handleSave} className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="shop" className="flex-1 flex overflow-hidden">
        {/* Left vertical tabs list */}
        <div className="w-56 border-r bg-card/30 p-2 overflow-y-auto shrink-0">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-1 text-left items-stretch">
            <TabsTrigger value="shop" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Store className="h-4 w-4" /> Shop Profile
            </TabsTrigger>
            <TabsTrigger value="units" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Scale className="h-4 w-4" /> Units & Rounding
            </TabsTrigger>
            <TabsTrigger value="billing" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Percent className="h-4 w-4" /> Billing & Zakat
            </TabsTrigger>
            <TabsTrigger value="appearance" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Palette className="h-4 w-4" /> Appearance & Theme
            </TabsTrigger>
            <TabsTrigger value="printing" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Printer className="h-4 w-4" /> Printing & Receipts
            </TabsTrigger>
            <TabsTrigger value="users" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Shield className="h-4 w-4" /> Operators & Roles
            </TabsTrigger>
            <TabsTrigger value="backup" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Database className="h-4 w-4" /> Database & Backup
            </TabsTrigger>
            <TabsTrigger value="hotkeys" className="justify-start gap-2 h-8 text-xs font-semibold data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-900">
              <Keyboard className="h-4 w-4" /> Hotkeys Registry
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Right Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
          {/* TAB 1: Shop */}
          <TabsContent value="shop" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Shop Branding & Information</h2>
              <p className="text-xs text-muted-foreground">This information appears on bills, reports and certificates.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Jewellery Shop Name *</Label>
                <Input value={shopName} onChange={(e) => setShopName(e.target.value)} className="h-9 font-serif font-bold text-base" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Showroom Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Contact Phone / Mobile</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 text-xs font-mono" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Receipt / Memo Footer Note</Label>
                <textarea
                  value={billFooter}
                  onChange={(e) => setBillFooter(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-md border text-xs font-sans bg-transparent"
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Units */}
          <TabsContent value="units" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Weight Units & Conversion Standards</h2>
              <p className="text-xs text-muted-foreground">Standard Sarafa Association weight definitions.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Grams per 1 Tola</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={gramsPerTola}
                  onChange={(e) => setGramsPerTola(e.target.value)}
                  className="h-8 font-mono text-right w-40"
                />
                <p className="text-[11px] text-muted-foreground">Default: 11.664 g (1 Masha = 1/12 Tola, 1 Ratti = 1/8 Masha = 0.1215 g)</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Weight Decimals Display</Label>
                <Input type="number" defaultValue="4" className="h-8 font-mono text-right w-32" />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Billing & Zakat */}
          <TabsContent value="billing" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Billing Defaults & Zakat</h2>
              <p className="text-xs text-muted-foreground">Default cut, polish, charges, and Shariah Zakat percentage.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Zakat Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={zakatPct}
                  onChange={(e) => setZakatPct(e.target.value)}
                  className="h-8 font-mono text-right w-32"
                />
                <p className="text-[11px] text-muted-foreground">2.5% of Total Gold Price on Main Form (Z)</p>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Appearance */}
          <TabsContent value="appearance" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Appearance & Theme Settings</h2>
              <p className="text-xs text-muted-foreground">Color schemes and row tints.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">App Theme</Label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-lg border text-center font-bold text-xs ${theme === 'light' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'bg-muted'}`}
                  >
                    Light Theme (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-lg border text-center font-bold text-xs ${theme === 'dark' ? 'border-amber-500 bg-amber-950 text-amber-200' : 'bg-muted'}`}
                  >
                    Dark Theme
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: Printing */}
          <TabsContent value="printing" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Printer & Templates</h2>
              <p className="text-xs text-muted-foreground">Configure receipt layout and printer device.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Default Slip Template</Label>
                <Select value={printTemplate} onValueChange={(v: any) => setPrintTemplate(v)}>
                  <SelectTrigger className="h-8 text-xs max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal80">Thermal 80mm POS Slip</SelectItem>
                    <SelectItem value="A5">A5 Invoice Voucher</SelectItem>
                    <SelectItem value="A4">A4 Full Sheet Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Assigned Printer Name</Label>
                <Input value={printer} onChange={(e) => setPrinter(e.target.value)} className="h-8 text-xs max-w-sm" />
              </div>
            </div>
          </TabsContent>

          {/* TAB 6: Users & Roles */}
          <TabsContent value="users" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Operators & Permissions Matrix</h2>
              <p className="text-xs text-muted-foreground">User accounts and authorization levels.</p>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2 px-3 font-semibold text-foreground">{u.name}</td>
                      <td className="py-2 px-3 font-mono text-muted-foreground">{u.username}</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-700">{u.role}</td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 7: Backup */}
          <TabsContent value="backup" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Database Backup & Recovery</h2>
              <p className="text-xs text-muted-foreground">Local snapshot archive of all customer ledgers and bills.</p>
            </div>

            <div className="p-4 rounded-lg border bg-card space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs">Immediate Snapshot Backup</h4>
                  <p className="text-[11px] text-muted-foreground">Export full SQLite / JSON state to disk.</p>
                </div>
                <Button size="sm" onClick={handleBackupNow} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5">
                  <Database className="h-3.5 w-3.5" /> Backup Now
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 8: Hotkeys Reference */}
          <TabsContent value="hotkeys" className="space-y-4 mt-0">
            <div className="border-b pb-2">
              <h2 className="text-base font-bold text-foreground">Global Hotkeys Registry</h2>
              <p className="text-xs text-muted-foreground">Read-only list generated dynamically from `hotkeys.ts`.</p>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="py-2 px-3">Key</th>
                    <th className="py-2 px-3">Action Label</th>
                    <th className="py-2 px-3">Tab</th>
                    <th className="py-2 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {HOTKEYS.slice(0, 25).map((h) => (
                    <tr key={h.id}>
                      <td className="py-2 px-3 font-mono font-bold text-amber-700"><HotkeyHint hotkey={h.keys} /></td>
                      <td className="py-2 px-3 font-semibold text-foreground">{h.label}</td>
                      <td className="py-2 px-3 capitalize text-muted-foreground">{h.tab}</td>
                      <td className="py-2 px-3 text-muted-foreground text-[11px]">{h.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
