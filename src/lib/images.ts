// Centralized image sources for the marketing site.
// Owned assets are served unchanged from this deployment, independently of the old Blob store.
// Stock photography uses Unsplash CDN elsewhere on the site.

const CDN = "/images";

export const heroImage = `${CDN}/hero-dusk.webp`;
export const logoImage = `${CDN}/logo-sc.webp`;

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Family photo for the Philosophy section.
export const aboutImage = unsplash("1543342384-1f1350e27861", 1100);

// Custom wide hero for the Guides index — family overlooking landscape at golden hour.
export const guidesIndexHeroImage = "/images/guides-hero-family-landscape.jpg";

// Advisor guiding a couple through options at a desk in an upscale office.
export const independenceImage = "/images/independence-consultation.jpg";

export const serviceImages: Record<string, string> = {
  "final-expense": unsplash("1529156069898-49953e39b3ac", 900),
  "mortgage-protection": unsplash("1600585154340-be6161a56a0c", 900),
  "term-life": unsplash("1511895426328-dc8714191300", 900),
  "whole-life": unsplash("1582750433449-648ed127bb54", 900),
  "retirement-legacy": unsplash("1507525428034-b723cf961d3e", 900),
  "annuity": unsplash("1573496359142-b8d87734a5a2", 900),
};
