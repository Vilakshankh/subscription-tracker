'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, CheckCircle2 } from 'lucide-react'
import { DUMMY_GMAIL_DETECTIONS } from '@/lib/dummy-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { DetectedSubscription } from '@/types'

interface Props {
  onImport: (items: DetectedSubscription[]) => void
}

const confidenceConfig = {
  high: { color: 'bg-green-500', label: 'High' },
  medium: { color: 'bg-yellow-500', label: 'Medium' },
  low: { color: 'bg-red-500', label: 'Low' },
}

export function GmailScanPanel({ onImport }: Props) {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function handleScan() {
    setScanning(true)
    setScanned(false)
    setSelected(new Set())
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
    }, 1500)
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleImport() {
    const itemsToImport = DUMMY_GMAIL_DETECTIONS.filter(
      d => selected.has(d.id) && !d.alreadyImported
    )
    onImport(itemsToImport)
  }

  const importableSelected = [...selected].filter(
    id => !DUMMY_GMAIL_DETECTIONS.find(d => d.id === id)?.alreadyImported
  )

  return (
    <div className="space-y-6">
      {/* Scan trigger */}
      <div className="flex items-center gap-4">
        <Button onClick={handleScan} disabled={scanning} className="gap-2">
          <Mail className="h-4 w-4" />
          {scanning ? 'Scanning...' : scanned ? 'Scan Again' : 'Scan Gmail'}
        </Button>
        {scanned && (
          <span className="text-sm text-muted-foreground">
            Found {DUMMY_GMAIL_DETECTIONS.length} potential subscriptions
          </span>
        )}
      </div>

      {/* Scanning skeletons */}
      {scanning && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4 rounded mt-1" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {scanned && !scanning && (
        <div className="space-y-3">
          {DUMMY_GMAIL_DETECTIONS.map(detection => {
            const conf = confidenceConfig[detection.confidence]
            const isSelected = selected.has(detection.id)

            return (
              <Card
                key={detection.id}
                className={`transition-colors ${
                  isSelected && !detection.alreadyImported
                    ? 'border-primary ring-1 ring-primary'
                    : ''
                } ${detection.alreadyImported ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => {
                  if (!detection.alreadyImported) toggleSelect(detection.id)
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={detection.alreadyImported}
                        onChange={() => {
                          if (!detection.alreadyImported) toggleSelect(detection.id)
                        }}
                        onClick={e => e.stopPropagation()}
                        className="h-4 w-4 accent-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Confidence dot */}
                        <span
                          className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${conf.color}`}
                          title={`${conf.label} confidence`}
                        />
                        <span className="font-medium">{detection.name}</span>
                        {detection.alreadyImported && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Already added
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            detection.confidence === 'high'
                              ? 'border-green-500 text-green-600'
                              : detection.confidence === 'medium'
                              ? 'border-yellow-500 text-yellow-600'
                              : 'border-red-400 text-red-500'
                          }`}
                        >
                          {conf.label} confidence
                        </Badge>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                        <span>
                          {detection.amount > 0
                            ? formatCurrency(detection.amount, detection.currency)
                            : 'Free / Unknown'}
                          {detection.billingCycle
                            ? ` / ${detection.billingCycle === 'MONTHLY' ? 'month' : 'year'}`
                            : ''}
                        </span>
                        <span>
                          Renews:{' '}
                          {detection.renewalDate
                            ? formatDate(detection.renewalDate)
                            : 'Unknown'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {detection.emailSubject} &middot; {formatDate(detection.emailDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Import button */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {importableSelected.length > 0
                ? `${importableSelected.length} selected for import`
                : 'Select subscriptions to import'}
            </p>
            <Button
              onClick={handleImport}
              disabled={importableSelected.length === 0}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Import Selected ({importableSelected.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
