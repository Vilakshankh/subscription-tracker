'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SubscriptionForm, type FormValues } from './SubscriptionForm'
import type { Subscription } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: Omit<Subscription, 'id' | 'createdAt'>) => void
}

export function AddSubscriptionDialog({ open, onOpenChange, onAdd }: Props) {
  function handleSubmit(data: FormValues) {
    onAdd({
      name: data.name,
      amount: data.amount,
      currency: 'USD',
      billingCycle: data.billingCycle,
      renewalDate: new Date(data.renewalDate).toISOString(),
      category: data.category,
      source: 'MANUAL',
      isActive: true,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <SubscriptionForm onSubmit={handleSubmit} submitLabel="Add Subscription" />
      </DialogContent>
    </Dialog>
  )
}
