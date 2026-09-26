/** Banner slots available across the public site — one editable banner per key. */

export type BannerButtonStyle = "primary" | "outline";

export type BannerButton = {
  label: string;
  href: string;
  style: BannerButtonStyle;
};

export type BannerPageKey =
  | "home"
  | "properties"
  | "construction"
  | "construction-dream"
  | "house-maps"
  | "house-maps-custom"
  | "interior"
  | "about"
  | "about-why"
  | "contact"
  | "projects"
  | "projects-cta";

export type BannerPageMeta = {
  key: BannerPageKey;
  label: string;
  description: string;
  /** Recommended laptop / desktop upload size */
  recommendedSize: string;
  aspectHint: string;
  /** Recommended phone upload size */
  mobileRecommendedSize: string;
  mobileAspectHint: string;
  defaultImage: string;
};

export const BANNER_PAGES: BannerPageMeta[] = [
  {
    key: "home",
    label: "Home — Main Hero",
    description: "Full-width homepage banner (first screen).",
    recommendedSize: "1920 × 900 px",
    aspectHint: "Laptop landscape ~16:7 or 21:9",
    mobileRecommendedSize: "1080 × 1350 px",
    mobileAspectHint: "Phone portrait ~4:5 (full-screen feel)",
    defaultImage: "/images/hero-banner.jpg",
  },
  {
    key: "properties",
    label: "Properties — Hero",
    description: "Right-side image on Properties page hero.",
    recommendedSize: "1200 × 900 px",
    aspectHint: "Laptop landscape ~4:3",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/properties-hero.jpg",
  },
  {
    key: "construction",
    label: "Construction — Hero",
    description: "Construction page top hero image.",
    recommendedSize: "1920 × 800 px",
    aspectHint: "Laptop landscape ~12:5",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/construction-hero.jpg",
  },
  {
    key: "construction-dream",
    label: "Construction — Dream Home Banner",
    description: "Promo strip under Construction hero.",
    recommendedSize: "1400 × 600 px",
    aspectHint: "Laptop landscape ~7:3",
    mobileRecommendedSize: "1080 × 720 px",
    mobileAspectHint: "Phone ~3:2",
    defaultImage: "/images/construction-dream-home.jpg",
  },
  {
    key: "house-maps",
    label: "House Maps — Hero",
    description: "House Maps page top hero.",
    recommendedSize: "1920 × 800 px",
    aspectHint: "Laptop landscape ~12:5",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/house-plans-hero.jpg",
  },
  {
    key: "house-maps-custom",
    label: "House Maps — Custom Plan Banner",
    description: "Custom plan CTA banner on House Maps.",
    recommendedSize: "1200 × 700 px",
    aspectHint: "Laptop landscape ~12:7",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/custom-plan-model.jpg",
  },
  {
    key: "interior",
    label: "Interior Design — Hero",
    description: "Interior Design page promo / hero.",
    recommendedSize: "1920 × 800 px",
    aspectHint: "Laptop landscape ~12:5",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/interior-hero.jpg",
  },
  {
    key: "about",
    label: "About Us — Hero",
    description: "About page top hero image.",
    recommendedSize: "1200 × 900 px",
    aspectHint: "Laptop landscape ~4:3",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/projects-hero.jpg",
  },
  {
    key: "about-why",
    label: "About Us — Why Choose Us Banner",
    description: "Dark green banner with house photo on About page.",
    recommendedSize: "1000 × 700 px",
    aspectHint: "Laptop landscape ~10:7",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/listing-house-dusk.jpg",
  },
  {
    key: "contact",
    label: "Contact — Hero",
    description: "Contact page top hero image.",
    recommendedSize: "1200 × 900 px",
    aspectHint: "Laptop landscape ~4:3",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/projects-hero.jpg",
  },
  {
    key: "projects",
    label: "Projects — Hero",
    description: "Projects page top hero.",
    recommendedSize: "1920 × 800 px",
    aspectHint: "Laptop landscape ~12:5",
    mobileRecommendedSize: "1080 × 900 px",
    mobileAspectHint: "Phone ~6:5",
    defaultImage: "/images/projects-hero.jpg",
  },
  {
    key: "projects-cta",
    label: "Projects — CTA Banner",
    description: "Bottom / mid CTA banner on Projects page.",
    recommendedSize: "1400 × 600 px",
    aspectHint: "Laptop landscape ~7:3",
    mobileRecommendedSize: "1080 × 720 px",
    mobileAspectHint: "Phone ~3:2",
    defaultImage: "/images/project-cta-house.jpg",
  },
];

export function getBannerPageMeta(key: string): BannerPageMeta | undefined {
  return BANNER_PAGES.find((p) => p.key === key);
}

export function isBannerPageKey(value: string): value is BannerPageKey {
  return BANNER_PAGES.some((p) => p.key === value);
}
