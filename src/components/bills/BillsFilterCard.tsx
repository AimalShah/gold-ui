import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BillsFilterCardProps {
  search: string
  setSearch: (s: string) => void
  typeFilter: string
  setTypeFilter: (t: string) => void
  totalCount: number
}

export const BillsFilterCard: React.FC<BillsFilterCardProps> = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  totalCount,
}) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>Filter Invoices & Purchis</span>
        <span>Total {totalCount} Invoices Found</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:basis-[50%]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bill #, customer name, date..."
            className="h-11 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-11 md:basis-[30%]">
            <SelectValue placeholder="All Transaction Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transaction Types</SelectItem>
            <SelectItem value="sale">Gold Sales</SelectItem>
            <SelectItem value="purchase">Gold Purchases</SelectItem>
            <SelectItem value="general">General / Walk-in</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full md:basis-[20%]"
          onClick={() => {
            setSearch('')
            setTypeFilter('all')
          }}
        >
          Reset
        </Button>
      </div>
    </Card>
  )
}
