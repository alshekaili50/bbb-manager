import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Schema for schedule creation
const createScheduleSchema = z.object({
  action: z.enum(['start', 'stop']),
  scheduleType: z.enum(['daily', 'weekly', 'monthly', 'once']),
  dayOfWeek: z.number().min(0).max(6).nullable().optional(),
  dayOfMonth: z.number().min(1).max(31).nullable().optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  date: z.string().optional(),
  timezone: z.string(),
})

// Helper function to calculate next run time
function calculateNextRun(data: z.infer<typeof createScheduleSchema>): Date {
  const now = new Date()
  const [hours, minutes] = data.time.split(':').map(Number)
  
  let nextRun = new Date()
  nextRun.setHours(hours, minutes, 0, 0)
  
  // If the time is in the past for today, start from tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1)
  }
  
  switch (data.scheduleType) {
    case 'daily':
      // Already set for next occurrence
      break
    case 'weekly':
      if (data.dayOfWeek !== undefined && data.dayOfWeek !== null) {
        const currentDay = nextRun.getDay()
        const daysUntilNext = (data.dayOfWeek - currentDay + 7) % 7
        
        if (daysUntilNext === 0 && nextRun <= now) {
          // If it's the same day but time has passed, go to next week
          nextRun.setDate(nextRun.getDate() + 7)
        } else {
          nextRun.setDate(nextRun.getDate() + daysUntilNext)
        }
      }
      break
    case 'monthly':
      if (data.dayOfMonth !== undefined && data.dayOfMonth !== null) {
        nextRun.setDate(data.dayOfMonth)
        
        // If the day has already passed this month, go to next month
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
      }
      break
    case 'once':
      if (data.date) {
        const [year, month, day] = data.date.split('-').map(Number)
        nextRun = new Date(year, month - 1, day, hours, minutes)
      }
      break
  }
  
  return nextRun
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: schedules, error } = await supabase
      .from('instance_schedules')
      .select('*')
      .eq('instance_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const supabaseServer = createServerComponentClient({ cookies })
    const { data: { session } } = await supabaseServer.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate instance exists and user has access
    const { data: instance, error: instanceError } = await supabase
      .from('instances')
      .select('*')
      .eq('id', params.id)
      .single()

    if (instanceError || !instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const json = await request.json()
    const body = createScheduleSchema.parse(json)
    
    // Calculate next run time
    const nextRun = calculateNextRun(body)

    // Create schedule
    const { data: schedule, error } = await supabase
      .from('instance_schedules')
      .insert([{
        instance_id: params.id,
        action: body.action,
        schedule_type: body.scheduleType,
        day_of_week: body.dayOfWeek,
        day_of_month: body.dayOfMonth,
        time: body.time,
        enabled: true,
        next_run: nextRun.toISOString(),
        timezone: body.timezone,
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
} 