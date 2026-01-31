/**
 * SEO Configuration and utilities for كراون أوتو - Crown Auto
 * Market: Saudi Arabia
 */

export const SITE_CONFIG = {
  name: "كراون أوتو",
  englishName: "Crown Auto",
  description: "كراون أوتو - أفضل منصة لشراء وبيع السيارات في السعودية. تصفح آلاف السيارات الجديدة والمستعملة بأفضل الأسعار.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://crownauto.sa",
  locale: "ar-SA",
  lang: "ar",
  defaultOgImage: "/og-image.png",
  twitterHandle: "@crown_auto_sa",
};

export const SAUDI_MARKET_KEYWORDS = {
  primary: [
    "كراون أوتو",
    "شراء سيارات السعودية",
    "سيارات السعودية",
    "بيع سيارات السعودية",
    "سيارات جديدة السعودية",
    "سيارات مستعملة السعودية",
  ],
  secondary: [
    "أسعار السيارات في السعودية",
    "معارض سيارات السعودية",
    "تمويل السيارات السعودية",
    "رخص قيادة السعودية",
    "تأمين السيارات السعودية",
    "صيانة السيارات السعودية",
  ],
  brands: [
    "تويوتا",
    "هيونداي",
    "نيسان",
    "كيا",
    "سكودا",
    "بي ام دبليو",
    "مرسيدس",
    "فورد",
    "جنرال موتورز",
  ],
  locations: [
    "الرياض",
    "جدة",
    "الدمام",
    "الخبر",
    "الظهران",
    "تبوك",
    "جازان",
    "عسير",
    "حائل",
    "القصيم",
  ],
};

export const generateMetadata = ({
  title,
  description,
  keywords = [],
  ogImage = SITE_CONFIG.defaultOgImage,
  ogType = "website",
  canonicalUrl = SITE_CONFIG.url,
  author = SITE_CONFIG.name,
  robots = "index, follow",
  viewport = "width=device-width, initial-scale=1",
  charset = "UTF-8",
  ogLocale = SITE_CONFIG.locale,
} = {}) => {
  const allKeywords = [
    ...SAUDI_MARKET_KEYWORDS.primary,
    ...keywords,
  ].join(", ");

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black",
      title: SITE_CONFIG.name,
    },
    applicationName: SITE_CONFIG.name,
    viewport,
    robots,
    charset,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ar-SA": new URL(SITE_CONFIG.url),
        "en-US": new URL(`https://en.${new URL(SITE_CONFIG.url).hostname}`),
      },
    },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      title,
      description,
      siteName: SITE_CONFIG.name,
      locale: ogLocale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
        {
          url: ogImage,
          width: 800,
          height: 600,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
};

/**
 * Generate structured data (JSON-LD)
 */
export const generateJsonLd = (type, data = {}) => {
  const baseStructure = {
    "@context": "https://schema.org",
  };

  const schemas = {
    organization: {
      ...baseStructure,
      "@type": "Organization",
      name: SITE_CONFIG.name,
      alternateName: SITE_CONFIG.englishName,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/logo.png`,
      description: SITE_CONFIG.description,
      sameAs: [
        "https://twitter.com/crown_auto_sa",
        "https://www.instagram.com/crown_auto_sa",
        "https://www.facebook.com/crown_auto_sa",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        telephone: "+966-XX-XXX-XXXX",
        areaServed: "SA",
        availableLanguage: ["ar", "en"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "SA",
        addressRegion: "Riyadh",
        postalCode: "11537",
      },
    },
    localBusiness: {
      ...baseStructure,
      "@type": "LocalBusiness",
      name: SITE_CONFIG.name,
      image: `${SITE_CONFIG.url}/logo.png`,
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      telephone: "+966-XX-XXX-XXXX",
      address: {
        "@type": "PostalAddress",
        streetAddress: "King Fahd Road",
        addressLocality: "Riyadh",
        addressRegion: "Riyadh",
        postalCode: "11537",
        addressCountry: "SA",
      },
      areaServed: SAUDI_MARKET_KEYWORDS.locations,
      priceRange: "$$",
      sameAs: [
        "https://twitter.com/crown_auto_sa",
        "https://www.instagram.com/crown_auto_sa",
      ],
    },
    product: {
      ...baseStructure,
      "@type": "Product",
      name: data.name || "سيارة",
      description: data.description,
      image: data.image,
      brand: {
        "@type": "Brand",
        name: data.brand || "Unknown",
      },
      offers: {
        "@type": "Offer",
        url: data.url,
        priceCurrency: "SAR",
        price: data.price,
        availability: data.availability || "https://schema.org/InStock",
      },
      aggregateRating: data.rating ? {
        "@type": "AggregateRating",
        ratingValue: data.rating.value,
        ratingCount: data.rating.count,
      } : undefined,
    },
    searchAction: {
      ...baseStructure,
      "@type": "WebSite",
      url: SITE_CONFIG.url,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_CONFIG.url}/cars?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    breadcrumb: {
      ...baseStructure,
      "@type": "BreadcrumbList",
      itemListElement: data.items?.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  };

  return schemas[type] || baseStructure;
};

/**
 * Generate SEO-friendly URL slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .trim("-");
};

/**
 * Generate car listing meta tags
 */
export const generateCarMetadata = (car) => {
  const keywords = [
    `${car.brand} ${car.model}`,
    `${car.brand} ${car.model} ${car.year}`,
    `سيارة ${car.brand}`,
    `${car.brand} ${car.model} السعودية`,
    car.price && `${car.brand} ${car.model} ${car.price}`,
  ].filter(Boolean);

  return generateMetadata({
    title: `${car.brand} ${car.model} ${car.year} | كراون أوتو`,
    description: `${car.brand} ${car.model} ${car.year} - ${car.description || "سيارة"}. السعر: ${car.price} ريال سعودي. اشتر الآن من كراون أوتو.`,
    keywords,
    ogImage: car.image,
    canonicalUrl: `${SITE_CONFIG.url}/cars/${car.id}`,
    ogType: "product",
  });
};

/**
 * Get SEO analytics data
 */
export const SEO_ANALYTICS = {
  pageViewTracking: true,
  eventTracking: true,
  searchTracking: true,
  conversionTracking: true,
};
