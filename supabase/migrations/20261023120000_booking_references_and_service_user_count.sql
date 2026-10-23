-- Booking references are globally unique and stay in the required XZ-123456 format.
create unique index if not exists bookings_booking_number_unique
  on public.bookings (booking_number)
  where booking_number is not null;

-- Store only a SHA-256 hash of each unique WhatsApp user number for counting.
-- The registry begins at rollout; configured test numbers are excluded by webhook.
create table if not exists public.garikai_service_users (
  phone_hash text primary key check (phone_hash ~ '^[0-9a-f]{64}$'),
  first_seen_at timestamptz not null default now()
);
alter table public.garikai_service_users enable row level security;
revoke all on public.garikai_service_users from anon, authenticated;
