import React from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { ShopProfileTab } from '@/components/settings/ShopProfileTab'
import { UnitsAndBillingTab } from '@/components/settings/UnitsAndBillingTab'
import { AppearanceTab } from '@/components/settings/AppearanceTab'
import { PrintingTab } from '@/components/settings/PrintingTab'
import { UsersTab, BackupTab } from '@/components/settings/UsersAndBackupTab'
import { HotkeysTab } from '@/components/settings/HotkeysTab'
import { useSettingsForm } from '@/hooks/useSettingsForm'

interface SettingsTabsContentProps {
  form: ReturnType<typeof useSettingsForm>
}

export const SettingsTabsContent: React.FC<SettingsTabsContentProps> = ({ form }) => {
  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
      <TabsContent value="shop" className="mt-0">
        <ShopProfileTab
          shopName={form.shopName}
          setShopName={form.setShopName}
          address={form.address}
          setAddress={form.setAddress}
          phone={form.phone}
          setPhone={form.setPhone}
          billFooter={form.billFooter}
          setBillFooter={form.setBillFooter}
        />
      </TabsContent>

      <TabsContent value="units" className="mt-0">
        <UnitsAndBillingTab
          gramsPerTola={form.gramsPerTola}
          setGramsPerTola={form.setGramsPerTola}
          zakatPct={form.zakatPct}
          setZakatPct={form.setZakatPct}
        />
      </TabsContent>

      <TabsContent value="billing" className="mt-0">
        <UnitsAndBillingTab
          gramsPerTola={form.gramsPerTola}
          setGramsPerTola={form.setGramsPerTola}
          zakatPct={form.zakatPct}
          setZakatPct={form.setZakatPct}
        />
      </TabsContent>

      <TabsContent value="appearance" className="mt-0">
        <AppearanceTab theme={form.theme} setTheme={form.setTheme} />
      </TabsContent>

      <TabsContent value="printing" className="mt-0">
        <PrintingTab
          printTemplate={form.printTemplate}
          setPrintTemplate={form.setPrintTemplate}
          printer={form.printer}
          setPrinter={form.setPrinter}
        />
      </TabsContent>

      <TabsContent value="users" className="mt-0">
        <UsersTab users={form.users} />
      </TabsContent>

      <TabsContent value="backup" className="mt-0">
        <BackupTab onBackupNow={form.handleBackupNow} />
      </TabsContent>

      <TabsContent value="hotkeys" className="mt-0">
        <HotkeysTab />
      </TabsContent>
    </div>
  )
}
