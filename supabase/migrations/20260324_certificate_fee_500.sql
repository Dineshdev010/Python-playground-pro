ALTER TABLE public.profiles
ALTER COLUMN certificate_fee_amount SET DEFAULT 500;

UPDATE public.profiles
SET certificate_fee_amount = 500
WHERE certificate_fee_amount IS NULL OR certificate_fee_amount = 499;
