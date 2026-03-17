'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GmailScanPanel } from '@/components/GmailScanPanel'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import type { DetectedSubscription } from '@/types'

export default function GmailPage() {
  const { importFromGmail } = useSubscriptions()
  const router = useRouter()

  function handleImport(items: DetectedSubscription[]) {
    importFromGmail(items)
    toast.success(`${items.length} subscription${items.length !== 1 ? 's' : ''} imported successfully`)
    router.push('/dashboard')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gmail Scan</h1>
        <p className="text-muted-foreground mt-1">
          Auto-detect subscriptions from your inbox
        </p>
      </div>

      {/* Simulation notice */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
        This is a simulation using sample data. Real Gmail integration coming soon.
      </div>

      {/* Gmail scan panel */}
      <GmailScanPanel onImport={handleImport} />
    </div>
  )
}
