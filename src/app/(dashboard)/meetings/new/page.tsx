import { type Metadata } from 'next'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ScheduleMeetingForm from '@/components/forms/ScheduleMeetingForm'

export const metadata: Metadata = {
  title: 'Schedule Meeting - BBB Manager',
  description: 'Schedule a new BigBlueButton meeting',
}

// Get available instances for the dropdown
async function getAvailableInstances() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: instances, error } = await supabase
    .from('instances')
    .select('id, name, status')
    .eq('status', 'running') // Only show running instances
    .order('name')

  if (error) {
    console.error('Error:', error)
    return []
  }

  return instances
}

export default async function ScheduleMeetingPage() {
  const {
    data: { session },
  } = await createServerComponentClient({ cookies }).auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }
  
  const instances = await getAvailableInstances()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Schedule Meeting</h1>
        <Link
          href="/meetings"
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
          aria-label="Back to meetings"
        >
          Back to meetings
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          {instances.length > 0 ? (
            <ScheduleMeetingForm instances={instances} userId={session.user.id} />
          ) : (
            <div className="text-center py-6">
              <h3 className="text-base font-semibold text-gray-900">No running instances available</h3>
              <p className="mt-1 text-sm text-gray-500">
                You need at least one running instance to schedule a meeting.
              </p>
              <div className="mt-6">
                <Link
                  href="/instances"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Go to Instances
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 