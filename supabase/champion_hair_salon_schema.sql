-- Champion Hair Salon - Supabase PostgreSQL schema
-- Safe for a new Supabase project and rerunnable without deleting existing data.
-- IMPORTANT: Replace CHANGE_THIS_ADMIN_PASSWORD before running this script.

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public."AdminUser" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "email" text not null unique,
  "passwordHash" text not null,
  "name" text not null default 'Sachin Mahaley',
  "role" text not null default 'ADMIN',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "AdminUser_role_check" check ("role" in ('ADMIN', 'SUPER_ADMIN'))
);

create table if not exists public."BusinessSettings" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "salonName" text not null default 'CHAMPION HAIR SALON',
  "tagline" text not null default 'Where Tradition Meets Excellence in Men''s Grooming',
  "establishedYear" integer not null default 1998,
  "ownerName" text not null default 'Sachin Mahaley',
  "phone" text not null default '+91 8888857057',
  "altPhone" text default '+91 9158846787',
  "whatsappNumber" text not null default '918888857057',
  "email" text not null default 'info@championhairsalon.com',
  "address" text not null default 'Champion Hair Salon, Main Market, Maharashtra, India',
  "city" text not null default 'Maharashtra',
  "googleMapsEmbedUrl" text default 'https://maps.google.com/maps?q=Champion+Hair+Salon&t=&z=13&ie=UTF8&iwloc=&output=embed',
  "googleReviewUrl" text default 'https://search.google.com/local/writereview?placeid=championhairsalon',
  "instagramUrl" text default 'https://instagram.com/championhairsalon',
  "facebookUrl" text default 'https://facebook.com/championhairsalon',
  "slotInterval" integer not null default 30,
  "advanceNoticeHours" integer not null default 1,
  "maxAdvanceDays" integer not null default 30,
  "cancellationHours" integer not null default 2,
  "currencySymbol" text not null default '₹',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "BusinessSettings_slotInterval_check" check ("slotInterval" between 5 and 240),
  constraint "BusinessSettings_maxAdvanceDays_check" check ("maxAdvanceDays" between 1 and 365)
);

create table if not exists public."BusinessHours" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "dayOfWeek" integer not null unique,
  "dayName" text not null,
  "isOpen" boolean not null default true,
  "openTime" text not null default '09:00',
  "closeTime" text not null default '22:00',
  "hasBreak" boolean not null default false,
  "breakStart" text default '13:30',
  "breakEnd" text default '14:30',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "BusinessHours_dayOfWeek_check" check ("dayOfWeek" between 0 and 6),
  constraint "BusinessHours_openTime_check" check ("openTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  constraint "BusinessHours_closeTime_check" check ("closeTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);

create table if not exists public."Staff" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "name" text not null,
  "role" text not null default 'Master Barber',
  "phone" text,
  "photo" text,
  "bio" text,
  "specialties" text not null default 'Hair Cut, Styling, Shaving, Beard Trimming, Hair Colour',
  "isActive" boolean not null default true,
  "displayOrder" integer not null default 0,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists public."BlockedPeriod" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "staffId" text references public."Staff"("id") on delete cascade on update cascade,
  "title" text not null,
  "startDate" text not null,
  "endDate" text not null,
  "startTime" text,
  "endTime" text,
  "isAllDay" boolean not null default true,
  "reason" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  constraint "BlockedPeriod_startDate_check" check ("startDate" ~ '^\d{4}-\d{2}-\d{2}$'),
  constraint "BlockedPeriod_endDate_check" check ("endDate" ~ '^\d{4}-\d{2}-\d{2}$')
);

create table if not exists public."StaffAvailability" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "staffId" text not null references public."Staff"("id") on delete cascade on update cascade,
  "dayOfWeek" integer not null,
  "isWorking" boolean not null default true,
  "startTime" text not null default '09:00',
  "endTime" text not null default '22:00',
  constraint "StaffAvailability_staff_day_key" unique ("staffId", "dayOfWeek"),
  constraint "StaffAvailability_day_check" check ("dayOfWeek" between 0 and 6),
  constraint "StaffAvailability_startTime_check" check ("startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  constraint "StaffAvailability_endTime_check" check ("endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
);

