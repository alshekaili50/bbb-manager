import { Suspense } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <Link
          href="/instances/new"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-label="Create new instance"
        >
          Create Instance
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Instances</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            <Suspense fallback={<div className="h-9 w-16 animate-pulse rounded bg-gray-200" />}>
              0
            </Suspense>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Instances</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            <Suspense fallback={<div className="h-9 w-16 animate-pulse rounded bg-gray-200" />}>
              0
            </Suspense>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Meetings</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            <Suspense fallback={<div className="h-9 w-16 animate-pulse rounded bg-gray-200" />}>
              0
            </Suspense>
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Monthly Cost</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            <Suspense fallback={<div className="h-9 w-16 animate-pulse rounded bg-gray-200" />}>
              $0
            </Suspense>
          </dd>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Recent Activity</h2>
          <div className="mt-6">
            <Suspense fallback={<div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>}>
              <div className="text-sm text-gray-500">No recent activity</div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
} 