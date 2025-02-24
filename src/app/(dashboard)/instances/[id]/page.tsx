import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { EC2Service } from '@/lib/aws/ec2-service'

async function getInstance(id: string) {
  const { data: instance, error } = await supabase
    .from('instances')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !instance) {
    return null
  }

  return instance
}

async function getInstanceStatus(ec2InstanceId: string) {
  const ec2Service = EC2Service.getInstance()
  return await ec2Service.getInstanceStatus(ec2InstanceId)
}

export default async function InstanceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const instance = await getInstance(params.id)

  if (!instance) {
    notFound()
  }

  const ec2Status = await getInstanceStatus(instance.ec2_instance_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {instance.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Instance details and management
          </p>
        </div>
        <Link
          href="/instances"
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Back to instances
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Instance Information
            </h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
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
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Instance Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{instance.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="mt-1 text-sm text-gray-900">{instance.region}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Cost per Hour</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${instance.cost_per_hour.toFixed(3)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Active</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(instance.last_active).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              EC2 Instance Details
            </h3>
            {ec2Status ? (
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Instance ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {ec2Status.InstanceId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ec2Status.State?.Name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Launch Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ec2Status.LaunchTime?.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Public IP Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {ec2Status.PublicIpAddress || 'None'}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Unable to fetch EC2 instance details
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Instance Management
          </h3>
          <div className="mt-4 flex space-x-4">
            <form action={`/api/instances/${instance.id}/start`}>
              <button
                type="submit"
                disabled={instance.status === 'running'}
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Instance
              </button>
            </form>
            <form action={`/api/instances/${instance.id}/stop`}>
              <button
                type="submit"
                disabled={instance.status !== 'running'}
                className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stop Instance
              </button>
            </form>
            <form action={`/api/instances/${instance.id}/terminate`}>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Terminate Instance
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 