-- A new production database previously had the schema but no operating hours,
-- staff shifts, or services. These idempotent inserts make online booking usable
-- immediately after `prisma migrate deploy` without creating an admin account or
-- overwriting values already managed through the admin portal.

INSERT INTO "BusinessSettings" (
  "id", "salonName", "tagline", "establishedYear", "ownerName", "phone",
  "altPhone", "whatsappNumber", "email", "address", "city", "slotInterval",
  "advanceNoticeHours", "maxAdvanceDays", "cancellationHours", "currencySymbol",
  "createdAt", "updatedAt"
)
SELECT
  'settings-champion-hair-salon', 'CHAMPION HAIR SALON',
  'Where Tradition Meets Excellence in Men''s Grooming', 1998, 'Sachin Mahaley',
  '+91 8888857057', '+91 9158846787', '918888857057',
  'info@championhairsalon.com', 'Champion Hair Salon, Main Market, Maharashtra, India',
  'Maharashtra', 30, 1, 30, 2, '₹', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "BusinessSettings");

INSERT INTO "BusinessHours" (
  "id", "dayOfWeek", "dayName", "isOpen", "openTime", "closeTime",
  "hasBreak", "createdAt", "updatedAt"
)
VALUES
  ('hours-sunday', 0, 'Sunday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-monday', 1, 'Monday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-tuesday', 2, 'Tuesday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-wednesday', 3, 'Wednesday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-thursday', 4, 'Thursday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-friday', 5, 'Friday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('hours-saturday', 6, 'Saturday', TRUE, '09:00', '22:00', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("dayOfWeek") DO NOTHING;

INSERT INTO "Staff" (
  "id", "name", "role", "phone", "photo", "bio", "specialties",
  "isActive", "displayOrder", "createdAt", "updatedAt"
)
VALUES
  (
    'staff-sachin-mahaley', 'Sachin Mahaley', 'Founder & Master Barber',
    '+91 8888857057', '/images/sachin-mahaley.jpg',
    'Founder of Champion Hair Salon with over 28 years of master barber craftsmanship since 1998.',
    'Precision Haircut, Beard Sculpting, Classic Straight-Razor Shave, Hair Colour & Facials',
    TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    'staff-senior-stylist', 'Rahul & Team', 'Senior Barber & Stylist',
    '+91 9158846787', NULL,
    'Expert stylist trained under Sachin Mahaley, specializing in modern grooming and skincare.',
    'Modern Fades, Head Massage, D-Tan & Facial Care',
    TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "StaffAvailability" (
  "id", "staffId", "dayOfWeek", "isWorking", "startTime", "endTime"
)
SELECT
  'shift-' || staff."id" || '-' || day_number,
  staff."id",
  day_number,
  TRUE,
  '09:00',
  '22:00'
FROM "Staff" AS staff
CROSS JOIN generate_series(0, 6) AS days(day_number)
WHERE staff."id" IN ('staff-sachin-mahaley', 'staff-senior-stylist')
ON CONFLICT ("staffId", "dayOfWeek") DO NOTHING;

-- Move installations that still have the original 9 PM defaults to 10 PM.
-- Custom admin-entered hours are preserved because only the old default is changed.
UPDATE "BusinessHours"
SET "closeTime" = '22:00', "updatedAt" = CURRENT_TIMESTAMP
WHERE "closeTime" = '21:00';

UPDATE "StaffAvailability"
SET "endTime" = '22:00'
WHERE "endTime" = '21:00';

ALTER TABLE "BusinessHours" ALTER COLUMN "closeTime" SET DEFAULT '22:00';
ALTER TABLE "StaffAvailability" ALTER COLUMN "endTime" SET DEFAULT '22:00';

INSERT INTO "Service" (
  "id", "name", "slug", "category", "description", "price", "duration",
  "isPopular", "isActive", "displayOrder", "createdAt", "updatedAt"
)
VALUES
  ('service-hair-cut', 'Hair Cut', 'hair-cut', 'Hair Cutting', 'Signature haircut tailored to your head shape and personal style.', 120, 30, TRUE, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-baby-hair-cut', 'Baby Hair Cut', 'baby-hair-cut', 'Hair Cutting', 'Gentle and patient haircut for young boys.', 120, 25, FALSE, TRUE, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-baby-girl-hair-cut', 'Baby Girl Hair Cut', 'baby-girl-hair-cut', 'Hair Cutting', 'Neat, careful trimming and styling for young girls.', 120, 25, FALSE, TRUE, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-vi-john-shaving', 'Vi-John Shaving', 'vi-john-shaving', 'Shaving & Beard', 'Classic clean razor shave with soothing lather and warm-towel preparation.', 60, 20, FALSE, TRUE, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-beard-trimming-shape', 'Beard Trimming & Shape', 'beard-trimming-shape', 'Shaving & Beard', 'Detailed beard styling with sharp cheek and neck lines.', 70, 25, TRUE, TRUE, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-denim-shaving', 'Denim Shaving', 'denim-shaving', 'Shaving & Beard', 'Refined shave with invigorating aftershave care.', 70, 25, FALSE, TRUE, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-bombay-shaving', 'Bombay Shaving', 'bombay-shaving', 'Shaving & Beard', 'Premium smooth shave with rich lather and skin hydration.', 70, 25, FALSE, TRUE, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-old-spice-shaving', 'Old Spice Shaving', 'old-spice-shaving', 'Shaving & Beard', 'Traditional shave with a refreshing post-shave finish.', 70, 25, FALSE, TRUE, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-gillette-foam-shaving', 'Gillette Foam Shaving', 'gillette-foam-shaving', 'Shaving & Beard', 'Protective foam shave for sensitive skin and a smooth finish.', 80, 25, FALSE, TRUE, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-moustache-colour', 'Moustache Colour', 'moustache-colour', 'Hair Colour', 'Natural-looking grey coverage for moustache.', 50, 15, FALSE, TRUE, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-beard-colour', 'Beard Colour', 'beard-colour', 'Hair Colour', 'Full beard grey blending with skin-safe colour.', 100, 20, FALSE, TRUE, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-highlights', 'Highlights', 'highlights', 'Hair Colour', 'Custom crown highlights and textured tones.', 150, 35, FALSE, TRUE, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-full-hair-colour', 'Full Hair Colour', 'full-hair-colour', 'Hair Colour', 'Complete natural-looking hair colouring.', 200, 45, TRUE, TRUE, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-coconut-oil-head-massage', 'Coconut Oil Head Massage', 'coconut-oil-head-massage', 'Head Massage', 'Deep scalp massage with coconut oil.', 150, 25, FALSE, TRUE, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-navratna-oil-head-massage', 'Navratna Oil Head Massage', 'navratna-oil-head-massage', 'Head Massage', 'Cooling herbal head and neck massage.', 200, 30, TRUE, TRUE, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-forehead-threading', 'Forehead Threading', 'forehead-threading', 'Threading', 'Precision hair removal for a clean forehead.', 40, 10, FALSE, TRUE, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-eyebrows-threading', 'Eyebrows Threading', 'eyebrows-threading', 'Threading', 'Subtle eyebrow shaping and cleanup.', 40, 10, FALSE, TRUE, 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-regular-face-massage', 'Regular Face Massage', 'regular-face-massage', 'Face Massage & Facials', 'Hydrating facial cream massage.', 200, 30, FALSE, TRUE, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-bleach-gold', 'Bleach Gold', 'bleach-gold', 'Face Massage & Facials', 'Gentle golden bleach application.', 200, 30, FALSE, TRUE, 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-d-tan-face-massage', 'D-Tan Face Massage', 'd-tan-face-massage', 'Face Massage & Facials', 'Deep anti-tan exfoliation and massage.', 250, 35, TRUE, TRUE, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-kit-face-massage', 'Kit Face Massage', 'kit-face-massage', 'Face Massage & Facials', 'Multi-step salon kit face massage.', 300, 40, FALSE, TRUE, 21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-radini-others-facial', 'Radini & Others Facial', 'radini-others-facial', 'Face Massage & Facials', 'Specialized deep cleansing facial treatment.', 600, 50, FALSE, TRUE, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('service-o3-facial-regular', 'O+3 Facial Regular', 'o3-facial-regular', 'Face Massage & Facials', 'Premium oxygenating professional facial.', 1000, 60, TRUE, TRUE, 23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
