import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase/client'
import { z } from 'zod'

const updateScheduleSchema = z.object({
  enabled: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; scheduleId: string } }
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

    // Parse and validate request body
    const json = await request.json()
    const body = updateScheduleSchema.parse(json)
    
    // Update schedule
    const { error } = await supabase
      .from('instance_schedules')
      .update({
        enabled: body.enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.scheduleId)
      .eq('instance_id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; scheduleId: string } }
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

    // Delete schedule
    const { error } = await supabase
      .from('instance_schedules')
      .delete()
      .eq('id', params.scheduleId)
      .eq('instance_id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
} 