'use client';

import { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const settingsNavItems = [
  { name: 'Account', href: '/settings/account' },
  { name: 'Billing', href: '/settings/billing' },
  { name: 'Team', href: '/settings/team' },
  { name: 'API Keys', href: '/settings/api-keys' },
]

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and application settings
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-8">
        <nav className="w-full sm:w-64 flex-none" aria-label="Settings navigation">
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
            {settingsNavItems.map((item) => (
              <SettingsNavItem key={item.name} {...item} />
            ))}
          </ul>
        </nav>
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

function SettingsNavItem({ name, href }: { name: string; href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)
  
  return (
    <li className="w-full">
      <Link
        href={href}
        className={`block w-full px-4 py-3 text-sm font-medium ${
          isActive 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {name}
      </Link>
    </li>
  )
} 