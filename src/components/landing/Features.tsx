'use client'

import { motion } from 'framer-motion'
import { 
  CloudArrowUpIcon, 
  LockClosedIcon, 
  ServerIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Easy Deployment',
    description: 'Deploy your BBB server with just a few clicks. No technical expertise required.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Secure by Default',
    description: 'Enterprise-grade security with SSL encryption and access controls built-in.',
    icon: LockClosedIcon,
  },
  {
    name: 'Auto-scaling',
    description: 'Automatically scale your servers based on demand. Pay only for what you use.',
    icon: ServerIcon,
  },
  {
    name: 'Analytics',
    description: 'Detailed analytics and reporting for all your virtual classrooms and meetings.',
    icon: ChartBarIcon,
  },
  {
    name: '24/7 Availability',
    description: 'Your servers are always available with our high-availability infrastructure.',
    icon: ClockIcon,
  },
  {
    name: 'Cost Effective',
    description: 'Save up to 70% compared to traditional video conferencing solutions.',
    icon: CurrencyDollarIcon,
  },
]

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run BBB
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Focus on teaching, not server management. We handle all the technical details so you can focus on what matters most.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 