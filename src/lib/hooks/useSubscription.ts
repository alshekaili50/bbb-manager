import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | null;

export type PlanType = 'starter' | 'professional' | 'enterprise' | 'free';

export type Subscription = {
  id: string;
  status: SubscriptionStatus;
  planType: PlanType;
  currentPeriodEnd: string;
  cancelAt: string | null;
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubscription(null);
          return;
        }
        
        // Get the user's active subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
          throw error;
        }
        
        if (data) {
          setSubscription({
            id: data.id,
            status: data.status as SubscriptionStatus,
            planType: (data.plan_type || 'free') as PlanType,
            currentPeriodEnd: data.current_period_end,
            cancelAt: data.cancel_at,
          });
        } else {
          // No active subscription, user is on free plan
          setSubscription({
            id: 'free',
            status: 'active',
            planType: 'free',
            currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year from now
            cancelAt: null,
          });
        }
      } catch (err: any) {
        console.error('Error fetching subscription:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
    
    // Subscribe to changes
    const subscriptionListener = supabase
      .channel('subscription-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'subscriptions' 
      }, () => {
        fetchSubscription();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscriptionListener);
    };
  }, [supabase]);
  
  // Check if the user can perform certain actions based on their plan
  const canCreateMeeting = (subscription?.planType !== 'free');
  const canRecordMeeting = ['professional', 'enterprise'].includes(subscription?.planType || '');
  const canUseCustomBranding = ['professional', 'enterprise'].includes(subscription?.planType || '');
  const canAccessApi = subscription?.planType === 'enterprise';
  
  // Get the plan limits
  const getPlanLimits = async () => {
    if (!subscription) return null;
    
    const { data, error } = await supabase
      .from('plan_limits')
      .select('*')
      .eq('plan_type', subscription.planType)
      .single();
      
    if (error) {
      console.error('Error fetching plan limits:', error);
      return null;
    }
    
    return data;
  };
  
  return {
    subscription,
    loading,
    error,
    canCreateMeeting,
    canRecordMeeting,
    canUseCustomBranding,
    canAccessApi,
    getPlanLimits
  };
} 