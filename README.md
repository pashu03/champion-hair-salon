# 💈 Champion Hair Salon - Web & Appointment Management System

A full-stack web application and appointment booking system designed for **Champion Hair Salon** (Established in 1998 by Founder **Sachin Mahaley**).

The application pairs a dark luxury customer experience with an appointment booking engine, live chair availability calculation, WhatsApp click-to-chat integration, and a comprehensive secure administration dashboard.

---

## 🌟 Key Features

### Customer-Facing Experience
- **Hero & Heritage:** Established 1998 brand identity with real salon storefront imagery, founder profile, and trust highlights.
- **Complete Services Menu:** Categorized grooming services with verified rates in Indian Rupees (₹), exact durations, and descriptions.
- **Multi-Step Online Booking:**
  1. Service Selection (Filter by category, price ₹, duration)
  2. Barber Selection (Sachin Mahaley or Any Available Barber)
  3. Date Picker (Next 14–30 days with day names)
  4. Live Time Slot Generation (Calculated dynamically against working hours, staff shifts, breaks, and existing appointments)
  5. Customer Contact Info (Name, Mobile, Email, Notes)
  6. Instant Confirmation Voucher (`CH-2026-XXXXXX`)
- **Shareable Booking Voucher:** One-click WhatsApp prefilled voucher generator, Google Calendar sync, Apple/Outlook `.ics` download, and printable receipt.
- **Gallery & Lightbox:** Categorized photo showcase (Salon, Haircuts, Beard Styles, Hair Colour) with high-resolution lightbox.
- **Customer Reviews:** Real feedback display with 5-star ratings, Google Business review CTA, and interactive review submission.
- **Contact & Directions:** Direct phone calling (`+91 8888857057`), WhatsApp button, working hours overview, and Google Maps embed.
- **Mobile-First Responsiveness:** Sticky mobile bottom action bar (Call, WhatsApp, Book Now) and floating WhatsApp contact button.

### Secure Admin Management Portal (`/admin`)
- **Protected Authentication:** Secure password hashing with `bcryptjs` and signed HTTP-only JWT cookies.
- **Live Dashboard:** Real-time KPI metrics (Today's, Upcoming, Pending, Completed, Revenue estimate, Total customers) and today's schedule timeline.
- **Appointment Management:** Search, filter by status / date / staff, status updates (Pending, Confirmed, Completed, Cancelled, No-Show), and manual walk-in creation.
- **Interactive Calendar:** Visual monthly and daily schedule view.
- **Service Management:** Add, edit rates, configure duration, toggle popular flags, and deactivate services.
- **Staff & Barber Profiles:** Manage barber profiles, roles, and shift availability.
- **Gallery Manager:** Add, edit, display order, and publish/unpublish photos.
- **Testimonial Moderation:** Review approval and homepage feature toggle.
- **Contact Inquiries:** View customer submissions with 1-click WhatsApp / Call response.
- **Business Hours & Breaks:** Configure open/close times and lunch breaks for every day of the week.
- **Customer Directory:** Automatically aggregated customer database with visit counts and history.
- **Business Settings:** Centralized salon contact information, Google Maps embed URL, and booking interval rules.
- **CSV Data Export:** Export appointments to standard CSV.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS (Custom Dark Luxury Theme: `#050505`, `#111111`, `#161616`, `#D4AF37` Gold) |
| **Typography** | Playfair Display (Headings) + Inter (Body/UI) |
| **Database & ORM**| Prisma ORM with Supabase PostgreSQL |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Auth & Security** | `bcryptjs` (Password Hashing) + `jose` (JWT Session Cookies) |
| **Testing** | Vitest |

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd champion-hair-salon
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Use the hosted Supabase database instead of a local database:
```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
JWT_SECRET="replace-with-a-long-random-secret"
ADMIN_EMAIL="admin@championhairsalon.com"
ADMIN_PASSWORD="choose-a-strong-admin-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="918888857057"
NEXT_PUBLIC_PHONE_NUMBER="+91 8888857057"
NEXT_PUBLIC_ALT_PHONE="+91 9158846787"
```

### 3. Initialize & Seed Database
```bash
# Generate Prisma Client for PostgreSQL
npx prisma generate

# Seed with official salon services, hours, owner profile and admin user
npm run db:seed
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Local Admin Portal Credentials

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Admin Email:** the `ADMIN_EMAIL` used when seeding
- **Password:** the `ADMIN_PASSWORD` used when seeding

The credentials come from the environment used to initialize each database.
Only the seed/admin-sync commands read `ADMIN_PASSWORD`; the login API verifies
the bcrypt hash stored in PostgreSQL. The login page never displays or pre-fills
the password.

Changing `ADMIN_EMAIL` or `ADMIN_PASSWORD` does not automatically update the
database. Synchronize only the admin account without changing salon data:

```bash
npm run admin:sync
```

---

## 🌐 Production Deployment (Vercel + Supabase)

### 1. Supabase PostgreSQL Database
1. Open **Connect** in the Supabase project dashboard.
2. Copy the **Transaction pooler** URI for Vercel application traffic.
3. Set `DATABASE_URL` for Production, Preview, and Development in Vercel:
   ```env
   DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```

URL-encode special characters in the username or password. For example, `@`
inside a password must be written as `%40`.

### 2. Deploy to Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set these Environment Variables for the deployment environment:
   - `DATABASE_URL`
   - `JWT_SECRET` (a long random value)
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Redeploy after changing environment variables. The Vercel build validates
   the Supabase PostgreSQL URL, generates Prisma Client, and runs `next build`.
   It does not recreate or modify the schema you already installed in Supabase.

If the database still needs the initial salon data or admin user, run
`npm run db:seed` once from a trusted terminal with `DATABASE_URL`,
`ADMIN_EMAIL`, and `ADMIN_PASSWORD` set.

If the salon data already exists and only the login is missing or the password
changed, use `npm run admin:sync` instead. Run it against the same
`DATABASE_URL` configured in Vercel.

Never commit production database, JWT, or admin secrets.

---

## 📋 Rate Card Reference (Included in Seed Data)

- **Hair Cutting:** Hair Cut (₹120), Baby Hair Cut (₹120), Baby Girl Hair Cut (₹120)
- **Shaving & Beard:** Vi-John Shaving (₹60), Beard Trimming & Shape (₹70), Denim Shaving (₹70), Bombay Shaving (₹70), Old Spice Shaving (₹70), Gillette Foam Shaving (₹80)
- **Hair Colour:** Moustache Colour (₹50), Beard Colour (₹100), Highlights (₹150), Full Hair Colour (₹200)
- **Head Massage:** Coconut Oil (₹150), Navratna Oil (₹200)
- **Threading:** Forehead (₹40), Eyebrows (₹40)
- **Facial Care:** Regular Face Massage (₹200), Bleach Gold (₹200), D-Tan Massage (₹250), Kit Massage (₹300), Radini Facial (₹600), O+3 Facial (₹1000)

---

## 📞 Salon Contact

- **Founder:** Sachin Mahaley
- **Phone / WhatsApp:** +91 8888857057 / +91 9158846787
- **Email:** info@championhairsalon.com
- **Hours:** Monday – Sunday (9:00 AM – 10:00 PM)
