/**
 * Central site + practice constants.
 * The hub is a supporting authority asset for the practice website.
 */

export const SITE = {
  name: "Shallowford Dental Resource",
  title: "Shallowford Dental Resource — Roswell, GA Dental Guides",
  description:
    "Expert-reviewed dental guides for Roswell, GA and Cobb & Fulton Counties, from the team at Shallowford Dental Studio.",
  /** Replace with the production domain once deployed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

/** Official practice site — the authoritative service reference. */
export const PRACTICE = {
  name: "Shallowford Dental Studio",
  url: "https://shallowfordds.com",
  phone: "(470) 970-4111",
  phoneHref: "tel:+14709704111",
  address: {
    street: "4401 Shallowford Rd, #140",
    city: "Roswell",
    region: "GA",
    postalCode: "30075",
    country: "US",
  },
  geo: { latitude: 34.028515, longitude: -84.4226216 },
  sameAs: ["https://instagram.com/shallowford_dental_studio"],
  /** NAP string kept consistent for local SEO. */
  nap: "4401 Shallowford Rd #140, Roswell, GA 30075",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/category" },
  { label: "Guides", href: "/resources" },
  { label: "About", href: "/about" },
] as const;

/** Medical disclaimer reused across articles and the disclaimer page. */
export const DISCLAIMER =
  "This content is for informational purposes only and is not a substitute for professional dental advice, diagnosis, or treatment. Always seek the guidance of a qualified dentist with questions about a dental condition. Never disregard professional advice or delay seeking it because of something you read here.";
