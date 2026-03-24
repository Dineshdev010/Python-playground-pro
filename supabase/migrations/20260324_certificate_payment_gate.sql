ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS certificate_fee_paid boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS certificate_fee_amount integer NOT NULL DEFAULT 499,
ADD COLUMN IF NOT EXISTS certificate_payment_verified_at timestamptz NULL;
