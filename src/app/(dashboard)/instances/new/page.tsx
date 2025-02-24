import { type Metadata } from 'next'
import Link from 'next/link'
import CreateInstanceForm from '@/components/forms/CreateInstanceForm'

export const metadata: Metadata = {
  title: 'Create Instance - BBB Manager',
  description: 'Create a new BigBlueButton instance',
}

export default function CreateInstancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Instance</h1>
        <Link
          href="/instances"
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
          aria-label="Back to instances"
        >
          Back to instances
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <CreateInstanceForm />
        </div>
      </div>
    </div>
  )
} 