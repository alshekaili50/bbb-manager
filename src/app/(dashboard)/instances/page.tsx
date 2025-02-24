import { Suspense } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { type Instance } from '@/types'

async function getInstances() {
  const { data: instances, error } = await supabase
    .from('instances')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching instances:', error)
    return []
  }

  return instances
}

async function getInstanceStats() {
  const { data: instances, error } = await supabase
    .from('instances')
    .select('status, cost_per_hour')

  if (error) {
    console.error('Error fetching instance stats:', error)
    return {
      total: 0,
      active: 0,
      monthlyCost: 0,
    }
  }

  const total = instances.length
  const active = instances.filter((i) => i.status === 'running').length
  const monthlyCost = instances.reduce((acc, i) => {
    if (i.status === 'running') {
      return acc + (i.cost_per_hour * 24 * 30)
    }
    return acc
  }, 0)

  return {
    total,
    active,
    monthlyCost,
  }
}

const InstanceList = async () => {
  const instances = await getInstances()

  if (instances.length === 0) {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">No instances found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {instances.map((instance) => (
          <li key={instance.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{instance.name}</p>
                    <p className="text-sm text-gray-500">{instance.type} • {instance.region}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      instance.status === 'running'
                        ? 'bg-green-100 text-green-800'
                        : instance.status === 'stopped'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {instance.status}
                  </span>
                  <Link
                    href={`/instances/${instance.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const InstanceStats = async () => {
  const stats = await getInstanceStats()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Total Instances</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {stats.total}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Active Instances</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {stats.active}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">Monthly Cost</dt>
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          ${stats.monthlyCost.toFixed(2)}
        </dd>
      </div>
    </div>
  )
}

export default function InstancesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Instances</h1>
        <Link
          href="/instances/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label="Create new instance"
        >
          Create Instance
        </Link>
      </div>

      <Suspense 
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[104px] animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        }
      >
        <InstanceStats />
      </Suspense>

      <Suspense 
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        }
      >
        <InstanceList />
      </Suspense>
    </div>
  )
} 