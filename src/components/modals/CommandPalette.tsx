import React from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useApp } from '@/context/AppContext'
import { HotkeyHint } from '@/components/shared/HotkeyHint'
import { formatGrams, formatMoney } from '@/lib/gold-math'
import {
  LayoutDashboard,
  Receipt,
  Users,
  ScrollText,
  Hammer,
  BookOpen,
  BarChart3,
  Boxes,
  TrendingUp,
  MessageSquare,
  Settings,
  Calculator,
  Flame,
  Shuffle,
  User,
  PlusCircle,
  Printer,
  Sparkles,
} from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const {
    setCurrentPage,
    customers,
    setSelectedCustomerIdForDetail,
    setCalcOpen,
    setMandiDialogOpen,
    setMixingDialogOpen,
    setActiveMixingSubtype,
    setSwitchUserOpen,
  } = useApp()

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command, page name, or customer name..." />
      <CommandList className="max-h-[360px]">
        <CommandEmpty>No matching actions or customers found.</CommandEmpty>

        {/* Quick Navigation Pages */}
        <CommandGroup heading="Navigation Pages">
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('billing'))}>
            <Receipt className="mr-2 h-4 w-4 text-amber-600" />
            <span>Billing Main Window</span>
            <HotkeyHint hotkey="Alt+B" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-amber-600" />
            <span>Dashboard & KPIs</span>
            <HotkeyHint hotkey="Alt+1" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('customers'))}>
            <Users className="mr-2 h-4 w-4 text-amber-600" />
            <span>Customers & Dual Ledger</span>
            <HotkeyHint hotkey="C" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('bills'))}>
            <ScrollText className="mr-2 h-4 w-4 text-amber-600" />
            <span>Bills & Purchi Register</span>
            <HotkeyHint hotkey="S" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('orders'))}>
            <Hammer className="mr-2 h-4 w-4 text-amber-600" />
            <span>Orders & Workshop Works</span>
            <HotkeyHint hotkey="F3" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('inventory'))}>
            <Boxes className="mr-2 h-4 w-4 text-amber-600" />
            <span>Inventory Management (NEW)</span>
            <HotkeyHint hotkey="Alt+I" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('tehleel'))}>
            <Flame className="mr-2 h-4 w-4 text-amber-600" />
            <span>Gold Karat / Tehleel Screen</span>
            <HotkeyHint hotkey="K+T" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('accounts'))}>
            <BookOpen className="mr-2 h-4 w-4 text-amber-600" />
            <span>Accounts & Day Book</span>
            <HotkeyHint hotkey="F6" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('reports'))}>
            <BarChart3 className="mr-2 h-4 w-4 text-amber-600" />
            <span>Reports & Statements</span>
            <HotkeyHint hotkey="Alt+R" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setCurrentPage('settings'))}>
            <Settings className="mr-2 h-4 w-4 text-amber-600" />
            <span>Settings</span>
            <HotkeyHint hotkey="Ctrl+F12" className="ml-auto" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Tools & Calculations */}
        <CommandGroup heading="Tools & Calculators">
          <CommandItem onSelect={() => runCommand(() => setCalcOpen(true))}>
            <Calculator className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Weight Calculator (10-row)</span>
            <HotkeyHint hotkey="F2" className="ml-auto" />
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setActiveMixingSubtype('mixing')
                setMixingDialogOpen(true)
              })
            }
          >
            <Shuffle className="mr-2 h-4 w-4 text-amber-600" />
            <span>Gold Mixing (Mixing Mail)</span>
            <HotkeyHint hotkey="M+M" className="ml-auto" />
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setActiveMixingSubtype('carat_changer')
                setMixingDialogOpen(true)
              })
            }
          >
            <Sparkles className="mr-2 h-4 w-4 text-amber-600" />
            <span>Carat Changer</span>
            <HotkeyHint hotkey="M+C" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setMandiDialogOpen(true))}>
            <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
            <span>Refresh Mandi Live Rates</span>
            <HotkeyHint hotkey="F11" className="ml-auto" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setSwitchUserOpen(true))}>
            <User className="mr-2 h-4 w-4 text-purple-600" />
            <span>Switch User Profile</span>
            <HotkeyHint hotkey="Ctrl+U" className="ml-auto" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Customers Quick Search */}
        <CommandGroup heading="Customers (Select to view Ledger)">
          {customers.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.name} ${c.phone} ${c.city} ${c.id}`}
              onSelect={() =>
                runCommand(() => {
                  setSelectedCustomerIdForDetail(c.id)
                  setCurrentPage('customers')
                })
              }
            >
              <Users className="mr-2 h-4 w-4 text-zinc-500" />
              <div className="flex flex-col">
                <span className="font-semibold text-xs">{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{c.phone} • {c.city}</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-right font-mono text-xs">
                <span className={c.goldBalanceMg > 0 ? "text-red-600 font-bold" : "text-emerald-600"}>
                  {formatGrams(c.goldBalanceMg)}g
                </span>
                <span className={c.cashBalancePkr > 0 ? "text-red-600 font-bold" : "text-emerald-600"}>
                  {formatMoney(c.cashBalancePkr)}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
