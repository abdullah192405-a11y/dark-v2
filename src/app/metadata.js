import { SITE_CONFIG } from "@/lib/seo";

export const metadata = {
  title: SITE_CONFIG.siteName,
  description: SITE_CONFIG.siteDescription,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.siteName,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  icons: {
    icon: [
      {
        url: "/logo.JPG",
        sizes: "any",
        type: "image/jpeg",
      },
      {
        url: "/logo.JPG",
        sizes: "192x192",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/logo.JPG",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/logo.JPG",
        sizes: "32x32",
      },
      {
        rel: "apple-touch-icon",
        url: "/logo.JPG",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_CONFIG.siteName,
  },
  openGraph: {
    type: "website",
    url: SITE_CONFIG.siteUrl,
    title: SITE_CONFIG.siteName,
    description: SITE_CONFIG.siteDescription,
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/logo.JPG`,
        width: 192,
        height: 192,
        alt: SITE_CONFIG.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.siteName,
    description: SITE_CONFIG.siteDescription,
    creator: "@clickcarmotors",
    images: ["/logo.JPG"],
  },
};
