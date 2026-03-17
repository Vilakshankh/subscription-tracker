import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, TrendingUp, LayoutGrid } from 'lucide-react'

interface Props {
  totalMonthlySpend: number
  totalYearlySpend: number
  activeCount: number
}

export function StatsCards({ totalMonthlySpend, totalYearlySpend, activeCount }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spend</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMonthlySpend)}</div>
          <p className="text-xs text-muted-foreground mt-1">per month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Yearly Spend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalYearlySpend)}</div>
          <p className="text-xs text-muted-foreground mt-1">per year</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
          <p className="text-xs text-muted-foreground mt-1">active services</p>
        </CardContent>
      </Card>
    </div>
  )
}
