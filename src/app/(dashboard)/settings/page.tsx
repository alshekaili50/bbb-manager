'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Settings Overview
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Manage your account, billing, team, and API settings from this central location.</p>
          </div>
          
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { name: 'Account', href: '/settings/account', description: 'Manage your personal account settings' },
              { name: 'Billing', href: '/settings/billing', description: 'View and manage your subscription and billing' },
              { name: 'Team', href: '/settings/team', description: 'Manage team members and permissions' },
              { name: 'API Keys', href: '/settings/api-keys', description: 'Manage API keys for programmatic access' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-block rounded-md border border-gray-200 p-4 hover:bg-gray-50"
              >
                <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 