create table if not exists public."Service" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "name" text not null,
  "slug" text not null unique,
  "category" text not null,
  "description" text,
  "price" integer not null,
  "duration" integer not null,
  "image" text,
  "isPopular" boolean not null default false,
  "isActive" boolean not null default true,
  "displayOrder" integer not null default 0,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Service_price_check" check ("price" >= 0),
  constraint "Service_duration_check" check ("duration" between 5 and 480)
);

create table if not exists public."Customer" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "name" text not null,
  "phone" text not null unique,
  "email" text,
  "totalVisits" integer not null default 1,
  "lastVisit" timestamp(3) default current_timestamp,
  "notes" text,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Customer_totalVisits_check" check ("totalVisits" >= 0)
);

create table if not exists public."Appointment" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "appointmentNumber" text not null unique,
  "customerId" text not null references public."Customer"("id") on delete restrict on update cascade,
  "serviceId" text not null references public."Service"("id") on delete restrict on update cascade,
  "staffId" text references public."Staff"("id") on delete set null on update cascade,
  "date" text not null,
  "startTime" text not null,
  "endTime" text not null,
  "duration" integer not null,
  "totalPrice" integer not null,
  "status" text not null default 'CONFIRMED',
  "customerNotes" text,
  "adminNotes" text,
  "source" text not null default 'ONLINE',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Appointment_date_check" check ("date" ~ '^\d{4}-\d{2}-\d{2}$'),
  constraint "Appointment_startTime_check" check ("startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  constraint "Appointment_endTime_check" check ("endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  constraint "Appointment_duration_check" check ("duration" between 5 and 480),
  constraint "Appointment_totalPrice_check" check ("totalPrice" >= 0),
  constraint "Appointment_status_check" check ("status" in ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  constraint "Appointment_source_check" check ("source" in ('ONLINE', 'WALK_IN', 'PHONE'))
);

create table if not exists public."GalleryItem" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "title" text not null,
  "category" text not null,
  "imageUrl" text not null,
  "altText" text not null,
  "isBeforeAfter" boolean not null default false,
  "beforeImageUrl" text,
  "afterImageUrl" text,
  "displayOrder" integer not null default 0,
  "isPublished" boolean not null default true,
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp
);

create table if not exists public."Testimonial" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "customerName" text not null,
  "rating" integer not null default 5,
  "review" text not null,
  "serviceName" text default 'Hair Cut & Styling',
  "isPublished" boolean not null default true,
  "isFeatured" boolean not null default false,
  "date" text default 'Recent',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "Testimonial_rating_check" check ("rating" between 1 and 5)
);

create table if not exists public."ContactEnquiry" (
  "id" text primary key default extensions.gen_random_uuid()::text,
  "name" text not null,
  "phone" text not null,
  "email" text,
  "message" text not null,
  "status" text not null default 'UNREAD',
  "createdAt" timestamp(3) not null default current_timestamp,
  "updatedAt" timestamp(3) not null default current_timestamp,
  constraint "ContactEnquiry_status_check" check ("status" in ('UNREAD', 'READ', 'RESOLVED'))
);

create index if not exists "Appointment_date_idx" on public."Appointment"("date");
create index if not exists "Appointment_status_idx" on public."Appointment"("status");
create index if not exists "Appointment_staffId_date_idx" on public."Appointment"("staffId", "date");
create index if not exists "Appointment_customerId_idx" on public."Appointment"("customerId");
create index if not exists "BlockedPeriod_dates_idx" on public."BlockedPeriod"("startDate", "endDate");
create index if not exists "BlockedPeriod_staffId_idx" on public."BlockedPeriod"("staffId");
create index if not exists "Service_active_order_idx" on public."Service"("isActive", "displayOrder");
create index if not exists "Staff_active_order_idx" on public."Staff"("isActive", "displayOrder");
create index if not exists "GalleryItem_published_order_idx" on public."GalleryItem"("isPublished", "displayOrder");
create index if not exists "Testimonial_published_featured_idx" on public."Testimonial"("isPublished", "isFeatured");
create index if not exists "ContactEnquiry_status_created_idx" on public."ContactEnquiry"("status", "createdAt");
create unique index if not exists "Appointment_active_staff_start_key"
  on public."Appointment"("staffId", "date", "startTime")
  where "staffId" is not null and "status" <> 'CANCELLED';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new."updatedAt" = current_timestamp;
  return new;
