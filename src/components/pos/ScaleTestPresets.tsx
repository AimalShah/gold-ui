import React from 'react'

interface PresetItem {
  label: string
  weightMg: number
}

interface ScaleTestPresetsProps {
  samplePresets: PresetItem[]
  onSelectPreset: (weightMg: number) => void
}

export const ScaleTestPresets: React.FC<ScaleTestPresetsProps> = ({
  samplePresets,
  onSelectPreset,
}) => {
  return (
    <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-1.5">
      <div className="text-[11px] font-medium text-muted-foreground">
        Click any test weight to simulate item placed on scale:
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
        {samplePresets.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelectPreset(item.weightMg)}
            className="py-1.5 px-2 rounded border border-border bg-background hover:bg-muted text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-medium text-foreground truncate">{item.label}</div>
            <div className="text-[10px] font-mono text-muted-foreground">
              {(item.weightMg / 1000).toFixed(3)}g
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
