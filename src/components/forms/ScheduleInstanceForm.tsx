'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const scheduleTypes = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
  { id: 'once', name: 'Once' },
]

const daysOfWeek = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

const scheduleSchema = z.object({
  action: z.enum(['start', 'stop']),
  scheduleType: z.enum(['daily', 'weekly', 'monthly', 'once']),
  dayOfWeek: z.number().min(0).max(6).nullable().optional(),
  dayOfMonth: z.number().min(1).max(31).nullable().optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  date: z.string().optional(),
  timezone: z.string().default('UTC'),
})

type FormData = z.infer<typeof scheduleSchema>

export default function ScheduleInstanceForm({ instanceId }: { instanceId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      action: 'start',
      scheduleType: 'daily',
      time: '08:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  const scheduleType = watch('scheduleType')

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/instances/${instanceId}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create schedule')
      }

      router.refresh()
    } catch (error) {
      console.error('Error creating schedule:', error)
      setError('Failed to create schedule. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700">
          Action
        </label>
        <div className="mt-1">
          <select
            id="action"
            {...register('action')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="start">Start Instance</option>
            <option value="stop">Stop Instance</option>
          </select>
        </div>
        {errors.action && (
          <p className="mt-1 text-sm text-red-600">{errors.action.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700">
          Schedule Type
        </label>
        <div className="mt-1">
          <select
            id="scheduleType"
            {...register('scheduleType')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {scheduleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        {errors.scheduleType && (
          <p className="mt-1 text-sm text-red-600">{errors.scheduleType.message}</p>
        )}
      </div>

      {scheduleType === 'weekly' && (
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
            Day of Week
          </label>
          <div className="mt-1">
            <select
              id="dayOfWeek"
              {...register('dayOfWeek', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {daysOfWeek.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.name}
                </option>
              ))}
            </select>
          </div>
          {errors.dayOfWeek && (
            <p className="mt-1 text-sm text-red-600">{errors.dayOfWeek.message}</p>
          )}
        </div>
      )}

      {scheduleType === 'monthly' && (
        <div>
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700">
            Day of Month
          </label>
          <div className="mt-1">
            <select
              id="dayOfMonth"
              {...register('dayOfMonth', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          {errors.dayOfMonth && (
            <p className="mt-1 text-sm text-red-600">{errors.dayOfMonth.message}</p>
          )}
        </div>
      )}

      {scheduleType === 'once' && (
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="mt-1">
            <input
              type="date"
              id="date"
              {...register('date')}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <div className="mt-1">
          <input
            type="time"
            id="time"
            {...register('time')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        {errors.time && (
          <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
          Timezone
        </label>
        <div className="mt-1">
          <select
            id="timezone"
            {...register('timezone')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {Intl.supportedValuesOf('timeZone').map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Schedule'}
        </button>
      </div>
    </form>
  )
} 