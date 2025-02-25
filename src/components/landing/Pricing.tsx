'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/signup?plan=starter',
    price: { monthly: '$49', annual: '$39' },
    description: 'Perfect for small classes and individual teachers.',
    features: [
      'Up to 50 concurrent users',
      '1 BBB server',
      'Basic analytics',
      'Email support',
      'SSL encryption',
      'Automated backups',
    ],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/auth/signup?plan=professional',
    price: { monthly: '$99', annual: '$79' },
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
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/auth/signup?plan=enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
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
    mostPopular: false,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  
  return (
    <div id="pricing" className="relative bg-white py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-600 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
              Pricing
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start small and scale as you grow. All plans include automatic updates and maintenance.
            </p>
          </motion.div>
        </div>
        
        {/* Billing toggle */}
        <div className="mt-16 flex justify-center">
          <div className="relative flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              className={`${
                !annual ? 'bg-white shadow-sm' : 'text-gray-500'
              } relative w-32 rounded-full py-2 text-sm font-medium transition-all duration-200 focus:outline-none`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${
                annual ? 'bg-white shadow-sm' : 'text-gray-500'
              } relative w-32 rounded-full py-2 text-sm font-medium transition-all duration-200 focus:outline-none`}
              onClick={() => setAnnual(true)}
            >
              Annual <span className="text-indigo-600 font-semibold">(20% off)</span>
            </button>
          </div>
        </div>
        
        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ${
                tier.mostPopular
                  ? 'ring-indigo-600'
                  : 'ring-gray-200'
              } xl:p-10`}
            >
              <div>
                {tier.mostPopular && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {annual ? tier.price.annual : tier.price.monthly}
                  </span>
                  {tier.price.monthly !== 'Custom' && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                  )}
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
                href={tier.href + (annual ? '&billing=annual' : '&billing=monthly')}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                }`}
              >
                {tier.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Feature comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-24 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Compare plans</h3>
            <p className="mt-2 text-base text-gray-500">
              Detailed feature comparison to help you choose the right plan for your needs.
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-10">
                    Feature
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Starter
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Professional
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'Concurrent users', starter: '50', professional: '200', enterprise: 'Unlimited' },
                  { name: 'BBB servers', starter: '1', professional: 'Up to 3', enterprise: 'Unlimited' },
                  { name: 'Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
                  { name: 'Support', starter: 'Email', professional: 'Priority', enterprise: '24/7 phone' },
                  { name: 'Custom domain', starter: '❌', professional: '✅', enterprise: '✅' },
                  { name: 'API access', starter: '❌', professional: '✅', enterprise: '✅' },
                  { name: 'Recording storage', starter: '❌', professional: '✅', enterprise: '✅' },
                  { name: 'SLA guarantee', starter: '❌', professional: '❌', enterprise: '✅' },
                  { name: 'Dedicated account manager', starter: '❌', professional: '❌', enterprise: '✅' },
                ].map((feature) => (
                  <tr key={feature.name}>
                    <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-10">{feature.name}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{feature.starter}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{feature.professional}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-24 max-w-4xl divide-y divide-gray-900/10"
        >
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {[
              {
                question: 'Can I switch plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'We offer a 14-day free trial for all plans. No credit card required to start.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
              },
              {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.'
              },
            ].map((faq, index) => (
              <div key={index} className="pt-6">
                <dt>
                  <h3 className="text-base font-semibold leading-7 text-gray-900">{faq.question}</h3>
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  )
} 