end;
$$;

drop trigger if exists "AdminUser_set_updated_at" on public."AdminUser";
create trigger "AdminUser_set_updated_at" before update on public."AdminUser"
for each row execute function public.set_updated_at();
drop trigger if exists "BusinessSettings_set_updated_at" on public."BusinessSettings";
create trigger "BusinessSettings_set_updated_at" before update on public."BusinessSettings"
for each row execute function public.set_updated_at();
drop trigger if exists "BusinessHours_set_updated_at" on public."BusinessHours";
create trigger "BusinessHours_set_updated_at" before update on public."BusinessHours"
for each row execute function public.set_updated_at();
drop trigger if exists "Staff_set_updated_at" on public."Staff";
create trigger "Staff_set_updated_at" before update on public."Staff"
for each row execute function public.set_updated_at();
drop trigger if exists "Service_set_updated_at" on public."Service";
create trigger "Service_set_updated_at" before update on public."Service"
for each row execute function public.set_updated_at();
drop trigger if exists "Customer_set_updated_at" on public."Customer";
create trigger "Customer_set_updated_at" before update on public."Customer"
for each row execute function public.set_updated_at();
drop trigger if exists "Appointment_set_updated_at" on public."Appointment";
create trigger "Appointment_set_updated_at" before update on public."Appointment"
for each row execute function public.set_updated_at();
drop trigger if exists "GalleryItem_set_updated_at" on public."GalleryItem";
create trigger "GalleryItem_set_updated_at" before update on public."GalleryItem"
for each row execute function public.set_updated_at();
drop trigger if exists "Testimonial_set_updated_at" on public."Testimonial";
create trigger "Testimonial_set_updated_at" before update on public."Testimonial"
for each row execute function public.set_updated_at();
drop trigger if exists "ContactEnquiry_set_updated_at" on public."ContactEnquiry";
create trigger "ContactEnquiry_set_updated_at" before update on public."ContactEnquiry"
for each row execute function public.set_updated_at();

insert into public."BusinessSettings" (
  "id", "salonName", "tagline", "establishedYear", "ownerName", "phone",
  "altPhone", "whatsappNumber", "email", "address", "city", "slotInterval",
  "advanceNoticeHours", "maxAdvanceDays", "cancellationHours", "currencySymbol"
) values (
  'settings-champion-hair-salon', 'CHAMPION HAIR SALON',
  'Where Tradition Meets Excellence in Men''s Grooming', 1998, 'Sachin Mahaley',
  '+91 8888857057', '+91 9158846787', '918888857057',
  'info@championhairsalon.com', 'Champion Hair Salon, Main Market, Maharashtra, India',
  'Maharashtra', 30, 1, 30, 2, '₹'
) on conflict ("id") do nothing;

insert into public."BusinessHours" (
  "id", "dayOfWeek", "dayName", "isOpen", "openTime", "closeTime", "hasBreak"
) values
  ('hours-sunday', 0, 'Sunday', true, '09:00', '22:00', false),
  ('hours-monday', 1, 'Monday', true, '09:00', '22:00', false),
  ('hours-tuesday', 2, 'Tuesday', true, '09:00', '22:00', false),
  ('hours-wednesday', 3, 'Wednesday', true, '09:00', '22:00', false),
  ('hours-thursday', 4, 'Thursday', true, '09:00', '22:00', false),
  ('hours-friday', 5, 'Friday', true, '09:00', '22:00', false),
  ('hours-saturday', 6, 'Saturday', true, '09:00', '22:00', false)
on conflict ("dayOfWeek") do nothing;

insert into public."Staff" (
  "id", "name", "role", "phone", "photo", "bio", "specialties", "isActive", "displayOrder"
) values
  (
    'staff-sachin-mahaley', 'Sachin Mahaley', 'Founder & Master Barber',
    '+91 8888857057', '/images/sachin-mahaley.jpg',
    'Founder of Champion Hair Salon with over 28 years of master barber craftsmanship since 1998.',
    'Precision Haircut, Beard Sculpting, Classic Straight-Razor Shave, Hair Colour & Facials',
    true, 1
  ),
  (
    'staff-senior-stylist', 'Rahul & Team', 'Senior Barber & Stylist',
    '+91 9158846787', null,
    'Expert stylist trained under Sachin Mahaley, specializing in modern grooming and skincare.',
    'Modern Fades, Head Massage, D-Tan & Facial Care', true, 2
  )
