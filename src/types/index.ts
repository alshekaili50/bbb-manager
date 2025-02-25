export type Organization = {
  id: string
  name: string
  subscriptionStatus: 'active' | 'inactive' | 'trial'
  createdAt: Date
  updatedAt: Date
}

export type User = {
  id: string
  email: string
  organizationId: string
  role: 'admin' | 'user'
  name: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type Instance = {
  id: string
  ec2InstanceId: string
  status: 'running' | 'stopped' | 'terminated'
  organizationId: string
  name: string
  region: string
  type: string
  lastActive: Date
  costPerHour: number
  createdAt: Date
  updatedAt: Date
}

export type InstanceSchedule = {
  id: string
  instanceId: string
  action: 'start' | 'stop'
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'once'
  dayOfWeek: number | null
  dayOfMonth: number | null
  time: string
  enabled: boolean
  createdAt: Date
  updatedAt: Date
  nextRun: Date
  timezone: string
}

export type Meeting = {
  id: string
  title: string
  instanceId: string
  organizationId: string
  creatorId: string
  status: 'scheduled' | 'active' | 'ended'
  startTime: Date
  endTime: Date | null
  attendeeCount: number
  recordingEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export type UsageLog = {
  id: string
  instanceId: string
  organizationId: string
  meetingId: string
  startTime: Date
  endTime: Date | null
  cost: number
  createdAt: Date
  updatedAt: Date
} 