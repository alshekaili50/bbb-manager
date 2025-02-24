import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/auth/ProfileForm'

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Update your profile information
              </p>
            </div>
            <ProfileForm user={session.user} />
          </div>
        </div>
      </div>
    </div>
  )
} 