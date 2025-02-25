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
    <div id="features" className="relative bg-white py-24 sm:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
              Powerful Features
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to run BigBlueButton
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Focus on teaching, not server management. We handle all the technical details so you can focus on what matters most.
            </p>
          </motion.div>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        
        {/* Feature highlight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-32 sm:mt-40 lg:mt-48"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="relative">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      Intelligent Auto-Scaling
                    </h3>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Our platform automatically scales your BigBlueButton servers based on demand, ensuring optimal performance while minimizing costs.
                    </p>
                    <div className="mt-10 space-y-4">
                      {[
                        'Scale up during peak hours, scale down during quiet periods',
                        'Predictive scaling based on historical usage patterns',
                        'Instant capacity for unexpected demand spikes',
                        'Detailed cost analytics and optimization recommendations',
                      ].map((item) => (
                        <div key={item} className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-3 text-base text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl bg-indigo-500 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 mix-blend-multiply"></div>
                    <div className="relative">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <ServerIcon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Save up to 70% on infrastructure costs</h3>
                      <p className="mt-2 text-sm text-indigo-100">
                        Our customers typically save between 50-70% on their infrastructure costs compared to running BigBlueButton servers 24/7.
                      </p>
                      <div className="mt-8 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between text-white">
                          <span>Average monthly savings:</span>
                          <span className="text-xl font-bold">$1,240</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-white/20">
                          <div className="h-2 w-[70%] rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 