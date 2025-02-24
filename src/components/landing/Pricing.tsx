'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/signup?plan=starter',
    price: { monthly: '$49' },
    description: 'Perfect for small classes and individual teachers.',
    features: [
      'Up to 50 concurrent users',
      '1 BBB server',
      'Basic analytics',
      'Email support',
      'SSL encryption',
      'Automated backups',
    ],
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth/signup?plan=professional',
    price: { monthly: '$99' },
    description: 'Ideal for schools and educational institutions.',
    features: [
      'Up to 200 concurrent users',
      'Up to 3 BBB servers',
      'Advanced analytics',
      'Priority support',
      'Custom domain',
      'API access',
      'Recording storage',
    ],
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/auth/signup?plan=enterprise',
    price: { monthly: 'Custom' },
    description: 'For large organizations with custom needs.',
    features: [
      'Unlimited concurrent users',
      'Unlimited BBB servers',
      'Custom analytics',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom features',
    ],
  },
]

export function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start small and scale as you grow. All plans include automatic updates and maintenance.
        </p>
        <div className="mt-16 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price.monthly}</span>
                    {tier.price.monthly !== 'Custom' && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={tier.href}
                  className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 