'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCards } from '@/components/StatsCards'
import { SubscriptionTable } from '@/components/SubscriptionTable'
import { UpcomingRenewals } from '@/components/UpcomingRenewals'
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog'
import { EditSubscriptionDialog } from '@/components/EditSubscriptionDialog'
import { DeleteDialog } from '@/components/DeleteDialog'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import type { Subscription } from '@/types'

export default function DashboardPage() {
  const { subscriptions, add, update, remove, stats, hydrated } = useSubscriptions()

  const [addOpen, setAddOpen] = useState(false)
  const [editSub, setEditSub] = useState<Subscription | null>(null)
  const [deleteSub, setDeleteSub] = useState<Subscription | null>(null)

  function handleAdd(data: Omit<Subscription, 'id' | 'createdAt'>) {
    add(data)
    toast.success(`${data.name} added successfully`)
  }

  function handleUpdate(id: string, data: Partial<Subscription>) {
    update(id, data)
    toast.success('Subscription updated')
  }

  function handleDeleteConfirm() {
    if (!deleteSub) return
    remove(deleteSub.id)
    toast.success(`${deleteSub.name} deleted`)
    setDeleteSub(null)
  }

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Subscriptions</h1>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Stats */}
      <StatsCards
        totalMonthlySpend={stats.totalMonthlySpend}
        totalYearlySpend={stats.totalYearlySpend}
        activeCount={stats.activeCount}
      />

      {/* Upcoming Renewals — high priority, right below stats */}
      <UpcomingRenewals renewals={stats.upcomingRenewals} onEdit={(sub) => setEditSub(sub)} />

      {/* All Subscriptions table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">All Subscriptions</h2>
        <SubscriptionTable
          subscriptions={subscriptions}
          onEdit={(sub) => setEditSub(sub)}
          onDelete={(id) => {
            const sub = subscriptions.find(s => s.id === id)
            if (sub) setDeleteSub(sub)
          }}
        />
      </div>

      {/* Dialogs */}
      <AddSubscriptionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
      />

      <EditSubscriptionDialog
        subscription={editSub}
        open={editSub !== null}
        onOpenChange={(open) => { if (!open) setEditSub(null) }}
        onUpdate={handleUpdate}
      />

      <DeleteDialog
        open={deleteSub !== null}
        onOpenChange={(open) => { if (!open) setDeleteSub(null) }}
        subscriptionName={deleteSub?.name ?? ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
