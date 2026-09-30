import React from 'react'
import { HOTKEYS } from '@/lib/hotkeys'
import { HotkeyHint } from '@/components/shared/HotkeyHint'

export const HotkeysTab: React.FC = () => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}
