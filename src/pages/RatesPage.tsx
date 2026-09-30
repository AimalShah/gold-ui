import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { MoneyInput } from '@/components/shared/MoneyInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  Clock,
  DollarSign,
  Calendar,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { toast } from 'sonner'

export const RatesPage: React.FC = () => {
  const { mandi, updateMandi, rateHistory, settings } = useApp()

  const [goldUsd, setGoldUsd] = useState(mandi.goldUsdOz.toString())
  const [usdPkr, setUsdPkr] = useState(mandi.usdPkr.toString())
  const [pkr24k, setPkr24k] = useState(mandi.pkrPerTola24k.toString())
  const [pkrSilver, setPkrSilver] = useState(mandi.pkrPerTolaSilver.toString())
  const [refreshInterval, setRefreshInterval] = useState('1m')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = () => {
    setIsUpdating(true)
    const rateNum = parseInt(pkr24k, 10) || mandi.pkrPerTola24k
    const silverNum = parseInt(pkrSilver, 10) || mandi.pkrPerTolaSilver

    setTimeout(() => {
      updateMandi({
        goldUsdOz: parseFloat(goldUsd) || mandi.goldUsdOz,
        usdPkr: parseFloat(usdPkr) || mandi.usdPkr,
        pkrPerTola24k: rateNum,
        pkrPerGram24k: Math.round(rateNum / (settings.gramsPerTola || 11.664)),
        pkrPerTolaSilver: silverNum,
      })
      setIsUpdating(false)
      toast.success("Mandi market rates updated across system!")
    }, 400)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Top Header */}
      <div className="h-12 border-b px-4 flex items-center justify-between bg-card/60 select-none shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          <h1 className="font-bold text-sm text-foreground">Live Sarafa Mandi Rates & Historical Trends (F11)</h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Last Synced: {mandi.lastUpdated}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* KPI Chips */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg border bg-card shadow-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Gold International (USD/oz)</span>
            <div className="text-2xl font-mono font-bold text-foreground">
              ${mandi.goldUsdOz.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +0.45% today
            </span>
          </div>

          <div className="p-3.5 rounded-lg border bg-card shadow-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">USD / PKR Exchange Rate</span>
            <div className="text-2xl font-mono font-bold text-foreground">
              {mandi.usdPkr.toFixed(2)} PKR
            </div>
            <span className="text-[10px] text-muted-foreground">Interbank Forex</span>
          </div>

          <div className="p-3.5 rounded-lg border bg-amber-50 dark:bg-amber-950/40 border-amber-300 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">24K Gold Rate / Tola</span>
            <div className="text-2xl font-mono font-black text-amber-900 dark:text-amber-100">
              Rs {mandi.pkrPerTola24k.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-700 font-mono">1 Tola = {settings.gramsPerTola} g</span>
          </div>

          <div className="p-3.5 rounded-lg border bg-card shadow-xs">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Chandi / Silver Rate / Tola</span>
            <div className="text-2xl font-mono font-bold text-foreground">
              Rs {mandi.pkrPerTolaSilver.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground">Pure Bullion Bar</span>
          </div>
        </div>

        {/* Chart + Rate Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Rate Trend Line Chart (7 cols) */}
          <div className="lg:col-span-7 rounded-lg border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Gold Rate History Trend (Last 10 Days)
                </h3>
                <p className="text-[11px] text-muted-foreground">PKR per tola historical movements</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Rs {mandi.pkrPerTola24k.toLocaleString()}
              </Badge>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateHistory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={['dataMin - 2000', 'dataMax + 2000']}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: any) => [`Rs ${v.toLocaleString()}`, 'Rate / Tola']}
                    labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    contentStyle={{ fontSize: 11, borderRadius: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ratePkr"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#d97706' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rate Update & Override Form (5 cols) */}
          <div className="lg:col-span-5 rounded-lg border bg-card p-4 space-y-4 shadow-xs">
            <div className="border-b pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                Manual Rate Override & Live Feed Config
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Override today's market rates for all new transactions.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Gold USD / oz</Label>
                  <Input
                    value={goldUsd}
                    onChange={(e) => setGoldUsd(e.target.value)}
                    className="h-8 font-mono text-right"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">USD → PKR</Label>
                  <Input
                    value={usdPkr}
                    onChange={(e) => setUsdPkr(e.target.value)}
                    className="h-8 font-mono text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  24K Gold Rate / Tola (PKR)
                </Label>
                <Input
                  value={pkr24k}
                  onChange={(e) => setPkr24k(e.target.value)}
                  className="h-9 font-mono text-right text-base font-bold bg-amber-50 dark:bg-amber-950/40 border-amber-300"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Chandi (Silver) Rate / Tola (PKR)</Label>
                <Input
                  value={pkrSilver}
                  onChange={(e) => setPkrSilver(e.target.value)}
                  className="h-8 font-mono text-right"
                />
              </div>

              <div className="space-y-1 pt-1">
                <Label className="text-xs">Auto-Refresh Interval</Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off (Manual only)</SelectItem>
                    <SelectItem value="1m">Every 1 Minute</SelectItem>
                    <SelectItem value="5m">Every 5 Minutes</SelectItem>
                    <SelectItem value="15m">Every 15 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                  Save & Broadcast Rate Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
