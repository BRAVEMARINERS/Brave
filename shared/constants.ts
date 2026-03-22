export const CDN = {
  LOGO: "https://d2xsxph8kpxj0f.cloudfront.net/310519663462890694/VQ3XGVMcNYK48CKzeu757Z/logo_1cdf965b.png",
  HERO_BG: "https://d2xsxph8kpxj0f.cloudfront.net/310519663462890694/VQ3XGVMcNYK48CKzeu757Z/hero-bg_644dc408.jpg",
  HERO_BG_2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663462890694/VQ3XGVMcNYK48CKzeu757Z/hero-bg-2_d900a5c2.jpg",
  ABOUT_BG: "https://d2xsxph8kpxj0f.cloudfront.net/310519663462890694/VQ3XGVMcNYK48CKzeu757Z/about-bg_8ac02c27.jpg",
  CREW_TEAM: "https://d2xsxph8kpxj0f.cloudfront.net/310519663462890694/VQ3XGVMcNYK48CKzeu757Z/crew-team_32613e08.jpg",
};

export const AVAILABILITY_STATUS = {
  available: { en: "Available", ar: "متاح", color: "bg-emerald-500" },
  onboard: { en: "On Board", ar: "على متن السفينة", color: "bg-blue-500" },
  unavailable: { en: "Unavailable", ar: "غير متاح", color: "bg-red-500" },
} as const;

export const DEPARTMENTS = {
  deck: { en: "Deck", ar: "سطح السفينة" },
  engine: { en: "Engine", ar: "المحرك" },
  catering: { en: "Catering", ar: "التموين" },
  other: { en: "Other", ar: "أخرى" },
} as const;
