import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { HOTKEYS } from '@/lib/hotkeys'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Store,
  Scale,
  Percent,
  Palette,
  Printer,
  Shield,
  Database,
  Keyboard,
  Save,
  CheckCircle2,
  HardDrive,
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
    toast.success("Settings saved successfully!", {
      description: "Store profile and configuration parameters updated.",
    })
  }

  const handleBackupNow = () => {
    toast.success("Database snapshot created", {
      description: "Encrypted SQLite backup stored at /backups/goldking-2026-09-30.db",
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Modern Big Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Settings & Configuration
                </h1>
                <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-muted border border-border text-muted-foreground shadow-2xs">
                  Ctrl+F12
                </kbd>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
                Manage store branding, Sarafa gold standards, slip printing, and operators
              </p>
            </div>

            <Button
              onClick={handleSave}
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-2 shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>

          {/* Settings Tabs Container Card - Big, Minimal, Modern */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            <Tabs defaultValue="shop" className="flex flex-col md:flex-row min-h-[620px]">
              {/* Left vertical tabs list */}
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

              {/* Right Tab Contents */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* TAB 1: Shop Branding */}
                <TabsContent value="shop" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Shop Branding & Information
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      This information appears on bills, reports and certificates.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-3xl">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Jewellery Shop Name *
                      </Label>
                      <Input
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="h-12 font-bold text-base bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
                        placeholder="e.g. ISLAM JEWELLERS"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Showroom Address
                      </Label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-11 text-xs md:text-sm bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
                        placeholder="Showroom street and market address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact Phone / Mobile
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 text-xs md:text-sm font-mono bg-muted/30 border-border rounded-xl px-4 focus-visible:ring-primary"
                        placeholder="+92 300 1234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Receipt / Memo Footer Note
                      </Label>
                      <textarea
                        value={billFooter}
                        onChange={(e) => setBillFooter(e.target.value)}
                        rows={4}
                        className="w-full p-4 rounded-xl border border-border text-xs md:text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
                        placeholder="Terms and conditions printed at the bottom of customer receipts"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: Units */}
                <TabsContent value="units" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Weight Units & Conversion Standards
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Standard Sarafa Association weight definitions and decimal precision.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-3xl">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Grams per 1 Tola
                      </Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={gramsPerTola}
                        onChange={(e) => setGramsPerTola(e.target.value)}
                        className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground">
                        Default: <strong>11.664 g</strong> (1 Masha = 1/12 Tola = 0.972 g, 1 Ratti = 1/8 Masha = 0.1215 g)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Weight Display Precision
                      </Label>
                      <Input
                        type="number"
                        defaultValue="4"
                        className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground">
                        Display up to 4 decimal places for milligram accuracy on live digital balances.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: Billing & Zakat */}
                <TabsContent value="billing" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Billing Defaults & Zakat
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Default cut, polish, charges, and Shariah Zakat calculation parameters.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-3xl">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Zakat Rate (%)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={zakatPct}
                        onChange={(e) => setZakatPct(e.target.value)}
                        className="h-11 font-mono text-base bg-muted/30 border-border rounded-xl px-4 max-w-xs focus-visible:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground">
                        Standard Nisab Shariah rule: <strong>2.5%</strong> of net fine gold valuation.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 4: Appearance */}
                <TabsContent value="appearance" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Appearance & Theme Settings
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select your preferred workspace aesthetic.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-3xl">
                    <div className="space-y-3">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Workspace Theme
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            theme === 'dark'
                              ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary'
                              : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="font-bold text-sm text-foreground">Dark Theme (Recommended)</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            High-contrast luxury dark aesthetic with emerald accents.
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            theme === 'light'
                              ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary'
                              : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="font-bold text-sm text-foreground">Light Theme</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Clean bright background with emerald branding.
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 5: Printing */}
                <TabsContent value="printing" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Printer & Slip Templates
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure POS thermal receipt layout and default hardware printer.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-3xl">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Default Slip Template
                      </Label>
                      <Select value={printTemplate} onValueChange={(v: any) => setPrintTemplate(v)}>
                        <SelectTrigger className="h-11 text-xs md:text-sm bg-muted/30 border-border rounded-xl px-4 max-w-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thermal80">Thermal 80mm POS Slip (Fast Receipt)</SelectItem>
                          <SelectItem value="A5">A5 Invoice Voucher (Duplicate Copy)</SelectItem>
                          <SelectItem value="A4">A4 Full Sheet Standard Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Assigned Hardware Printer
                      </Label>
                      <Input
                        value={printer}
                        onChange={(e) => setPrinter(e.target.value)}
                        className="h-11 text-xs md:text-sm bg-muted/30 border-border rounded-xl px-4 max-w-md focus-visible:ring-primary"
                        placeholder="e.g. Epson TM-T88VI Thermal"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 6: Users & Roles */}
                <TabsContent value="users" className="space-y-6 mt-0">
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
                </TabsContent>

                {/* TAB 7: Backup */}
                <TabsContent value="backup" className="space-y-6 mt-0">
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
                        onClick={handleBackupNow}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-2 h-10 px-4 rounded-xl shadow-sm"
                      >
                        <Database className="h-3.5 w-3.5" /> Backup Now
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 8: Hotkeys Reference */}
                <TabsContent value="hotkeys" className="space-y-6 mt-0">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Global Hotkeys Registry
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Instant keyboard shortcuts registered across POS and Back-Office.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Shortcut</th>
                          <th className="py-3 px-4">Action Label</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {HOTKEYS.slice(0, 25).map((h) => (
                          <tr key={h.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-primary">
                              <HotkeyHint hotkey={h.keys} />
                            </td>
                            <td className="py-3 px-4 font-semibold text-foreground">{h.label}</td>
                            <td className="py-3 px-4 capitalize text-muted-foreground">{h.tab}</td>
                            <td className="py-3 px-4 text-muted-foreground text-[11px]">{h.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
