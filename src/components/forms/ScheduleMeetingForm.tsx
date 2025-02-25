'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define schema for form validation
const scheduleMeetingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  instanceId: z.string().min(1, 'Please select an instance'),
  startTime: z.string().min(1, 'Please select a start time'),
  durationMinutes: z
    .number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
  recordingEnabled: z.boolean().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof scheduleMeetingSchema>

interface ScheduleMeetingFormProps {
  instances: { id: string; name: string }[]
  userId: string
}

export default function ScheduleMeetingForm({ instances, userId }: ScheduleMeetingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(scheduleMeetingSchema),
    defaultValues: {
      durationMinutes: 60,
      recordingEnabled: false,
    },
    mode: 'onChange',
  })

  // Set min start time to now + 5 minutes
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  const minStartTime = now.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:MM

  // Watch values for preview
  const watchedTitle = watch('title') || 'New Meeting'
  const watchedDuration = watch('durationMinutes') || 60
  const watchedInstance = watch('instanceId')
  const selectedInstance = instances.find(instance => instance.id === watchedInstance)
  const watchedRecording = watch('recordingEnabled')
  const watchedStartTime = watch('startTime')
  
  const startTimeDate = watchedStartTime ? new Date(watchedStartTime) : null
  const endTimeDate = startTimeDate ? new Date(startTimeDate.getTime() + watchedDuration * 60000) : null

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Convert start time to ISO string
      const startTime = new Date(data.startTime).toISOString()

      // Create meeting object
      const meetingData = {
        title: data.title,
        instanceId: data.instanceId,
        creatorId: userId,
        startTime,
        durationMinutes: data.durationMinutes,
        recordingEnabled: data.recordingEnabled || false,
        description: data.description || '',
      }

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      })

      if (!response.ok) {
        throw new Error('Failed to schedule meeting')
      }

      router.push('/meetings')
      router.refresh()
    } catch (error) {
      console.error('Error scheduling meeting:', error)
      setError('Failed to schedule meeting. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const commonDurations = [15, 30, 45, 60, 90, 120]

  return (
    <div className="grid md:grid-cols-5 gap-8">
      {/* Form */}
      <div className="md:col-span-3 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
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

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Meeting Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Weekly Team Meeting"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Instance selection */}
            <div>
              <label htmlFor="instanceId" className="block text-sm font-medium text-gray-700">
                BigBlueButton Server <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="instanceId"
                  {...register('instanceId')}
                  className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.instanceId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an instance</option>
                  {instances.map((instance) => (
                    <option key={instance.id} value={instance.id}>
                      {instance.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.instanceId ? (
                <p className="mt-1 text-sm text-red-600">{errors.instanceId.message}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Select the BBB server to host this meeting</p>
              )}
            </div>

            {/* Time selection */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    id="startTime"
                    {...register('startTime')}
                    min={minStartTime}
                    className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.startTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.startTime ? (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Earliest available time is 5 minutes from now</p>
                )}
              </div>

              <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="durationMinutes"
                    {...register('durationMinutes', { valueAsNumber: true })}
                    min={5}
                    max={480}
                    step={5}
                    className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                      errors.durationMinutes ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.durationMinutes ? (
                  <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Between 5 minutes and 8 hours</p>
                )}
              </div>
            </div>

            {/* Common durations buttons */}
            <div>
              <span className="text-xs text-gray-500 block mb-2">Common durations:</span>
              <div className="flex flex-wrap gap-2">
                {commonDurations.map(duration => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setValue('durationMinutes', duration, { shouldValidate: true })}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      watchedDuration === duration 
                        ? 'bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-700/10'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Recording option */}
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="recordingEnabled"
                  type="checkbox"
                  {...register('recordingEnabled')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="recordingEnabled" className="font-medium text-gray-700">
                  Enable Recording
                </label>
                <p className="text-gray-500">Record this meeting for later viewing</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Meeting agenda and details"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Add an agenda or notes for participants</p>
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-5">
              <button
                type="button"
                onClick={() => router.push('/meetings')}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling...
                  </>
                ) : 'Schedule Meeting'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview card */}
      <div className="md:col-span-2">
        <div className="sticky top-6">
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Meeting Preview</h3>
              
              <div className="rounded-md bg-white border border-gray-200 shadow-sm overflow-hidden">
                {/* Colored top banner */}
                <div className="h-2 bg-indigo-600"></div>
                
                <div className="p-4">
                  {/* Title */}
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {watchedTitle}
                  </h4>
                  
                  {/* Instance */}
                  {selectedInstance && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                      {selectedInstance.name}
                    </div>
                  )}
                  
                  {/* Time */}
                  {startTimeDate && endTimeDate && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {startTimeDate.toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {endTimeDate.toLocaleString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      {` (${watchedDuration} min)`}
                    </div>
                  )}
                  
                  {/* Status */}
                  <div className="mt-4 flex">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Scheduled
                    </span>
                    
                    {watchedRecording && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        Recording
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>This is how your meeting will appear to participants.</p>
                <p className="mt-2">
                  After scheduling, you can start the meeting at the scheduled time or cancel it if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 