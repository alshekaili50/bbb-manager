import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getInstances() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: instances, error } = await supabase
    .from('instances')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return []
  }

  return instances
}

async function getInstanceStats() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: instances, error } = await supabase
    .from('instances')
    .select('status, cost_per_hour')

  if (error) {
    console.error('Error:', error)
    return {
      total: 0,
      running: 0,
      stopped: 0,
      totalCost: 0
    }
  }

  const stats = {
    total: instances.length,
    running: instances.filter(i => i.status === 'running').length,
    stopped: instances.filter(i => i.status === 'stopped').length,
    totalCost: instances.reduce((acc, curr) => acc + (curr.cost_per_hour || 0), 0)
  }

  return stats
}

export default async function InstancesPage() {
  const {
    data: { session },
  } = await createServerComponentClient({ cookies }).auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const [instances, stats] = await Promise.all([
    getInstances(),
    getInstanceStats()
  ])

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Instances
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <InstanceStats stats={stats} />
          <InstanceList instances={instances} />
        </div>
      </main>
    </div>
  )
}

function InstanceStats({ stats }: { stats: any }) {
  return (
    <div className="mt-8">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Instances</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.total}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Running Instances</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.running}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Stopped Instances</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stats.stopped}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Cost/Hour</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ${stats.totalCost.toFixed(2)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function InstanceList({ instances }: { instances: any[] }) {
  return (
    <div className="mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-base font-semibold leading-6 text-gray-900">All Instances</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your BBB instances including their status and details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/instances/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add instance
          </a>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Cost/Hour
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created At
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instances.map((instance) => (
                  <tr key={instance.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {instance.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        instance.status === 'running' 
                          ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                          : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                      }`}>
                        {instance.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${instance.cost_per_hour}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(instance.created_at).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={`/instances/${instance.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View<span className="sr-only">, {instance.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 