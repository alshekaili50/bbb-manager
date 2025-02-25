import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Function to redirect to Stripe Checkout
export async function redirectToCheckout(priceId: string, billingInterval: 'month' | 'year') {
  try {
    // Create a checkout session on the server
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        billingInterval,
      }),
    });

    const { sessionId, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

    if (stripeError) {
      throw new Error(stripeError.message);
    }
  } catch (error: any) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
} 