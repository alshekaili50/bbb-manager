import { stripe } from '@/lib/stripe/config';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper to get the user's subscription
async function getUserSubscription(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    throw error;
  }
  
  return subscription;
}

// Cancel a subscription
export async function DELETE(req: NextRequest) {
  try {
    // Get the user from the session
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to cancel a subscription' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get the subscription
    const subscription = await getUserSubscription(userId);
    
    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    // Cancel the subscription at the end of the billing period
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    );
    
    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: canceledSubscription.cancel_at 
        ? new Date(canceledSubscription.cancel_at * 1000) 
        : null,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Reactivate a canceled subscription
export async function PATCH(req: NextRequest) {
  try {
    // Get the user from the session
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to reactivate a subscription' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Get the subscription
    const subscription = await getUserSubscription(userId);
    
    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    // Reactivate the subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: false }
    );
    
    return NextResponse.json({
      message: 'Subscription reactivated successfully',
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 