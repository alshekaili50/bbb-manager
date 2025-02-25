import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

async function getMeetings() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: meetings, error } = await supabase
    .from('meetings')
    .select(`
      *,
      instances(name)
    `)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return []
  }

  return meetings
}

async function getMeetingStats() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: meetings, error } = await supabase
    .from('meetings')
    .select('status, id')

  if (error) {
    console.error('Error:', error)
    return {
      total: 0,
      active: 0,
      scheduled: 0,
      ended: 0
    }
  }

  const stats = {
    total: meetings.length,
    active: meetings.filter(m => m.status === 'active').length,
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    ended: meetings.filter(m => m.status === 'ended').length
  }

  return stats
}

export default async function MeetingsPage() {
  const {
    data: { session },
  } = await createServerComponentClient({ cookies }).auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const [meetings, stats] = await Promise.all([
    getMeetings(),
    getMeetingStats()
  ])

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Meetings
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <MeetingStats stats={stats} />
          
          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Your Meetings</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Manage your BigBlueButton meetings and virtual classrooms
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  href="/meetings/new"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Schedule meeting
                </Link>
              </div>
            </div>
            
            {meetings.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {meetings.map((meeting) => {
                  const startTime = new Date(meeting.start_time);
                  const isUpcoming = new Date() < startTime;
                  const isActive = meeting.status === 'active';
                  
                  return (
                    <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="group">
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all duration-200 hover:shadow-md group-hover:border-indigo-200">
                        {/* Status indicator banner */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                          isActive 
                            ? 'bg-green-500' 
                            : isUpcoming 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                        }`} />
                        
                        <div className="p-5">
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              {/* Status badge */}
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                meeting.status === 'active' 
                                  ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                  : meeting.status === 'scheduled'
                                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                                    : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                              }`}>
                                {meeting.status}
                              </span>
                              
                              {/* Instance name badge */}
                              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                                {meeting.instances.name}
                              </span>
                            </div>
                            
                            {/* Attendee count */}
                            <div className="flex items-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                              </svg>
                              <span className="text-xs">{meeting.attendee_count}</span>
                            </div>
                          </div>
                          
                          {/* Meeting title */}
                          <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 truncate">
                            {meeting.title}
                          </h3>
                          
                          {/* Time information */}
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <time dateTime={startTime.toISOString()}>
                              {isUpcoming 
                                ? `${format(startTime, 'MMM d, h:mm a')} (${formatDistanceToNow(startTime, { addSuffix: true })})`
                                : format(startTime, 'MMM d, h:mm a')
                              }
                            </time>
                          </div>
                          
                          {/* Action hint */}
                          <div className="mt-4 flex items-center justify-end">
                            <span className="text-xs font-medium text-indigo-600 group-hover:underline">
                              {isActive 
                                ? 'Join meeting →' 
                                : isUpcoming 
                                  ? 'View details →' 
                                  : 'View summary →'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
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
        </div>
      </main>
    </div>
  )
}

function MeetingStats({ stats }: { stats: any }) {
  return (
    <div className="mt-8">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow ring-1 ring-black ring-opacity-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Meetings</dt>
          <dd className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline text-2xl font-semibold text-gray-900">
              {stats.total}
            </div>
            <div className="bg-gray-100 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800">
              All
            </div>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow ring-1 ring-black ring-opacity-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Meetings</dt>
          <dd className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline text-2xl font-semibold text-gray-900">
              {stats.active}
            </div>
            <div className="bg-green-100 rounded-full px-2.5 py-0.5 text-xs font-medium text-green-800">
              Live
            </div>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow ring-1 ring-black ring-opacity-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Scheduled Meetings</dt>
          <dd className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline text-2xl font-semibold text-gray-900">
              {stats.scheduled}
            </div>
            <div className="bg-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Upcoming
            </div>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow ring-1 ring-black ring-opacity-5 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Completed Meetings</dt>
          <dd className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline text-2xl font-semibold text-gray-900">
              {stats.ended}
            </div>
            <div className="bg-gray-100 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Past
            </div>
          </dd>
        </div>
      </dl>
    </div>
  )
} 