on conflict ("id") do nothing;

insert into public."StaffAvailability" (
  "id", "staffId", "dayOfWeek", "isWorking", "startTime", "endTime"
)
select
  'shift-' || staff."id" || '-' || day_number,
  staff."id", day_number, true, '09:00', '22:00'
from public."Staff" as staff
cross join generate_series(0, 6) as days(day_number)
where staff."id" in ('staff-sachin-mahaley', 'staff-senior-stylist')
on conflict ("staffId", "dayOfWeek") do nothing;

insert into public."Service" (
  "id", "name", "slug", "category", "description", "price", "duration",
  "isPopular", "isActive", "displayOrder"
) values
  ('service-hair-cut', 'Hair Cut', 'hair-cut', 'Hair Cutting', 'Signature haircut tailored to your head shape and personal style.', 120, 30, true, true, 1),
  ('service-baby-hair-cut', 'Baby Hair Cut', 'baby-hair-cut', 'Hair Cutting', 'Gentle and patient haircut for young boys.', 120, 25, false, true, 2),
  ('service-baby-girl-hair-cut', 'Baby Girl Hair Cut', 'baby-girl-hair-cut', 'Hair Cutting', 'Neat, careful trimming and styling for young girls.', 120, 25, false, true, 3),
  ('service-vi-john-shaving', 'Vi-John Shaving', 'vi-john-shaving', 'Shaving & Beard', 'Classic clean razor shave with soothing lather.', 60, 20, false, true, 4),
  ('service-beard-trimming-shape', 'Beard Trimming & Shape', 'beard-trimming-shape', 'Shaving & Beard', 'Detailed beard styling with sharp cheek and neck lines.', 70, 25, true, true, 5),
  ('service-denim-shaving', 'Denim Shaving', 'denim-shaving', 'Shaving & Beard', 'Refined shave with invigorating aftershave care.', 70, 25, false, true, 6),
  ('service-bombay-shaving', 'Bombay Shaving', 'bombay-shaving', 'Shaving & Beard', 'Premium smooth shave with rich lather and hydration.', 70, 25, false, true, 7),
  ('service-old-spice-shaving', 'Old Spice Shaving', 'old-spice-shaving', 'Shaving & Beard', 'Traditional shave with a refreshing finish.', 70, 25, false, true, 8),
  ('service-gillette-foam-shaving', 'Gillette Foam Shaving', 'gillette-foam-shaving', 'Shaving & Beard', 'Protective foam shave for sensitive skin.', 80, 25, false, true, 9),
  ('service-moustache-colour', 'Moustache Colour', 'moustache-colour', 'Hair Colour', 'Natural-looking grey coverage for moustache.', 50, 15, false, true, 10),
  ('service-beard-colour', 'Beard Colour', 'beard-colour', 'Hair Colour', 'Full beard grey blending with skin-safe colour.', 100, 20, false, true, 11),
  ('service-highlights', 'Highlights', 'highlights', 'Hair Colour', 'Custom crown highlights and textured tones.', 150, 35, false, true, 12),
  ('service-full-hair-colour', 'Full Hair Colour', 'full-hair-colour', 'Hair Colour', 'Complete natural-looking hair colouring.', 200, 45, true, true, 13),
  ('service-coconut-oil-head-massage', 'Coconut Oil Head Massage', 'coconut-oil-head-massage', 'Head Massage', 'Deep scalp massage with coconut oil.', 150, 25, false, true, 14),
  ('service-navratna-oil-head-massage', 'Navratna Oil Head Massage', 'navratna-oil-head-massage', 'Head Massage', 'Cooling herbal head and neck massage.', 200, 30, true, true, 15),
  ('service-forehead-threading', 'Forehead Threading', 'forehead-threading', 'Threading', 'Precision hair removal for a clean forehead.', 40, 10, false, true, 16),
  ('service-eyebrows-threading', 'Eyebrows Threading', 'eyebrows-threading', 'Threading', 'Subtle eyebrow shaping and cleanup.', 40, 10, false, true, 17),
  ('service-regular-face-massage', 'Regular Face Massage', 'regular-face-massage', 'Face Massage & Facials', 'Hydrating facial cream massage.', 200, 30, false, true, 18),
  ('service-bleach-gold', 'Bleach Gold', 'bleach-gold', 'Face Massage & Facials', 'Gentle golden bleach application.', 200, 30, false, true, 19),
  ('service-d-tan-face-massage', 'D-Tan Face Massage', 'd-tan-face-massage', 'Face Massage & Facials', 'Deep anti-tan exfoliation and massage.', 250, 35, true, true, 20),
  ('service-kit-face-massage', 'Kit Face Massage', 'kit-face-massage', 'Face Massage & Facials', 'Multi-step salon kit face massage.', 300, 40, false, true, 21),
  ('service-radini-others-facial', 'Radini & Others Facial', 'radini-others-facial', 'Face Massage & Facials', 'Specialized deep cleansing facial treatment.', 600, 50, false, true, 22),
  ('service-o3-facial-regular', 'O+3 Facial Regular', 'o3-facial-regular', 'Face Massage & Facials', 'Premium oxygenating professional facial.', 1000, 60, true, true, 23)
