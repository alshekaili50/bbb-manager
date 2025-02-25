import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Schema for creating a meeting
const createMeetingSchema = z.object({
  title: z.string().min(3),
  instanceId: z.string().uuid(),
  creatorId: z.string().uuid(),
  startTime: z.string().datetime(),
  durationMinutes: z.number().min(5).max(480),
  recordingEnabled: z.boolean(),
  description: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()
    const body = createMeetingSchema.parse(json)

    // Calculate end time from duration
    const startTime = new Date(body.startTime)
    const endTime = new Date(startTime)
    endTime.setMinutes(startTime.getMinutes() + body.durationMinutes)

    // Get organization ID from user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', body.creatorId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate that the instance belongs to the user's organization
    const { data: instanceData, error: instanceError } = await supabase
      .from('instances')
      .select('id')
      .eq('id', body.instanceId)
      .eq('organization_id', userData.organization_id)
      .single()

    if (instanceError || !instanceData) {
      return NextResponse.json(
        { error: 'Instance not found or does not belong to your organization' },
        { status: 403 }
      )
    }

    // Create meeting in database
    const { data: meeting, error } = await supabase
      .from('meetings')
      .insert([{
        title: body.title,
        instance_id: body.instanceId,
        organization_id: userData.organization_id,
        creator_id: body.creatorId,
        status: 'scheduled',
        start_time: startTime.toISOString(),
        end_time: null, // Will be set when meeting ends
        scheduled_end_time: endTime.toISOString(),
        attendee_count: 0,
        recording_enabled: body.recordingEnabled,
        description: body.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating meeting:', error)
      throw new Error('Failed to create meeting')
    }

    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's organization ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all meetings for the user's organization
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select(`
        *,
        instances(name)
      `)
      .eq('organization_id', userData.organization_id)
      .order('start_time', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
} 