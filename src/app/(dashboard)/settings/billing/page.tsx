'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { redirectToCheckout } from '@/lib/stripe/client';
import { STRIPE_PLANS } from '@/lib/stripe/config';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

export default function BillingPage() {
  const [loading, setLoading] = useState<{
    cancel: boolean;
    upgrade: boolean;
    portal: boolean;
  }>({
    cancel: false,
    upgrade: false,
    portal: false,
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const supabase = createClientComponentClient();

  const cancelSubscription = async () => {
    try {
      setLoading({ ...loading, cancel: true });
      const response = await fetch('/api/stripe/subscription', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      router.refresh();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      setError(error.message);
    } finally {
      setLoading({ ...loading, cancel: false });
    }
  };

  const openBillingPortal = async () => {
    try {
      setLoading({ ...loading, portal: true });
      setError(null);
      
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      
      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      window.location.href = url;
    } catch (error: any) {
      console.error('Error opening billing portal:', error);
      setError(error.message);
    } finally {
      setLoading({ ...loading, portal: false });
    }
  };

  const handleUpgrade = async (priceId: string, billingInterval: 'month' | 'year') => {
    try {
      setLoading({ ...loading, upgrade: true });
      setError(null);
      await redirectToCheckout(priceId, billingInterval);
    } catch (error: any) {
      console.error('Error upgrading:', error);
      setError(error.message);
    } finally {
      setLoading({ ...loading, upgrade: false });
    }
  };

  const getBillingText = () => {
    if (!subscription) return 'No billing information available';
    
    if (subscription.planType === 'free') {
      return 'You are currently on the Free plan';
    }
    
    const planName = Object.entries(STRIPE_PLANS).find(
      ([_, plan]) => plan.name.toLowerCase() === subscription.planType
    )?.[1]?.name || subscription.planType;
    
    return `You are currently on the ${planName} plan`;
  };

  const getRenewalText = () => {
    if (!subscription || subscription.planType === 'free') return null;
    
    const periodEnd = new Date(subscription.currentPeriodEnd);
    
    if (subscription.cancelAt) {
      return `Your subscription will end on ${format(periodEnd, 'MMMM d, yyyy')}`;
    }
    
    return `Your subscription will renew on ${format(periodEnd, 'MMMM d, yyyy')}`;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900">Billing & Subscription</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current subscription */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Current Subscription
          </h3>
          
          {subscriptionLoading ? (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading subscription information...
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{getBillingText()}</span>
              </p>
              
              {getRenewalText() && (
                <p className="text-sm text-gray-500">
                  {getRenewalText()}
                </p>
              )}
              
              <div className="mt-4 flex flex-col sm:flex-row sm:gap-3">
                {subscription?.planType !== 'enterprise' && (
                  <button
                    type="button"
                    onClick={() => handleUpgrade(
                      STRIPE_PLANS.ENTERPRISE.priceMonthly,
                      'month'
                    )}
                    disabled={loading.upgrade}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.upgrade ? 'Upgrading...' : 'Upgrade to Enterprise'}
                  </button>
                )}
                
                {subscription?.planType !== 'free' && (
                  <>
                    <button
                      type="button"
                      onClick={openBillingPortal}
                      disabled={loading.portal}
                      className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading.portal ? 'Opening portal...' : 'Manage billing'}
                    </button>
                    
                    {subscription && !subscription.cancelAt && (
                      <button
                        type="button"
                        onClick={cancelSubscription}
                        disabled={loading.cancel}
                        className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading.cancel ? 'Cancelling...' : 'Cancel subscription'}
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {error && (
                <div className="mt-2 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Upgrade options */}
      {subscription?.planType === 'free' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Upgrade Your Plan
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Upgrade to get more features and capabilities</p>
            </div>
            <div className="mt-5">
              <Link
                href="/pricing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View pricing plans
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Billing history */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Billing History
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>View and download your invoices</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={openBillingPortal}
              disabled={loading.portal || subscription?.planType === 'free'}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.portal ? 'Opening portal...' : 'View invoices'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 