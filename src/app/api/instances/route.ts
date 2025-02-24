import { NextResponse } from 'next/server'
import { z } from 'zod'
import { EC2Service } from '@/lib/aws/ec2-service'
import { supabase } from '@/lib/supabase/client'

const createInstanceSchema = z.object({
  name: z.string().min(3),
  type: z.string(),
  region: z.string(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = createInstanceSchema.parse(json)

    // TODO: Get organization ID from authenticated user
    const organizationId = 'test-org'

    // Create EC2 instance
    const ec2Service = EC2Service.getInstance()
    const instance = await ec2Service.createInstance({
      ...body,
      organizationId,
    })

    // Save instance to database
    const { error } = await supabase
      .from('instances')
      .insert([{
        id: instance.id,
        ec2_instance_id: instance.ec2InstanceId,
        name: instance.name,
        organization_id: instance.organizationId,
        status: instance.status,
        region: instance.region,
        type: instance.type,
        last_active: instance.lastActive.toISOString(),
        cost_per_hour: instance.costPerHour,
        created_at: instance.createdAt.toISOString(),
        updated_at: instance.updatedAt.toISOString(),
      }])

    if (error) {
      console.error('Error saving instance to database:', error)
      throw new Error('Failed to save instance')
    }

    return NextResponse.json(instance)
  } catch (error) {
    console.error('Error creating instance:', error)
    return NextResponse.json(
      { error: 'Failed to create instance' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // TODO: Filter by organization ID from authenticated user
    const { data: instances, error } = await supabase
      .from('instances')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(instances)
  } catch (error) {
    console.error('Error fetching instances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instances' },
      { status: 500 }
    )
  }
} 