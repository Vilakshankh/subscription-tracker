'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SubscriptionForm, type FormValues } from './SubscriptionForm'
import type { Subscription } from '@/types'

interface Props {
  subscription: Subscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, data: Partial<Subscription>) => void
}

export function EditSubscriptionDialog({ subscription, open, onOpenChange, onUpdate }: Props) {
  if (!subscription) return null

  // Convert ISO date string to YYYY-MM-DD for the date input
  const renewalDateValue = subscription.renewalDate
    ? new Date(subscription.renewalDate).toISOString().split('T')[0]
    : ''

  function handleSubmit(data: FormValues) {
    if (!subscription) return
    onUpdate(subscription.id, {
      name: data.name,
      amount: data.amount,
      currency: 'USD',
      billingCycle: data.billingCycle,
      renewalDate: new Date(data.renewalDate).toISOString(),
      category: data.category,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <SubscriptionForm
          defaultValues={{
            name: subscription.name,
            amount: subscription.amount,
            billingCycle: subscription.billingCycle,
            renewalDate: renewalDateValue,
            category: subscription.category,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  )
}
