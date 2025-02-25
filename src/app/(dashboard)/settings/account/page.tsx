'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-xl font-bold leading-7 text-gray-900">Account Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal account settings
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Personal Information
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your personal information and email address.</p>
          </div>
          
          {/* Form will be implemented later */}
          <div className="mt-5">
            <p className="text-sm text-gray-500 italic">
              Account settings functionality coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Security
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your password and manage security settings.</p>
          </div>
          
          {/* Password change will be implemented later */}
          <div className="mt-5">
            <p className="text-sm text-gray-500 italic">
              Security settings functionality coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Delete Account
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Once you delete your account, all of your data will be permanently removed.
              This action cannot be undone.
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 