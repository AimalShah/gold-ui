import React from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface CustomersFilterBarProps {
  search: string
  setSearch: (v: string) => void
  filterType: string
  setFilterType: (v: string) => void
  onReset: () => void
}

export const CustomersFilterBar: React.FC<CustomersFilterBarProps> = ({
  search,
  setSearch,
  filterType,
  setFilterType,
  onReset,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:basis-[50%]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, phone, city, account ID..."
            className="h-11 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-11 md:basis-[30%]">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customer Accounts</SelectItem>
            <SelectItem value="owes_gold">Owes Gold Balance</SelectItem>
            <SelectItem value="owes_cash">Owes Cash Balance</SelectItem>
            <SelectItem value="advance">Advance (Credit)</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="secondary"
          className="h-11 w-full md:basis-[20%]"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </Card>
  )
}
