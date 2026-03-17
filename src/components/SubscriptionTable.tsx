'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatRelativeDate, formatDate, toMonthlyAmount } from '@/lib/utils'
import type { Subscription } from '@/types'

interface Props {
  subscriptions: Subscription[]
  onEdit: (sub: Subscription) => void
  onDelete: (id: string) => void
}

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: Props) {
  const sorted = [...subscriptions].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  )

  if (sorted.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground text-sm">No subscriptions yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Billing Cycle</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Monthly Cost</TableHead>
            <TableHead>Next Renewal</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(sub => (
            <TableRow key={sub.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{sub.name}</span>
                  {sub.source === 'GMAIL' && (
                    <Badge variant="secondary" className="text-xs">Gmail</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{sub.category}</span>
              </TableCell>
              <TableCell>
                <Badge variant={sub.billingCycle === 'YEARLY' ? 'default' : 'outline'}>
                  {sub.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(sub.amount, sub.currency)}
              </TableCell>
              <TableCell className="text-right">
                {sub.billingCycle === 'YEARLY' ? (
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(toMonthlyAmount(sub), sub.currency)}/mo
                  </span>
                ) : (
                  <span className="text-sm">{formatCurrency(sub.amount, sub.currency)}</span>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{formatRelativeDate(sub.renewalDate)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(sub.renewalDate)}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(sub)}
                    aria-label={`Edit ${sub.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(sub.id)}
                    aria-label={`Delete ${sub.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
