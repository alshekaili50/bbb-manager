import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia', // Use the latest Stripe API version
  typescript: true,
});

// Define subscription plan IDs
// These should match your products/prices created in the Stripe dashboard
export const STRIPE_PLANS = {
  STARTER: {
    name: 'Starter',
    priceMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
    priceYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly',
    features: [
      'Up to 10 meetings per month',
      '20 attendees per meeting',
      '1 hour meeting duration',
      'Basic BBB features',
    ],
  },
  PROFESSIONAL: {
    name: 'Professional',
    priceMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY || 'price_professional_monthly',
    priceYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_YEARLY || 'price_professional_yearly',
    features: [
      'Unlimited meetings',
      '50 attendees per meeting',
      '3 hour meeting duration',
      'Recording capability',
      'Custom branding',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
    priceYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
    features: [
      'Unlimited meetings',
      '100+ attendees per meeting',
      'Unlimited meeting duration',
      'Advanced recording options',
      'Priority support',
      'API access',
    ],
  },
};

// Helper function to get a plan by ID
export function getPlanById(planId: string) {
  const plans = Object.values(STRIPE_PLANS);
  return plans.find((plan) => 
    plan.priceMonthly === planId || 
    plan.priceYearly === planId
  );
} 