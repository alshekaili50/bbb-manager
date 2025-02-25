-- Create a customers table to store Stripe customer information
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data" 
    ON public.customers FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own customer data" 
    ON public.customers FOR UPDATE 
    USING (auth.uid() = id);

-- Create subscriptions table to store active subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    status TEXT,
    plan_type TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- Create RLS policies for subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" 
    ON public.subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add plan_limits table to store the limits for each plan tier
CREATE TABLE IF NOT EXISTS public.plan_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_type TEXT UNIQUE NOT NULL,
    max_meetings_per_month INTEGER NOT NULL,
    max_attendees_per_meeting INTEGER NOT NULL,
    max_meeting_duration_minutes INTEGER NOT NULL,
    recording_enabled BOOLEAN NOT NULL DEFAULT false,
    custom_branding_enabled BOOLEAN NOT NULL DEFAULT false,
    api_access_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default plan limits
INSERT INTO public.plan_limits (plan_type, max_meetings_per_month, max_attendees_per_meeting, max_meeting_duration_minutes, recording_enabled, custom_branding_enabled, api_access_enabled)
VALUES 
    ('starter', 10, 20, 60, false, false, false),
    ('professional', 999999, 50, 180, true, true, false),
    ('enterprise', 999999, 100, 999999, true, true, true)
ON CONFLICT (plan_type) DO UPDATE
SET 
    max_meetings_per_month = EXCLUDED.max_meetings_per_month,
    max_attendees_per_meeting = EXCLUDED.max_attendees_per_meeting,
    max_meeting_duration_minutes = EXCLUDED.max_meeting_duration_minutes,
    recording_enabled = EXCLUDED.recording_enabled,
    custom_branding_enabled = EXCLUDED.custom_branding_enabled,
    api_access_enabled = EXCLUDED.api_access_enabled,
    updated_at = now();

-- Create RLS policies for plan_limits table
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plan limits" 
    ON public.plan_limits FOR SELECT 
    USING (true);

-- Add trigger for plan_limits updated_at
CREATE TRIGGER update_plan_limits_updated_at
    BEFORE UPDATE ON public.plan_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 