'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.rpc('delete_user')

      if (error) {
        throw error
      }

      await supabase.auth.signOut()
      router.push('/auth/login?message=Account deleted successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete account')
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Account</h3>
        <p className="mt-1 text-sm text-gray-600">
          Once you delete your account, there is no going back. Please be certain.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete account
        </button>
      ) : (
        <div className="bg-red-50 p-4 rounded-md space-y-4">
          <p className="text-sm text-red-700">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 