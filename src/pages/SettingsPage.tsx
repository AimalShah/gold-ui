import React from 'react'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { Save } from 'lucide-react'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { SettingsSidebarNav } from '@/components/settings/SettingsSidebarNav'
import { SettingsTabsContent } from '@/components/settings/SettingsTabsContent'

export const SettingsPage: React.FC = () => {
  const form = useSettingsForm()

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
              onClick={form.handleSave}
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-2 shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            <Tabs defaultValue="shop" className="flex flex-col md:flex-row min-h-[620px]">
              <SettingsSidebarNav />
              <SettingsTabsContent form={form} />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
