import React from 'react'
import { Karigar } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WeightInput } from '@/components/shared/WeightInput'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface IssueCastingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  karigars: Karigar[]
  castKarigarId: string
  setCastKarigarId: (v: string) => void
  castIssuedMg: number
  setCastIssuedMg: (v: number) => void
  castCarat: number
  setCastCarat: (v: number) => void
  castWastagePercent: number
  setCastWastagePercent: (v: number) => void
  castPurpose: string
  setCastPurpose: (v: string) => void
  onIssue: () => void
}

export const IssueCastingModal: React.FC<IssueCastingModalProps> = ({
  open,
  onOpenChange,
  karigars,
  castKarigarId,
  setCastKarigarId,
  castIssuedMg,
  setCastIssuedMg,
  castCarat,
  setCastCarat,
  castWastagePercent,
  setCastWastagePercent,
  castPurpose,
  setCastPurpose,
  onIssue,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-foreground">
            Issue Casting Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Workshop Karigar / Caster *</Label>
            <Select value={castKarigarId} onValueChange={setCastKarigarId}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {karigars.map((k) => (
                  <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Issued Metal Weight (Au)</Label>
            <WeightInput value={castIssuedMg} onChange={setCastIssuedMg} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Karat</Label>
              <Select value={castCarat.toString()} onValueChange={(v) => setCastCarat(parseInt(v, 10))}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24K</SelectItem>
                  <SelectItem value="22">22K</SelectItem>
                  <SelectItem value="21">21K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Allowed Wastage (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={castWastagePercent}
                onChange={(e) => setCastWastagePercent(parseFloat(e.target.value) || 0)}
                className="h-10 text-right"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Purpose / Casting Items</Label>
            <Input
              value={castPurpose}
              onChange={(e) => setCastPurpose(e.target.value)}
              placeholder="e.g. Ring batch casting"
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onIssue} className="font-semibold">
            Issue Casting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
