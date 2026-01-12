-- Create the 'profiles' table in the public schema
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text NOT NULL CHECK (role IN ('influencer', 'client')),
    bio text,
    contact_email text,
    phone text,
    address text,
    booking_url text,
    avatar_url text,
    category text,
    location text,
    followers_count bigint,
    start_price numeric(10, 2),
    platform text,
    platform_label text,
    platform_color_class text,
    social_link text,
    is_verified boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL
);

-- Set up Row Level Security (RLS) for the 'profiles' table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create the 'inquiries' table in the public schema
CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    brand_name text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'responded', 'archived'))
);

-- Set up Row Level Security (RLS) for the 'inquiries' table
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can send inquiries."
ON public.inquiries FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their own sent or received inquiries."
ON public.inquiries FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = creator_id);

CREATE POLICY "Creators can update the status of received inquiries."
ON public.inquiries FOR UPDATE
USING (auth.uid() = creator_id);

-- Create a function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger for the 'profiles' table to update 'updated_at'
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();