import { NextResponse } from 'next/server'
import { EC2Service } from '@/lib/aws/ec2-service'
import { supabase } from '@/lib/supabase/client'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get instance from database
    const { data: instance, error } = await supabase
      .from('instances')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      )
    }

    // Terminate EC2 instance
    const ec2Service = EC2Service.getInstance()
    await ec2Service.terminateInstance(instance.ec2_instance_id)

    // Update instance status in database
    const { error: updateError } = await supabase
      .from('instances')
      .update({
        status: 'terminated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error terminating instance:', error)
    return NextResponse.json(
      { error: 'Failed to terminate instance' },
      { status: 500 }
    )
  }
} 