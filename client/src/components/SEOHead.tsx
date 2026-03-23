import { useEffect } from "react";
import { useI18n } from "@/i18n";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  canonicalPath?: string;
  noIndex?: boolean;
}

const BASE_URL = "https://bravemariners.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  canonicalPath,
  noIndex = false,
}: SEOHeadProps) {
  const { lang } = useI18n();

  const defaultTitleAr = "BraveMarines - منصة التوظيف البحري";
  const defaultTitleEn = "BraveMarines - Maritime Employment Platform";
  const defaultDescAr = "منصة BraveMarines تربط البحارة المحترفين بشركات الشحن البحري حول العالم. ابحث عن وظائف بحرية، وظف بحارة مؤهلين، وأدر طاقم سفنك.";
  const defaultDescEn = "BraveMarines connects professional seafarers with maritime shipping companies worldwide. Find maritime jobs, hire qualified seafarers, and manage your vessel crew.";

  const fullTitle = title
    ? `${title} | ${lang === "ar" ? "BraveMarines" : "BraveMarines"}`
    : (lang === "ar" ? defaultTitleAr : defaultTitleEn);

  const metaDescription = description || (lang === "ar" ? defaultDescAr : defaultDescEn);
  const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath}` : undefined;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set/create meta tag
    const setMeta = (selector: string, content: string, attr = "content") => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(attrName, attrValue.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };

    // Basic meta
    setMeta('meta[name="description"]', metaDescription);
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[name="robots"]', noIndex ? "noindex,nofollow" : "index,follow");

    // Language
    document.documentElement.lang = lang;

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle, "content");
    setMeta('meta[property="og:description"]', metaDescription, "content");
    setMeta('meta[property="og:image"]', ogImage, "content");
    setMeta('meta[property="og:type"]', ogType, "content");
    setMeta('meta[property="og:locale"]', lang === "ar" ? "ar_SA" : "en_US", "content");
    setMeta('meta[property="og:site_name"]', "BraveMarines", "content");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', metaDescription);
    setMeta('meta[name="twitter:image"]', ogImage);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.rel = "canonical";
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonicalUrl;
    } else if (canonicalEl) {
      canonicalEl.remove();
    }

    // Structured Data (JSON-LD)
    let ldScript = document.getElementById("brave-ld-json") as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "brave-ld-json";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BraveMarines",
      "url": BASE_URL,
      "description": metaDescription,
      "inLanguage": lang === "ar" ? "ar" : "en",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/jobs?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }, [fullTitle, metaDescription, keywords, ogImage, ogType, canonicalUrl, noIndex, lang]);

  return null;
}

// ─── Specific SEO configs for pages ──────────────────────────────────────────
export const SEO_CONFIGS = {
  home: (lang: "ar" | "en") => ({
    title: lang === "ar" ? "الرئيسية" : "Home",
    description: lang === "ar"
      ? "منصة BraveMarines - البوابة الأولى للتوظيف البحري في العالم العربي"
      : "BraveMarines - The #1 Maritime Employment Platform in the Arab World",
    keywords: lang === "ar"
      ? "وظائف بحرية, بحارة, شركات شحن, توظيف بحري, ربان, مهندس بحري"
      : "maritime jobs, seafarers, shipping companies, maritime employment, captain, marine engineer",
    canonicalPath: "/",
  }),
  jobs: (lang: "ar" | "en") => ({
    title: lang === "ar" ? "الوظائف البحرية" : "Maritime Jobs",
    description: lang === "ar"
      ? "ابحث عن أحدث الوظائف البحرية المتاحة حول العالم. فرص عمل للبحارة بجميع الرتب."
      : "Find the latest maritime jobs available worldwide. Employment opportunities for seafarers of all ranks.",
    keywords: lang === "ar"
      ? "وظائف بحرية, وظائف بحارة, عمل على السفن, وظائف ربان, وظائف مهندس بحري"
      : "maritime jobs, seafarer jobs, ship jobs, captain jobs, marine engineer jobs",
    canonicalPath: "/jobs",
  }),
  seafarers: (lang: "ar" | "en") => ({
    title: lang === "ar" ? "البحارة" : "Seafarers",
    description: lang === "ar"
      ? "تصفح ملفات البحارة المحترفين المتاحين للتوظيف. ابحث بالرتبة والجنسية والخبرة."
      : "Browse professional seafarer profiles available for employment. Search by rank, nationality, and experience.",
    canonicalPath: "/seafarers",
  }),
  feed: (lang: "ar" | "en") => ({
    title: lang === "ar" ? "المجتمع البحري" : "Maritime Community",
    description: lang === "ar"
      ? "تواصل مع المجتمع البحري، شارك تجاربك وتابع آخر أخبار صناعة الشحن."
      : "Connect with the maritime community, share your experiences and follow the latest shipping industry news.",
    canonicalPath: "/feed",
  }),
};
