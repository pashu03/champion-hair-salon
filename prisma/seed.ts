import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Champion Hair Salon database...");

  // 1. Admin User
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@championhairsalon.com"
  )
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD is required when seeding the Supabase database."
    );
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: "Sachin Mahaley",
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user configured: ${adminEmail}`);

  // 2. Business Settings
  const existingSettings = await prisma.businessSettings.findFirst();
  if (!existingSettings) {
    await prisma.businessSettings.create({
      data: {
        salonName: "CHAMPION HAIR SALON",
        tagline: "Where Tradition Meets Excellence in Men's Grooming",
        establishedYear: 1998,
        ownerName: "Sachin Mahaley",
        phone: "+91 8888857057",
        altPhone: "+91 9158846787",
        whatsappNumber: "918888857057",
        email: "info@championhairsalon.com",
        address: "Champion Hair Salon, Main Market, Maharashtra, India",
        city: "Maharashtra",
        googleMapsEmbedUrl:
          "https://maps.google.com/maps?q=Champion+Hair+Salon&t=&z=14&ie=UTF8&iwloc=&output=embed",
        googleReviewUrl: "https://search.google.com/local/writereview?placeid=championhairsalon",
        instagramUrl: "https://instagram.com/championhairsalon",
        facebookUrl: "https://facebook.com/championhairsalon",
        slotInterval: 30,
        advanceNoticeHours: 1,
        maxAdvanceDays: 30,
        cancellationHours: 2,
        currencySymbol: "₹",
      },
    });
  }
  console.log("✓ Business settings configured");

  // 3. Business Hours (Monday to Sunday)
  const days = [
    { dayOfWeek: 0, dayName: "Sunday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 1, dayName: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 2, dayName: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 3, dayName: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 4, dayName: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 5, dayName: "Friday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { dayOfWeek: 6, dayName: "Saturday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
  ];

  for (const day of days) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: {},
      create: day,
    });
  }
  console.log("✓ Business hours initialized (Mon - Sun, 09:00 - 22:00)");

  // 4. Staff / Barbers
  const sachin = await prisma.staff.upsert({
    where: { id: "staff-sachin-mahaley" },
    update: {},
    create: {
      id: "staff-sachin-mahaley",
      name: "Sachin Mahaley",
      role: "Founder & Master Barber",
      phone: "+91 8888857057",
      photo: "/images/sachin-mahaley.jpg",
      bio: "Founder of Champion Hair Salon with over 28 years of master barber craftsmanship since 1998. Specialized in precision haircutting, classic shaves, and personalized client styling.",
      specialties: "Precision Haircut, Beard Sculpting, Classic Straight-Razor Shave, Hair Colour & Facials",
      isActive: true,
      displayOrder: 1,
    },
  });

  const seniorBarber = await prisma.staff.upsert({
    where: { id: "staff-senior-stylist" },
    update: {},
    create: {
      id: "staff-senior-stylist",
      name: "Rahul & Team",
      role: "Senior Barber & Stylist",
      phone: "+91 9158846787",
      photo: null,
      bio: "Expert stylist trained under Sachin Mahaley, specializing in modern fade cuts, beard design, head massages, and skincare facials.",
      specialties: "Modern Fades, Head Massage, D-Tan & Facial Care",
      isActive: true,
      displayOrder: 2,
    },
  });

  // Staff Availabilities
  for (let d = 0; d <= 6; d++) {
    await prisma.staffAvailability.upsert({
      where: { staffId_dayOfWeek: { staffId: sachin.id, dayOfWeek: d } },
      update: {},
      create: { staffId: sachin.id, dayOfWeek: d, isWorking: true, startTime: "09:00", endTime: "22:00" },
    });

    await prisma.staffAvailability.upsert({
      where: { staffId_dayOfWeek: { staffId: seniorBarber.id, dayOfWeek: d } },
      update: {},
      create: { staffId: seniorBarber.id, dayOfWeek: d, isWorking: true, startTime: "09:00", endTime: "22:00" },
    });
  }
  console.log("✓ Barbers and weekly shifts configured");

  // 5. Real Services (From Salon Rate Board)
  const servicesData = [
    // Hair Cutting
    {
      name: "Hair Cut",
      slug: "hair-cut",
      category: "Hair Cutting",
      description: "Signature haircut crafted by master barbers tailored to your head shape and personal style.",
      price: 120,
      duration: 30,
      isPopular: true,
      displayOrder: 1,
    },
    {
      name: "Baby Hair Cut",
      slug: "baby-hair-cut",
      category: "Hair Cutting",
      description: "Gentle and patient haircut for young boys in a friendly, comfortable environment.",
      price: 120,
      duration: 25,
      isPopular: false,
      displayOrder: 2,
    },
    {
      name: "Baby Girl Hair Cut",
      slug: "baby-girl-hair-cut",
      category: "Hair Cutting",
      description: "Neat, careful trimming and styling for young girls.",
      price: 120,
      duration: 25,
      isPopular: false,
      displayOrder: 3,
    },

    // Shaving & Beard
    {
      name: "Vi-John Shaving",
      slug: "vi-john-shaving",
      category: "Shaving & Beard",
      description: "Classic clean razor shave with Vi-John soothing lather and warm towel preparation.",
      price: 60,
      duration: 20,
      isPopular: false,
      displayOrder: 4,
    },
    {
      name: "Beard Trimming & Shape",
      slug: "beard-trimming-shape",
      category: "Shaving & Beard",
      description: "Detailed beard styling, sharp cheek lines, neck trimming, and grooming finish.",
      price: 70,
      duration: 25,
      isPopular: true,
      displayOrder: 5,
    },
    {
      name: "Denim Shaving",
      slug: "denim-shaving",
      category: "Shaving & Beard",
      description: "Refined shave paired with invigorating Denim fragrance aftershave care.",
      price: 70,
      duration: 25,
      isPopular: false,
      displayOrder: 6,
    },
    {
      name: "Bombay Shaving",
      slug: "bombay-shaving",
      category: "Shaving & Beard",
      description: "Premium smooth shave experience with rich lathering and skin hydration.",
      price: 70,
      duration: 25,
      isPopular: false,
      displayOrder: 7,
    },
    {
      name: "Old Spice Shaving",
      slug: "old-spice-shaving",
      category: "Shaving & Beard",
      description: "Timeless traditional shave with legendary Old Spice aroma and refreshing post-shave.",
      price: 70,
      duration: 25,
      isPopular: false,
      displayOrder: 8,
    },
    {
      name: "Gillette Foam Shaving",
      slug: "gillette-foam-shaving",
      category: "Shaving & Beard",
      description: "Ultra-smooth protective foam shave for sensitive skin and a silky finish.",
      price: 80,
      duration: 25,
      isPopular: false,
      displayOrder: 9,
    },

    // Hair Colour
    {
      name: "Moustache Colour",
      slug: "moustache-colour",
      category: "Hair Colour",
      description: "Natural-looking grey coverage and darkening for moustache.",
      price: 50,
      duration: 15,
      isPopular: false,
      displayOrder: 10,
    },
    {
      name: "Beard Colour",
      slug: "beard-colour",
      category: "Hair Colour",
      description: "Full beard grey blending with skin-safe, long-lasting formulation.",
      price: 100,
      duration: 20,
      isPopular: false,
      displayOrder: 11,
    },
    {
      name: "Highlights",
      slug: "highlights",
      category: "Hair Colour",
      description: "Custom crown highlights and textured tones to enhance your haircut dimension.",
      price: 150,
      duration: 35,
      isPopular: false,
      displayOrder: 12,
    },
    {
      name: "Full Hair Colour",
      slug: "full-hair-colour",
      category: "Hair Colour",
      description: "Complete rich black or natural brown hair colouring for an authentic, youthful look.",
      price: 200,
      duration: 45,
      isPopular: true,
      displayOrder: 13,
    },

    // Head Massage
    {
      name: "Coconut Oil Head Massage",
      slug: "coconut-oil-head-massage",
      category: "Head Massage",
      description: "Relaxing deep scalp massage with pure coconut oil to nourish roots and relieve stress.",
      price: 150,
      duration: 25,
      isPopular: false,
      displayOrder: 14,
    },
    {
      name: "Navratna Oil Head Massage",
      slug: "navratna-oil-head-massage",
      category: "Head Massage",
      description: "Cooling herbal ayurvedic head and neck acupressure massage for supreme relaxation.",
      price: 200,
      duration: 30,
      isPopular: true,
      displayOrder: 15,
    },

    // Threading
    {
      name: "Forehead Threading",
      slug: "forehead-threading",
      category: "Threading",
      description: "Precision hair removal for a clean forehead and crisp hairline.",
      price: 40,
      duration: 10,
      isPopular: false,
      displayOrder: 16,
    },
    {
      name: "Eyebrows Threading",
      slug: "eyebrows-threading",
      category: "Threading",
      description: "Subtle masculine eyebrow shaping and stray hair cleanup.",
      price: 40,
      duration: 10,
      isPopular: false,
      displayOrder: 17,
    },

    // Face Massage & Facials
    {
      name: "Regular Face Massage",
      slug: "regular-face-massage",
      category: "Face Massage & Facials",
      description: "Hydrating facial cream massage to boost blood circulation and skin glow.",
      price: 200,
      duration: 30,
      isPopular: false,
      displayOrder: 18,
    },
    {
      name: "Bleach Gold",
      slug: "bleach-gold",
      category: "Face Massage & Facials",
      description: "Gentle golden bleach application to brighten dull complexion and lighten facial hair.",
      price: 200,
      duration: 30,
      isPopular: false,
      displayOrder: 19,
    },
    {
      name: "D-Tan Face Massage",
      slug: "d-tan-face-massage",
      category: "Face Massage & Facials",
      description: "Deep anti-tan exfoliation that removes sun damage, pollution grime, and dead skin cells.",
      price: 250,
      duration: 35,
      isPopular: true,
      displayOrder: 20,
    },
    {
      name: "Kit Face Massage",
      slug: "kit-face-massage",
      category: "Face Massage & Facials",
      description: "Multi-step salon kit massage including cleanser, scrub, massage cream, and pack.",
      price: 300,
      duration: 40,
      isPopular: false,
      displayOrder: 21,
    },
    {
      name: "Radini & Others Facial",
      slug: "radini-others-facial",
      category: "Face Massage & Facials",
      description: "Specialized deep cleansing facial treatment restoring firmness and youthful radiance.",
      price: 600,
      duration: 50,
      isPopular: false,
      displayOrder: 22,
    },
    {
      name: "O+3 Facial Regular",
      slug: "o3-facial-regular",
      category: "Face Massage & Facials",
      description: "Premium oxygenating professional facial delivering intensive hydration, whitening, and skin detox.",
      price: 1000,
      duration: 60,
      isPopular: true,
      displayOrder: 23,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log(`✓ ${servicesData.length} Real salon services inserted`);

  // 6. Gallery Items
  const galleryData = [
    {
      title: "Champion Hair Salon Storefront (Since 1998)",
      category: "Salon",
      imageUrl: "/images/salon-storefront.jpg",
      altText: "Champion Hair Salon Storefront Entrance with beard graphic glass and since 1998 badge",
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: "Master Barber Sachin Mahaley",
      category: "Salon",
      imageUrl: "/images/sachin-mahaley.jpg",
      altText: "Sachin Mahaley, Founder and Head Barber at Champion Hair Salon",
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: "Official Salon Service & Rate Board",
      category: "Salon",
      imageUrl: "/images/price-menu.jpg",
      altText: "Champion Hair Salon authentic rate menu board and UPI payment QR",
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: "Classic Gentleman's Taper & Scissor Cut",
      category: "Haircuts",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
      altText: "Classic haircut with clean sides and styled top",
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: "Sharp Beard Sculpting & Razor Edge",
      category: "Beard Styles",
      imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
      altText: "Sculpted beard with defined cheek and neck lines",
      displayOrder: 5,
      isPublished: true,
    },
    {
      title: "Modern Low Fade & Textured Crop",
      category: "Haircuts",
      imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
      altText: "Modern low skin fade haircut",
      displayOrder: 6,
      isPublished: true,
    },
    {
      title: "Natural Grey Coverage & Beard Tint",
      category: "Hair Colour",
      imageUrl: "https://images.unsplash.com/photo-1517832606589-7629c3397143?auto=format&fit=crop&w=800&q=80",
      altText: "Natural black hair and beard colour grooming",
      displayOrder: 7,
      isPublished: true,
    },
  ];

  for (const item of galleryData) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.galleryItem.create({ data: item });
    }
  }
  console.log("✓ Gallery items seeded");

  // 7. Testimonials
  const testimonials = [
    {
      customerName: "Rajesh Patil",
      rating: 5,
      review: "I have been coming to Sachin Bhai for more than 15 years now. The consistency, patience, and warmth here is unbeatable. Best haircut in town!",
      serviceName: "Hair Cut & Beard Trimming",
      isPublished: true,
      isFeatured: true,
      date: "August 2026",
    },
    {
      customerName: "Amit Deshmukh",
      rating: 5,
      review: "Sachin Mahaley is a true master barber. The precision of the razor finish and the head massage is so relaxing. Truly feels like a premium experience every single visit.",
      serviceName: "Navratna Oil Head Massage",
      isPublished: true,
      isFeatured: true,
      date: "July 2026",
    },
    {
      customerName: "Sandeep Shinde",
      rating: 5,
      review: "My whole family visits Champion Salon. Very hygienic shop, genuine rates, and Sachin Ji always listens carefully to what style you want.",
      serviceName: "Full Hair Colour & Facial",
      isPublished: true,
      isFeatured: true,
      date: "June 2026",
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { customerName: t.customerName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log("✓ Customer testimonials seeded");

  console.log("✅ Champion Hair Salon database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
