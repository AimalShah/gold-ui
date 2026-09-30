import React from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, List, LayoutGrid } from 'lucide-react'

interface OrdersFilterBarProps {
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  viewMode: 'list' | 'kanban'
  setViewMode: (v: 'list' | 'kanban') => void
}

export const OrdersFilterBar: React.FC<OrdersFilterBarProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:basis-[70%]">
          <div className="relative w-full sm:basis-[60%]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search order #, customer name, jewellery description..."
              className="h-11 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 sm:basis-[40%]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_workshop">In Workshop</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 font-medium ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="size-4" /> Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 font-medium ${
                viewMode === 'kanban'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="size-4" /> Board
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
