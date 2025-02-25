import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe/config';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Supabase with admin rights for webhook processing
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Extract subscription data to store in our database
const upsertSubscriptionRecord = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  
  // Get the customer to find our user
  const { data: customerData } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
    
  if (!customerData?.id) {
    console.error('Customer not found:', customerId);
    return;
  }

  const userId = customerData.id;

  // Format the data for our database
  const subscriptionData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0].price.id,
    status: subscription.status,
    plan_type: subscription.items.data[0].price.nickname?.toLowerCase() || 'unknown',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
  };

  // Insert or update subscription in our database
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      ...subscriptionData,
      // Update these fields if the record already exists
      ...(subscription.status === 'canceled' ? { status: 'canceled' } : {})
    }, {
      onConflict: 'stripe_subscription_id'
    });

  if (error) {
    console.error('Error upserting subscription:', error);
  }
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscriptionRecord(subscription);
        break;
        
      case 'checkout.session.completed':
        // You could handle initial checkout completion here if needed
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 