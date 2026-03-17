import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import type { Subscription } from '@/types'
import { Bell } from 'lucide-react'

interface Props {
  renewals: Subscription[]
}

export function UpcomingRenewals({ renewals }: Props) {
  if (renewals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No renewals in the next 30 days.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Upcoming Renewals
          <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
            {renewals.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {renewals.map(sub => (
          <div key={sub.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeDate(sub.renewalDate)}</p>
            </div>
            <span className="font-medium">{formatCurrency(sub.amount)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
