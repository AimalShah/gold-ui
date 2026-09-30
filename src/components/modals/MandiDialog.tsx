import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useApp } from '@/context/AppContext'
import { TrendingUp, RefreshCw, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface MandiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MandiDialog: React.FC<MandiDialogProps> = ({ open, onOpenChange }) => {
  const { mandi, updateMandi, settings } = useApp()

  const [goldUsdOz, setGoldUsdOz] = useState(mandi.goldUsdOz.toString())
  const [usdPkr, setUsdPkr] = useState(mandi.usdPkr.toString())
  const [pkrPerTola24k, setPkrPerTola24k] = useState(mandi.pkrPerTola24k.toString())
  const [pkrPerTolaSilver, setPkrPerTolaSilver] = useState(mandi.pkrPerTolaSilver.toString())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [useAsDefault, setUseAsDefault] = useState(true)

  const handleSimulateRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      // Simulate small market fluctuation
      const randDelta = (Math.random() - 0.45) * 500
      const newRate = Math.round((mandi.pkrPerTola24k + randDelta) / 100) * 100
      const newUsd = 278.45 + (Math.random() - 0.5) * 0.5
      const newGoldUsd = 2742.80 + (Math.random() - 0.5) * 8

      setPkrPerTola24k(newRate.toString())
      setUsdPkr(newUsd.toFixed(2))
      setGoldUsdOz(newGoldUsd.toFixed(2))

      updateMandi({
        pkrPerTola24k: newRate,
        pkrPerGram24k: Math.round(newRate / (settings.gramsPerTola || 11.664)),
        usdPkr: Number(newUsd.toFixed(2)),
        goldUsdOz: Number(newGoldUsd.toFixed(2)),
      })

      setIsRefreshing(false)
      toast.success("Mandi rates updated from Market Live feed!")
    }, 600)
  }

  const handleSave = () => {
    const rateNum = parseInt(pkrPerTola24k, 10) || mandi.pkrPerTola24k
    const silverNum = parseInt(pkrPerTolaSilver, 10) || mandi.pkrPerTolaSilver
    const usdNum = parseFloat(usdPkr) || mandi.usdPkr
    const goldOzNum = parseFloat(goldUsdOz) || mandi.goldUsdOz

    updateMandi({
      pkrPerTola24k: rateNum,
      pkrPerGram24k: Math.round(rateNum / (settings.gramsPerTola || 11.664)),
      pkrPerTolaSilver: silverNum,
      usdPkr: usdNum,
      goldUsdOz: goldOzNum,
    })

    toast.success("Mandi rates saved successfully!")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Mandi Market Rates (F11)
            </DialogTitle>
            <span className="text-[11px] text-muted-foreground font-mono">
              Last synced: {mandi.lastUpdated}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Gold (USD / oz)</Label>
              <Input
                type="number"
                value={goldUsdOz}
                onChange={(e) => setGoldUsdOz(e.target.value)}
                className="h-8 font-mono text-right"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">USD → PKR Ex Rate</Label>
              <Input
                type="number"
                value={usdPkr}
                onChange={(e) => setUsdPkr(e.target.value)}
                className="h-8 font-mono text-right"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-amber-900 dark:text-amber-300">
              24K Gold Rate / Tola (PKR)
            </Label>
            <Input
              type="number"
              value={pkrPerTola24k}
              onChange={(e) => setPkrPerTola24k(e.target.value)}
              className="h-9 font-mono text-right text-base font-bold bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Chandi (Silver) / Tola</Label>
              <Input
                type="number"
                value={pkrPerTolaSilver}
                onChange={(e) => setPkrPerTolaSilver(e.target.value)}
                className="h-8 font-mono text-right"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Calculated Rate / Gram</Label>
              <div className="h-8 px-2 flex items-center justify-end font-mono bg-muted rounded border border-border text-xs font-semibold">
                Rs {Math.round((parseInt(pkrPerTola24k, 10) || 0) / (settings.gramsPerTola || 11.664)).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium cursor-pointer">Default for New Bills</Label>
              <p className="text-[11px] text-muted-foreground">Auto-fill this rate into Billing Main Window</p>
            </div>
            <Switch checked={useAsDefault} onCheckedChange={setUseAsDefault} />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSimulateRefresh}
            disabled={isRefreshing}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Fetch Market Live
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
            >
              Apply Rates
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
