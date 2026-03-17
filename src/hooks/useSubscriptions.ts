'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Subscription, DetectedSubscription } from '@/types'
import { DUMMY_SUBSCRIPTIONS } from '@/lib/dummy-data'
import { toMonthlyAmount, toYearlyAmount, generateId } from '@/lib/utils'
import { differenceInDays } from 'date-fns'

const STORAGE_KEY = 'subscription-tracker-data'
const SEEDED_KEY = 'subscription-tracker-seeded'

interface Stats {
  totalMonthlySpend: number
  totalYearlySpend: number
  upcomingRenewals: Subscription[]
  activeCount: number
}

function computeStats(subscriptions: Subscription[]): Stats {
  const active = subscriptions.filter(s => s.isActive)
  const totalMonthlySpend = active.reduce((sum, s) => sum + toMonthlyAmount(s), 0)
  const totalYearlySpend = active.reduce((sum, s) => sum + toYearlyAmount(s), 0)
  const upcomingRenewals = active
    .filter(s => differenceInDays(new Date(s.renewalDate), new Date()) <= 30)
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
  return { totalMonthlySpend, totalYearlySpend, upcomingRenewals, activeCount: active.length }
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const seeded = localStorage.getItem(SEEDED_KEY)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!seeded || !stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_SUBSCRIPTIONS))
      localStorage.setItem(SEEDED_KEY, 'true')
      setSubscriptions(DUMMY_SUBSCRIPTIONS)
    } else {
      setSubscriptions(JSON.parse(stored))
    }
    setHydrated(true)
  }, [])

  const persist = useCallback((updated: Subscription[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSubscriptions(updated)
  }, [])

  const add = useCallback((data: Omit<Subscription, 'id' | 'createdAt'>) => {
    setSubscriptions(prev => {
      const updated = [...prev, { ...data, id: generateId(), createdAt: new Date().toISOString() }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const update = useCallback((id: string, data: Partial<Subscription>) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...data } : s)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const remove = useCallback((id: string) => {
    setSubscriptions(prev => {
      const updated = prev.filter(s => s.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const importFromGmail = useCallback((items: DetectedSubscription[]) => {
    setSubscriptions(prev => {
      const newSubs: Subscription[] = items.map(item => ({
        id: generateId(),
        name: item.name,
        amount: item.amount,
        currency: item.currency,
        billingCycle: item.billingCycle ?? 'MONTHLY',
        renewalDate: item.renewalDate ?? new Date().toISOString(),
        category: 'Other',
        source: 'GMAIL' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      }))
      const updated = [...prev, ...newSubs]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const stats = computeStats(subscriptions)

  return { subscriptions, add, update, remove, importFromGmail, stats, hydrated, persist }
}
