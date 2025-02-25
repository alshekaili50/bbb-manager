'use client'

import { useState } from 'react'
import { InstanceSchedule } from '@/types'
import { format } from 'date-fns'

interface InstanceSchedulesProps {
  schedules: InstanceSchedule[]
  instanceId: string
}

export default function InstanceSchedules({ schedules, instanceId }: InstanceSchedulesProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  
  const formatScheduleTime = (schedule: InstanceSchedule) => {
    const timeFormat = schedule.time
    let description = ''

    switch (schedule.scheduleType) {
      case 'daily':
        description = `Every day at ${timeFormat}`
        break
      case 'weekly':
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.dayOfWeek || 0]
        description = `Every ${dayName} at ${timeFormat}`
        break
      case 'monthly':
        description = `On day ${schedule.dayOfMonth} of each month at ${timeFormat}`
        break
      case 'once':
        const date = new Date(schedule.nextRun)
        description = `Once on ${format(date, 'PPP')} at ${timeFormat}`
        break
    }

    return description
  }

  const handleToggleSchedule = async (scheduleId: string, currentEnabled: boolean) => {
    try {
      setIsLoading(prev => ({ ...prev, [scheduleId]: true }))
      
      const response = await fetch(`/api/instances/${instanceId}/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !currentEnabled }),
      })

      if (!response.ok) {
        throw new Error('Failed to update schedule')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error updating schedule:', error)
      alert('Failed to update schedule')
    } finally {
      setIsLoading(prev => ({ ...prev, [scheduleId]: false }))
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return
    }

    try {
      setIsLoading(prev => ({ ...prev, [scheduleId]: true }))
      
      const response = await fetch(`/api/instances/${instanceId}/schedules/${scheduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete schedule')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('Failed to delete schedule')
    } finally {
      setIsLoading(prev => ({ ...prev, [scheduleId]: false }))
    }
  }

  if (schedules.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No schedules configured for this instance.
      </div>
    )
  }

  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200">
        {schedules.map((schedule) => (
          <li key={schedule.id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    schedule.action === 'start' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {schedule.action === 'start' ? 'Start' : 'Stop'}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${schedule.enabled ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                    {formatScheduleTime(schedule)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({schedule.timezone})
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Next run: {format(new Date(schedule.nextRun), 'PPp')}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleToggleSchedule(schedule.id, schedule.enabled)}
                  disabled={isLoading[schedule.id]}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {schedule.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  disabled={isLoading[schedule.id]}
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 