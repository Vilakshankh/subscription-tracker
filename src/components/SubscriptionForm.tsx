'use client'

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or greater'),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  renewalDate: z.string().min(1, 'Renewal date is required'),
  category: z.string().min(1, 'Category is required'),
})

export type FormValues = z.infer<typeof formSchema>

const CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Development',
  'Design',
  'Security',
  'Storage',
  'Health',
  'Finance',
  'Other',
]

interface Props {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: FormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function SubscriptionForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save' }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: defaultValues?.name ?? '',
      amount: defaultValues?.amount ?? 0,
      billingCycle: defaultValues?.billingCycle ?? 'MONTHLY',
      renewalDate: defaultValues?.renewalDate ?? '',
      category: defaultValues?.category ?? '',
    },
  })

  const billingCycle = watch('billingCycle')
  const category = watch('category')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g. Netflix"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...register('amount')}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Billing Cycle */}
      <div className="space-y-1">
        <Label>Billing Cycle</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="MONTHLY"
              checked={billingCycle === 'MONTHLY'}
              onChange={() => setValue('billingCycle', 'MONTHLY')}
              className="accent-primary"
            />
            <span className="text-sm">Monthly</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="YEARLY"
              checked={billingCycle === 'YEARLY'}
              onChange={() => setValue('billingCycle', 'YEARLY')}
              className="accent-primary"
            />
            <span className="text-sm">Yearly</span>
          </label>
        </div>
        {errors.billingCycle && (
          <p className="text-xs text-destructive">{errors.billingCycle.message}</p>
        )}
      </div>

      {/* Renewal Date */}
      <div className="space-y-1">
        <Label htmlFor="renewalDate">Renewal Date</Label>
        <Input
          id="renewalDate"
          type="date"
          {...register('renewalDate')}
        />
        {errors.renewalDate && (
          <p className="text-xs text-destructive">{errors.renewalDate.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={(val: string | null) => setValue('category', val ?? '')}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
