import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, differenceInDays } from "date-fns"
import type { Subscription } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function toMonthlyAmount(sub: Pick<Subscription, 'amount' | 'billingCycle'>): number {
  return sub.billingCycle === 'YEARLY' ? sub.amount / 12 : sub.amount
}

export function toYearlyAmount(sub: Pick<Subscription, 'amount' | 'billingCycle'>): number {
  return sub.billingCycle === 'MONTHLY' ? sub.amount * 12 : sub.amount
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const days = differenceInDays(date, new Date())
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)} days ago`
  if (days <= 30) return `in ${days} days`
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function generateId(): string {
  return 'sub_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}
