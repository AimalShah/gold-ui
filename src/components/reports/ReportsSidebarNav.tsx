import React from 'react'

export interface ReportMeta {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

interface ReportsSidebarNavProps {
  reportsList: ReportMeta[]
  selectedReportId: string
  onSelectReport: (id: string) => void
}

export const ReportsSidebarNav: React.FC<ReportsSidebarNavProps> = ({
  reportsList,
  selectedReportId,
  onSelectReport,
}) => {
  return (
    <div className="lg:col-span-4 rounded-lg border border-border bg-card p-3 space-y-1.5 shadow-xs h-fit">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Report Types
      </div>
      {reportsList.map((r) => {
        const Icon = r.icon
        const isSelected = selectedReportId === r.id
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelectReport(r.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm text-left transition-colors cursor-pointer ${
              isSelected
                ? 'bg-accent text-accent-foreground font-semibold border-l-4 border-primary'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <Icon className={`size-5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="truncate">
              <div className="font-medium text-sm leading-tight text-foreground">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">{r.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
