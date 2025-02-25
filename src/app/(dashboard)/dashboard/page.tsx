import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

// Get dashboard data
async function getDashboardData() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get meeting stats
  const { data: meetings, error: meetingsError } = await supabase
    .from('meetings')
    .select(`
      id, 
      title, 
      status, 
      start_time, 
      instances(name)
    `)
    .order('start_time', { ascending: false })
    .limit(5)
  
  // Get instance stats
  const { data: instances, error: instancesError } = await supabase
    .from('instances')
    .select('id, name, status, ec2_instance_id')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Get meeting counts by status
  const { data: meetingStats, error: statsError } = await supabase
    .from('meetings')
    .select('status')
  
  if (meetingsError || instancesError || statsError) {
    console.error('Error fetching dashboard data:', meetingsError || instancesError || statsError)
    return {
      recentMeetings: [],
      recentInstances: [],
      meetingStats: {
        total: 0,
        active: 0,
        scheduled: 0,
        ended: 0
      }
    }
  }
  
  // Calculate meeting stats
  const stats = {
    total: meetingStats?.length || 0,
    active: meetingStats?.filter(m => m.status === 'active').length || 0,
    scheduled: meetingStats?.filter(m => m.status === 'scheduled').length || 0,
    ended: meetingStats?.filter(m => m.status === 'ended').length || 0
  }
  
  // Calculate instance stats
  const instanceStats = {
    total: instances?.length || 0,
    running: instances?.filter(i => i.status === 'running').length || 0,
    stopped: instances?.filter(i => i.status === 'stopped').length || 0
  }
  
  return {
    recentMeetings: meetings || [],
    recentInstances: instances || [],
    meetingStats: stats,
    instanceStats
  }
}

export default async function DashboardPage() {
  const {
    data: { session },
  } = await createServerComponentClient({ cookies }).auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }
  
  const { recentMeetings, recentInstances, meetingStats, instanceStats } = await getDashboardData()
  
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Stats overview */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Meeting stats */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Total Meetings</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{meetingStats.total}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/meetings" className="font-medium text-indigo-700 hover:text-indigo-900">
                    View all meetings
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Active meetings */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-green-100 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Active Meetings</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{meetingStats.active}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/meetings?status=active" className="font-medium text-indigo-700 hover:text-indigo-900">
                    View active meetings
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Upcoming meetings */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-blue-100 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Upcoming Meetings</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{meetingStats.scheduled}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/meetings?status=scheduled" className="font-medium text-indigo-700 hover:text-indigo-900">
                    View upcoming meetings
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Running instances */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-indigo-100 p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Running Instances</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{instanceStats?.running || 0}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link href="/instances" className="font-medium text-indigo-700 hover:text-indigo-900">
                    View all instances
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/meetings/new"
                className="relative block rounded-lg border border-gray-300 bg-white p-6 text-center hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Schedule Meeting</span>
              </Link>
              
              <Link
                href="/instances/new"
                className="relative block rounded-lg border border-gray-300 bg-white p-6 text-center hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Create Instance</span>
              </Link>
              
              <Link
                href="/dashboard/analytics"
                className="relative block rounded-lg border border-gray-300 bg-white p-6 text-center hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">View Analytics</span>
              </Link>
              
              <Link
                href="/dashboard/profile"
                className="relative block rounded-lg border border-gray-300 bg-white p-6 text-center hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">Manage Profile</span>
              </Link>
            </div>
          </div>
          
          {/* Recent meetings */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Meetings</h2>
              <Link href="/meetings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            
            {recentMeetings.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow">
                <ul role="list" className="divide-y divide-gray-200">
                  {recentMeetings.map((meeting) => {
                    const startTime = new Date(meeting.start_time);
                    const isUpcoming = new Date() < startTime;
                    const isActive = meeting.status === 'active';
                    
                    return (
                      <li key={meeting.id}>
                        <Link href={`/meetings/${meeting.id}`} className="block hover:bg-gray-50">
                          <div className="flex items-center px-4 py-4 sm:px-6">
                            <div className="min-w-0 flex-1 flex items-center">
                              <div className="flex-shrink-0">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                  isActive 
                                    ? 'bg-green-100' 
                                    : isUpcoming 
                                      ? 'bg-blue-100' 
                                      : 'bg-gray-100'
                                }`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                                    isActive 
                                      ? 'text-green-600' 
                                      : isUpcoming 
                                        ? 'text-blue-600' 
                                        : 'text-gray-600'
                                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 px-4">
                                <div>
                                  <p className="truncate text-sm font-medium text-indigo-600">{meeting.title}</p>
                                  <div className="mt-1 flex items-center">
                                    <p className="truncate text-sm text-gray-500">
                                      {meeting.instances && meeting.instances[0]?.name || 'No instance'}
                                    </p>
                                    <span className="mx-1 text-gray-500">&middot;</span>
                                    <p className="truncate text-sm text-gray-500">
                                      {isUpcoming 
                                        ? `Starts ${formatDistanceToNow(startTime, { addSuffix: true })}` 
                                        : isActive 
                                          ? 'Currently active' 
                                          : `Started ${formatDistanceToNow(startTime, { addSuffix: true })}`
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                meeting.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : meeting.status === 'scheduled' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {meeting.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by scheduling your first meeting.</p>
                <div className="mt-6">
                  <Link
                    href="/meetings/new"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Schedule meeting
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Recent instances */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Instances</h2>
              <Link href="/instances" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            
            {recentInstances.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow">
                <ul role="list" className="divide-y divide-gray-200">
                  {recentInstances.map((instance) => (
                    <li key={instance.id}>
                      <Link href={`/instances/${instance.id}`} className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                instance.status === 'running' 
                                  ? 'bg-green-100' 
                                  : 'bg-gray-100'
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                                  instance.status === 'running' 
                                    ? 'text-green-600' 
                                    : 'text-gray-600'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <p className="truncate text-sm font-medium text-indigo-600">{instance.name}</p>
                                <div className="mt-1 flex items-center">
                                  <p className="truncate text-sm text-gray-500">
                                    {instance.ec2_instance_id || 'No instance ID'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              instance.status === 'running' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {instance.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No instances found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first BBB instance.</p>
                <div className="mt-6">
                  <Link
                    href="/instances/new"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create instance
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 