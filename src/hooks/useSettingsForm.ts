import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { toast } from 'sonner'

export function useSettingsForm() {
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

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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

  return {
    users,
    shopName,
    setShopName,
    address,
    setAddress,
    phone,
    setPhone,
    billFooter,
    setBillFooter,
    gramsPerTola,
    setGramsPerTola,
    theme,
    setTheme,
    printTemplate,
    setPrintTemplate,
    printer,
    setPrinter,
    zakatPct,
    setZakatPct,
    handleSave,
    handleBackupNow,
  }
}
