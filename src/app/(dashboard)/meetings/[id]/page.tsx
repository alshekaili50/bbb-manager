import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { format, formatDistance, differenceInMinutes, isAfter, isBefore } from 'date-fns'

// Get meeting details by ID
async function getMeeting(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: meeting, error } = await supabase
    .from('meetings')
    .select(`
      *,
      instances(id, name, ec2_instance_id, status, public_ip)
    `)
    .eq('id', id)
    .single()

  if (error || !meeting) {
    return null
  }

  return meeting
}

// Get user by ID
async function getUser(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: user, error } = await supabase
    .from('users')
    .select('name, email, avatar_url')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}

// Get meeting attendees
async function getAttendees(meetingId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: attendees, error } = await supabase
    .from('attendees')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('joined_at', { ascending: false })

  if (error) {
    console.error('Error fetching attendees:', error)
    return []
  }

  return attendees || []
}

// Get meeting recordings
async function getRecordings(meetingId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: recordings, error } = await supabase
    .from('recordings')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recordings:', error)
    return []
  }

  return recordings || []
}

export default async function MeetingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Get meeting data
  const meeting = await getMeeting(params.id)
  
  if (!meeting) {
    notFound()
  }
  
  // Get creator data
  const creator = await getUser(meeting.creator_id)

  // Get attendees and recordings if the meeting is active or ended
  const [attendees, recordings] = await Promise.all([
    getAttendees(meeting.id),
    meeting.recording_enabled ? getRecordings(meeting.id) : []
  ])

  // Calculate meeting status
  const now = new Date()
  const startTime = new Date(meeting.start_time)
  const scheduledEndTime = new Date(meeting.scheduled_end_time)
  const endTime = meeting.end_time ? new Date(meeting.end_time) : null
  
  let statusText = meeting.status
  let statusColor = {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: '⏱️'
  }

  if (meeting.status === 'scheduled' && startTime <= now) {
    statusText = 'ready to start'
    statusColor = {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: '🔔'
    }
  } else if (meeting.status === 'active') {
    statusColor = {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: '🟢'
    }
    if (scheduledEndTime <= now) {
      statusText = 'overtime'
      statusColor = {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: '⚠️'
      }
    }
  } else if (meeting.status === 'scheduled') {
    statusColor = {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: '📅'
    }
  } else if (meeting.status === 'ended') {
    statusColor = {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: '✓'
    }
  }

  // Calculate join link
  const joinLink = meeting.instances?.public_ip 
    ? `https://${meeting.instances.public_ip}/bigbluebutton/api/join?meetingID=${meeting.id}`
    : null

  // Calculate remaining time or elapsed time
  let timeInfo = ''
  if (meeting.status === 'scheduled') {
    timeInfo = `Starts ${formatDistance(startTime, now, { addSuffix: true })}`
  } else if (meeting.status === 'active') {
    if (scheduledEndTime > now) {
      timeInfo = `Ends in ${formatDistance(scheduledEndTime, now)}`
    } else {
      timeInfo = `Overtime by ${formatDistance(now, scheduledEndTime)}`
    }
  } else if (meeting.status === 'ended' && endTime) {
    timeInfo = `Ended ${formatDistance(endTime, now, { addSuffix: true })}`
  }

  // Calculate meeting duration
  const durationMinutes = endTime 
    ? differenceInMinutes(endTime, startTime) 
    : differenceInMinutes(scheduledEndTime, startTime)

  // Calculate progress percentage for active meetings
  const progressPercentage = meeting.status === 'active' 
    ? Math.min(100, Math.round((now.getTime() - startTime.getTime()) / (scheduledEndTime.getTime() - startTime.getTime()) * 100))
    : meeting.status === 'ended' ? 100 : 0

  // Determine if meeting can be started/ended
  const canStart = meeting.status === 'scheduled' && startTime <= now
  const canEnd = meeting.status === 'active'
  const canJoin = meeting.status === 'active' && joinLink
  const canExtend = meeting.status === 'active' && isAfter(scheduledEndTime, now) && differenceInMinutes(scheduledEndTime, now) < 30

  return (
    <div className="space-y-8">
      {/* Header with breadcrumb and actions */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/meetings" className="ml-2 text-sm text-gray-500 hover:text-gray-700">
                      Meetings
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-900" aria-current="page">
                      {meeting.title}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              {meeting.title}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                <span className="mr-1">{statusColor.icon}</span> {statusText}
              </span>
              {timeInfo && (
                <span className="text-sm text-gray-500">
                  {timeInfo}
                </span>
              )}
              
              {meeting.recording_enabled && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Recording enabled
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-shrink-0 gap-2 sm:mt-0 sm:ml-4">
            <Link
              href="/meetings"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Back to meetings
            </Link>
            
            {canJoin && (
              <a
                href={joinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Join meeting
              </a>
            )}
            
            {canStart && (
              <form action={`/api/meetings/${meeting.id}/start`} method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start meeting
                </button>
              </form>
            )}
            
            {canEnd && (
              <form action={`/api/meetings/${meeting.id}/end`} method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  End meeting
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column with meeting and instance info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meeting status card with progress */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md ${statusColor.bg} p-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${statusColor.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Meeting Status
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{statusText.charAt(0).toUpperCase() + statusText.slice(1)}</div>
                    </dd>
                  </dl>
                </div>
                
                {meeting.status === 'active' && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                    {progressPercentage}%
                  </div>
                )}
              </div>
              
              {meeting.status === 'active' && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${progressPercentage}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          scheduledEndTime <= now ? 'bg-orange-500' : 'bg-indigo-500'
                        }`}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>{format(startTime, 'h:mm a')}</span>
                      <span>{format(scheduledEndTime, 'h:mm a')}</span>
                    </div>
                  </div>
                  
                  {canExtend && (
                    <form action={`/api/meetings/${meeting.id}/extend`} method="POST" className="mt-4 flex justify-end">
                      <input type="hidden" name="extend_minutes" value="30" />
                      <button
                        type="submit"
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Extend by 30 min
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <div className="text-sm">
                <Link href={`/instances/${meeting.instances.id}`} className="font-medium text-indigo-700 hover:text-indigo-600">
                  Running on {meeting.instances.name}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Meeting details */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Meeting Details
              </h3>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(startTime, 'PPpp')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Scheduled End Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {format(scheduledEndTime, 'PPpp')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {durationMinutes} minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Actual End Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {endTime ? format(endTime, 'PPpp') : 'Not ended yet'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recording</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {meeting.recording_enabled ? 'Enabled' : 'Disabled'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Instance</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <Link href={`/instances/${meeting.instances.id}`} className="text-indigo-600 hover:text-indigo-900">
                      {meeting.instances.name}
                    </Link>
                  </dd>
                </div>
                {meeting.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {meeting.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Attendees list */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Attendees
                </h3>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  {attendees.length} total
                </span>
              </div>
            </div>
            <div className="overflow-hidden">
              {attendees.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                  {attendees.map((attendee) => (
                    <li key={attendee.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {attendee.avatar_url ? (
                              <img src={attendee.avatar_url} alt={attendee.name} className="h-10 w-10 rounded-full" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                            <div className="text-sm text-gray-500">{attendee.role || 'Participant'}</div>
                          </div>
                        </div>
                        <div className="flex gap-x-2 text-sm text-gray-500">
                          <div>
                            <span className="font-medium text-gray-900">Joined:</span>{' '}
                            {new Date(attendee.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {attendee.left_at && (
                            <div>
                              <span className="font-medium text-gray-900">Left:</span>{' '}
                              {new Date(attendee.left_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-4 text-center">
                  <p className="text-sm text-gray-500">No attendees yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recordings list */}
          {meeting.recording_enabled && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Recordings
                </h3>
              </div>
              <div className="overflow-hidden">
                {recordings.length > 0 ? (
                  <ul role="list" className="divide-y divide-gray-200">
                    {recordings.map((recording) => (
                      <li key={recording.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {recording.title || `Recording ${format(new Date(recording.created_at), 'MMM d, yyyy')}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {format(new Date(recording.created_at), 'PPpp')} · {recording.duration} minutes
                              </div>
                            </div>
                          </div>
                          <div>
                            <a
                              href={recording.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-4 text-center">
                    <p className="text-sm text-gray-500">
                      {meeting.status === 'ended' 
                        ? 'No recordings available for this meeting' 
                        : 'Recordings will be available after the meeting ends'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column with creator info and actions */}
        <div className="space-y-6">
          {/* Creator info */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Created by
              </h3>
            </div>
            <div className="px-6 py-5 flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                {creator?.avatar_url ? (
                  <img src={creator.avatar_url} alt={creator.name} className="h-12 w-12 rounded-full" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{creator?.name || 'Unknown user'}</div>
                <div className="text-sm text-gray-500">{creator?.email || ''}</div>
              </div>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Meeting Stats
              </h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-6">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                  <dt className="text-sm font-medium text-gray-500">Current Attendees</dt>
                  <dd className="text-xl font-semibold text-indigo-600">
                    {meeting.attendee_count}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                  <dt className="text-sm font-medium text-gray-500">Max Attendees</dt>
                  <dd className="text-xl font-semibold text-indigo-600">
                    {meeting.max_attendee_count || 0}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                  <dt className="text-sm font-medium text-gray-500">Total Unique Attendees</dt>
                  <dd className="text-xl font-semibold text-indigo-600">
                    {attendees.length}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm font-medium text-gray-500">Recordings</dt>
                  <dd className="text-xl font-semibold text-indigo-600">
                    {recordings.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Actions */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Actions
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {canJoin && (
                <a
                  href={joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Join meeting
                </a>
              )}
              
              {canStart && (
                <form action={`/api/meetings/${meeting.id}/start`} method="POST">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start meeting
                  </button>
                </form>
              )}
              
              {canEnd && (
                <form action={`/api/meetings/${meeting.id}/end`} method="POST">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    End meeting
                  </button>
                </form>
              )}
              
              <Link
                href={`/meetings/${meeting.id}/edit`}
                className="block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Edit meeting
              </Link>
              
              <form action={`/api/meetings/${meeting.id}`} method="DELETE" onSubmit="return confirm('Are you sure you want to delete this meeting?');">
                <button
                  type="submit"
                  className="block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Delete meeting
                </button>
              </form>
            </div>
          </div>
          
          {/* Share meeting */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Share Meeting
              </h3>
            </div>
            <div className="p-6">
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <input
                    type="text"
                    name="share-link"
                    id="share-link"
                    className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Share link"
                    readOnly
                    value={joinLink || 'Meeting not started yet'}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (joinLink) {
                      navigator.clipboard.writeText(joinLink);
                    }
                  }}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
              </div>
              
              <div className="mt-4 flex justify-around">
                <button
                  type="button"
                  onClick={() => {
                    if (joinLink) {
                      window.open(`mailto:?subject=${encodeURIComponent(meeting.title)}&body=${encodeURIComponent(`Join my meeting: ${joinLink}`)}`, '_blank');
                    }
                  }}
                  disabled={!joinLink}
                  className="inline-flex items-center text-gray-700 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (joinLink) {
                      window.open(`https://slack.com/app_redirect?app=launcher&url=${encodeURIComponent(joinLink)}`, '_blank');
                    }
                  }}
                  disabled={!joinLink}
                  className="inline-flex items-center text-gray-700 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                  </svg>
                  Slack
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (joinLink) {
                      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.title)}&dates=${startTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${scheduledEndTime.toISOString().replace(/-|:|\.\d\d\d/g, '')}&details=${encodeURIComponent(`Join link: ${joinLink}`)}`, '_blank');
                    }
                  }}
                  disabled={!joinLink}
                  className="inline-flex items-center text-gray-700 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 