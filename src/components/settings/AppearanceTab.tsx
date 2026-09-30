import React from 'react'
import { Label } from '@/components/ui/label'

interface AppearanceTabProps {
  theme: string
  setTheme: (t: 'dark' | 'light') => void
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ theme, setTheme }) => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}