on conflict ("slug") do nothing;

insert into public."GalleryItem" (
  "id", "title", "category", "imageUrl", "altText", "displayOrder", "isPublished"
) values
  ('gallery-storefront', 'Champion Hair Salon Storefront (Since 1998)', 'Salon', '/images/salon-storefront.jpg', 'Champion Hair Salon storefront entrance', 1, true),
  ('gallery-sachin', 'Master Barber Sachin Mahaley', 'Salon', '/images/sachin-mahaley.jpg', 'Sachin Mahaley, founder and master barber', 2, true),
  ('gallery-rate-board', 'Official Salon Service & Rate Board', 'Salon', '/images/price-menu.jpg', 'Champion Hair Salon service rate board', 3, true)
on conflict ("id") do nothing;

insert into public."Testimonial" (
  "id", "customerName", "rating", "review", "serviceName", "isPublished", "isFeatured", "date"
) values
  ('testimonial-rajesh', 'Rajesh Patil', 5, 'The consistency, patience, and warmth here is unbeatable. Best haircut in town!', 'Hair Cut & Beard Trimming', true, true, 'August 2026'),
  ('testimonial-amit', 'Amit Deshmukh', 5, 'Sachin Mahaley is a true master barber. The precision and head massage are excellent.', 'Navratna Oil Head Massage', true, true, 'July 2026'),
  ('testimonial-sandeep', 'Sandeep Shinde', 5, 'Very hygienic shop, genuine rates, and the team always listens carefully.', 'Full Hair Colour & Facial', true, true, 'June 2026')
on conflict ("id") do nothing;

-- The existing Next.js admin login uses bcrypt hashes. Change the plaintext
-- placeholder below before running this script; the plaintext is never stored.
insert into public."AdminUser" (
  "id", "email", "passwordHash", "name", "role"
) values (
  'admin-champion-owner',
  'admin@championhairsalon.com',
  extensions.crypt('CHANGE_THIS_ADMIN_PASSWORD', extensions.gen_salt('bf', 10)),
  'Sachin Mahaley',
  'ADMIN'
) on conflict ("email") do nothing;

-- The app accesses Supabase only through protected Next.js server routes.
-- Block direct browser access through Supabase's public Data API.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'AdminUser', 'BusinessSettings', 'BusinessHours', 'Staff',
    'BlockedPeriod', 'StaffAvailability', 'Service', 'Customer',
    'Appointment', 'GalleryItem', 'Testimonial', 'ContactEnquiry'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, authenticated', table_name);
  end loop;
end;
$$;

commit;

-- Verification query: expected result is 12 tables.
select count(*) as salon_table_count
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'AdminUser', 'BusinessSettings', 'BusinessHours', 'Staff',
    'BlockedPeriod', 'StaffAvailability', 'Service', 'Customer',
    'Appointment', 'GalleryItem', 'Testimonial', 'ContactEnquiry'
  );
