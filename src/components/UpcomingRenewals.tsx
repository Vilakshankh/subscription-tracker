import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Bell } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { differenceInDays } from 'date-fns'
import type { Subscription } from '@/types'

interface Props {
  renewals: Subscription[]
  onEdit: (sub: Subscription) => void
}

export function UpcomingRenewals({ renewals, onEdit }: Props) {
  if (renewals.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">Upcoming Renewals</h2>
        </div>
        <div className="rounded-md border p-6 text-center">
          <p className="text-sm text-muted-foreground">No renewals in the next 30 days.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Upcoming Renewals</h2>
        <Badge variant="secondary" className="text-xs">
          {renewals.length}
        </Badge>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Renews In</TableHead>
              <TableHead className="text-right w-[60px]">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renewals.map(sub => {
              const days = differenceInDays(new Date(sub.renewalDate), new Date())
              let daysLabel: string
              if (days === 0) daysLabel = 'Today'
              else if (days === 1) daysLabel = '1 day'
              else daysLabel = `${days} days`

              return (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.name}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sub.amount, sub.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={days <= 3 ? 'text-destructive font-semibold' : days <= 7 ? 'text-orange-500 font-medium' : ''}>
                      {daysLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(sub)}
                      aria-label={`Edit ${sub.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
