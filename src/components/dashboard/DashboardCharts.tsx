import React from 'react'
import { Card } from '@/components/ui/card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export const DashboardCharts: React.FC = () => {
  const weeklySalesData = [
    { day: "Mon", sales: 1850000, orders: 12 },
    { day: "Tue", sales: 2200000, orders: 15 },
    { day: "Wed", sales: 1450000, orders: 9 },
    { day: "Thu", sales: 2890000, orders: 19 },
    { day: "Fri", sales: 3100000, orders: 22 },
    { day: "Sat", sales: 3400000, orders: 26 },
    { day: "Sun", sales: 3850000, orders: 28 },
  ]

  const bestSellersData = [
    { category: "24K Bullion / Passa", grams: 1632, share: 55 },
    { category: "22K Bridal Necklaces", grams: 580, share: 22 },
    { category: "21K Traditional Bangles", grams: 340, share: 14 },
    { category: "18K Diamond Rings", grams: 110, share: 9 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Revenue Trend */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-base text-foreground">Weekly Revenue Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Daily PKR sales over the past 7 days</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
            +18.4% this week
          </span>
        </div>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklySalesData}>
              <defs>
                <linearGradient id="chartEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(v: any) => [`Rs ${v.toLocaleString()}`, 'Sales PKR']}
                contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e8f0' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#16a34a"
                strokeWidth={2.5}
                fill="url(#chartEmeraldGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stock Holdings by Karat */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-base text-foreground">Stock Distribution by Karat</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Inventory holdings in pure gold weight</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
            2,662g In Vault
          </span>
        </div>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bestSellersData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}g`} />
              <YAxis dataKey="category" type="category" width={150} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: any) => [`${v} grams`, 'Holdings']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="grams" fill="#16a34a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
