'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { redirectToCheckout } from '@/lib/stripe/client';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const supabase = createClientComponentClient();

  // Define the pricing tiers with Stripe price IDs
  const tiers = [
    {
      name: 'Starter',
      id: 'starter',
      priceId: annual ? STRIPE_PLANS.STARTER.priceYearly : STRIPE_PLANS.STARTER.priceMonthly,
      price: { monthly: '$49', annual: '$39' },
      description: 'Perfect for small classes and individual teachers.',
      features: STRIPE_PLANS.STARTER.features,
      mostPopular: false,
    },
    {
      name: 'Professional',
      id: 'professional',
      priceId: annual ? STRIPE_PLANS.PROFESSIONAL.priceYearly : STRIPE_PLANS.PROFESSIONAL.priceMonthly,
      price: { monthly: '$99', annual: '$79' },
      description: 'Ideal for schools and educational institutions.',
      features: STRIPE_PLANS.PROFESSIONAL.features,
      mostPopular: true,
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      priceId: annual ? STRIPE_PLANS.ENTERPRISE.priceYearly : STRIPE_PLANS.ENTERPRISE.priceMonthly,
      price: { monthly: '$199', annual: '$159' },
      description: 'For large organizations with extensive needs.',
      features: STRIPE_PLANS.ENTERPRISE.features,
      mostPopular: false,
    },
  ];

  const handlePlanSelection = async (tier: typeof tiers[0]) => {
    try {
      // Check if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to signup with plan preference
        router.push(`/auth/signup?plan=${tier.id}&billing=${annual ? 'annual' : 'monthly'}`);
        return;
      }

      // User is logged in, proceed with checkout
      setLoading(tier.id);
      setError(null);
      await redirectToCheckout(tier.priceId, annual ? 'year' : 'month');
    } catch (err: any) {
      console.error('Error selecting plan:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (tierId: string) => {
    if (!subscription || subscriptionLoading) return false;
    return subscription.planType === tierId;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
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
        
        {/* Display error if any */}
        {error && (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Pricing tiers */}
        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
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
              
              <button
                onClick={() => handlePlanSelection(tier)}
                disabled={loading === tier.id || isCurrentPlan(tier.id)}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isCurrentPlan(tier.id)
                    ? 'bg-green-600 text-white cursor-default'
                    : tier.mostPopular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                } ${loading === tier.id ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading === tier.id
                  ? 'Processing...'
                  : isCurrentPlan(tier.id)
                  ? 'Current Plan'
                  : tier.name === 'Enterprise'
                  ? 'Get started'
                  : 'Subscribe'}
              </button>
            </motion.div>
          ))}
        </div>
        
        {/* Feature comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                  { name: 'Meeting limit', starter: '10/month', professional: 'Unlimited', enterprise: 'Unlimited' },
                  { name: 'Attendees per meeting', starter: '20', professional: '50', enterprise: '100+' },
                  { name: 'Meeting duration', starter: '1 hour', professional: '3 hours', enterprise: 'Unlimited' },
                  { name: 'Recording capability', starter: '❌', professional: '✅', enterprise: '✅' },
                  { name: 'Custom branding', starter: '❌', professional: '✅', enterprise: '✅' },
                  { name: 'API access', starter: '❌', professional: '❌', enterprise: '✅' },
                  { name: 'Priority support', starter: '❌', professional: '✅', enterprise: '✅' },
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
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-24 max-w-4xl divide-y divide-gray-900/10"
        >
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {[
              {
                question: 'Can I switch plans later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
              },
              {
                question: 'How does billing work?',
                answer: 'We offer both monthly and annual billing options. Annual plans come with a 20% discount compared to monthly billing.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 14-day money-back guarantee. If you\'re not satisfied with our service, you can request a refund within 14 days of your initial purchase.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. All payments are processed securely through Stripe.',
              },
              {
                question: 'Can I try before I buy?',
                answer: 'We don't currently offer a free trial, but we do have a free plan with limited features to help you get started.',
              },
            ].map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
} 