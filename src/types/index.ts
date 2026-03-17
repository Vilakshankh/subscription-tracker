export type BillingCycle = 'MONTHLY' | 'YEARLY'
export type SubscriptionSource = 'MANUAL' | 'GMAIL'

export interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: BillingCycle
  renewalDate: string // ISO date string
  category: string
  source: SubscriptionSource
  isActive: boolean
  createdAt: string
}

export interface DetectedSubscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: BillingCycle | null
  renewalDate: string | null
  confidence: 'high' | 'medium' | 'low'
  emailSubject: string
  emailDate: string
  alreadyImported: boolean
}
