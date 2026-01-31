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
        url: "/logo1.png",
        sizes: "any",
        type: "image/png",
      },
      {
        url: "/logo1.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo1.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/logo1.png",
        sizes: "32x32",
      },
      {
        rel: "apple-touch-icon",
        url: "/logo1.png",
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
        url: `${SITE_CONFIG.siteUrl}/logo1.png`,
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
    images: ["/logo1.png"],
  },
};
