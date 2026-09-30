import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PrintingTabProps {
  printTemplate: string
  setPrintTemplate: (v: any) => void
  printer: string
  setPrinter: (v: string) => void
}

export const PrintingTab: React.FC<PrintingTabProps> = ({
  printTemplate,
  setPrintTemplate,
  printer,
  setPrinter,
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}
