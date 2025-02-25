'use client';

export default function TeamSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-xl font-bold leading-7 text-gray-900">Team Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your team members and permissions
        </p>
      </div>

      {/* Team Members */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Team Members
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Invite new members to your team and manage existing members.</p>
          </div>
          
          <div className="mt-5">
            <p className="text-sm text-gray-500 italic">
              Team management functionality coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Roles & Permissions
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configure access levels and permissions for team members.</p>
          </div>
          
          <div className="mt-5">
            <p className="text-sm text-gray-500 italic">
              Role management functionality coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 