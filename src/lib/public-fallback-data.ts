export interface PublicService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  isPopular: boolean;
}

const service = (
  slug: string,
  name: string,
  category: string,
  price: number,
  duration: number,
  isPopular = false,
  description = "Expert grooming service tailored to your styling preferences."
): PublicService => ({
  id: `fallback-${slug}`,
  slug,
  name,
  category,
  description,
  price,
  duration,
  isPopular,
});

export const fallbackServices: PublicService[] = [
  service("hair-cut", "Hair Cut", "Hair Cutting", 120, 30, true, "Signature haircut tailored to your head shape and personal style."),
  service("baby-hair-cut", "Baby Hair Cut", "Hair Cutting", 120, 25, false, "Gentle and patient haircut for young boys."),
  service("baby-girl-hair-cut", "Baby Girl Hair Cut", "Hair Cutting", 120, 25, false, "Neat, careful trimming and styling for young girls."),
  service("vi-john-shaving", "Vi-John Shaving", "Shaving & Beard", 60, 20, false, "Classic clean razor shave with soothing lather and warm-towel preparation."),
  service("beard-trimming-shape", "Beard Trimming & Shape", "Shaving & Beard", 70, 25, true, "Detailed beard styling with sharp cheek and neck lines."),
  service("denim-shaving", "Denim Shaving", "Shaving & Beard", 70, 25),
  service("bombay-shaving", "Bombay Shaving", "Shaving & Beard", 70, 25),
  service("old-spice-shaving", "Old Spice Shaving", "Shaving & Beard", 70, 25),
  service("gillette-foam-shaving", "Gillette Foam Shaving", "Shaving & Beard", 80, 25),
  service("moustache-colour", "Moustache Colour", "Hair Colour", 50, 15),
  service("beard-colour", "Beard Colour", "Hair Colour", 100, 20),
  service("highlights", "Highlights", "Hair Colour", 150, 35),
  service("full-hair-colour", "Full Hair Colour", "Hair Colour", 200, 45, true, "Complete natural-looking hair colour for authentic grey coverage."),
  service("coconut-oil-head-massage", "Coconut Oil Head Massage", "Head Massage", 150, 25),
  service("navratna-oil-head-massage", "Navratna Oil Head Massage", "Head Massage", 200, 30, true, "Cooling herbal head and neck massage for deep relaxation."),
  service("forehead-threading", "Forehead Threading", "Threading", 40, 10),
  service("eyebrows-threading", "Eyebrows Threading", "Threading", 40, 10),
  service("regular-face-massage", "Regular Face Massage", "Face Massage & Facials", 200, 30),
  service("bleach-gold", "Bleach Gold", "Face Massage & Facials", 200, 30),
  service("d-tan-face-massage", "D-Tan Face Massage", "Face Massage & Facials", 250, 35, true, "Deep anti-tan exfoliation for a refreshed complexion."),
  service("kit-face-massage", "Kit Face Massage", "Face Massage & Facials", 300, 40),
  service("radini-others-facial", "Radini & Others Facial", "Face Massage & Facials", 600, 50),
  service("o3-facial-regular", "O+3 Facial Regular", "Face Massage & Facials", 1000, 60, true, "Premium professional facial with intensive hydration and skin detox."),
];

export const fallbackTestimonials = [
  {
    id: "fallback-review-rajesh",
    customerName: "Rajesh Patil",
    rating: 5,
    review: "I have been coming to Sachin Bhai for more than 15 years. The consistency, patience, and warmth here are unbeatable.",
    serviceName: "Hair Cut & Beard Trimming",
    date: "August 2026",
  },
  {
    id: "fallback-review-amit",
    customerName: "Amit Deshmukh",
    rating: 5,
    review: "Sachin Mahaley is a true master barber. The precision of the razor finish and the head massage make every visit feel premium.",
    serviceName: "Navratna Oil Head Massage",
    date: "July 2026",
  },
  {
    id: "fallback-review-sandeep",
    customerName: "Sandeep Shinde",
    rating: 5,
    review: "My whole family visits Champion Salon. It is hygienic, fairly priced, and the team always listens carefully.",
    serviceName: "Full Hair Colour & Facial",
    date: "June 2026",
  },
];

export const fallbackGalleryItems = [
  {
    id: "fallback-gallery-storefront",
    title: "Champion Hair Salon Storefront (Since 1998)",
    category: "Salon",
    imageUrl: "/images/salon-storefront.jpg",
    altText: "Champion Hair Salon storefront entrance",
    isBeforeAfter: false,
  },
  {
    id: "fallback-gallery-founder",
    title: "Master Barber Sachin Mahaley",
    category: "Salon",
    imageUrl: "/images/sachin-mahaley.jpg",
    altText: "Sachin Mahaley, founder and master barber",
    isBeforeAfter: false,
  },
  {
    id: "fallback-gallery-menu",
    title: "Official Salon Service & Rate Board",
    category: "Salon",
    imageUrl: "/images/price-menu.jpg",
    altText: "Champion Hair Salon service and rate board",
    isBeforeAfter: false,
  },
  {
    id: "fallback-gallery-haircut",
    title: "Classic Gentleman's Taper & Scissor Cut",
    category: "Haircuts",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    altText: "Classic haircut with clean sides and a styled top",
    isBeforeAfter: false,
  },
  {
    id: "fallback-gallery-beard",
    title: "Sharp Beard Sculpting & Razor Edge",
    category: "Beard Styles",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=85",
    altText: "Sculpted beard with defined cheek and neck lines",
    isBeforeAfter: false,
  },
  {
    id: "fallback-gallery-fade",
    title: "Modern Low Fade & Textured Crop",
    category: "Haircuts",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=85",
    altText: "Modern low fade haircut",
    isBeforeAfter: false,
  },
];

export const fallbackStaff = [
  {
    id: "fallback-staff-sachin",
    name: "Sachin Mahaley",
    role: "Founder & Master Barber",
    photo: "/images/sachin-mahaley.jpg",
    specialties: "Precision Haircut, Beard Sculpting, Classic Shave, Hair Colour & Facials",
  },
  {
    id: "fallback-staff-team",
    name: "Rahul & Team",
    role: "Senior Barber & Stylist",
    photo: null,
    specialties: "Modern Fades, Head Massage, D-Tan & Facial Care",
  },
];

export const fallbackBusinessSettings = {
  address: "Champion Hair Salon, Main Market, Maharashtra, India",
  googleMapsEmbedUrl:
    "https://maps.google.com/maps?q=Champion+Hair+Salon&t=&z=13&ie=UTF8&iwloc=&output=embed",
};

export async function withPublicFallback<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!process.env.DATABASE_URL?.trim()) return fallback;

  try {
    const result = await query();
    if (result == null) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch {
    console.warn(`[public-data] ${label} unavailable; using static fallback data.`);
    return fallback;
  }
}
