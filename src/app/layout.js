import React from "react";
import "./globals.css";
import { Cairo } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";
import { SITE_CONFIG } from "@/lib/seo";
import Script from "next/script";
import ClientWrapper from "@/components/ClientWrapper";
import { headers } from "next/headers";
import { getLogoByType } from "@/actions/site-management";
import { db } from "@/lib/prisma";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [{
      url: SITE_CONFIG.defaultOgImage,
      width: 1200,
      height: 630,
      alt: SITE_CONFIG.name,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultOgImage],
    creator: SITE_CONFIG.twitterHandle,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
  },
};

export default async function RootLayout({ children }) {
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "";
  const isSignUpPage = pathname.includes("/sign-up");

  // Fetch all layout data on server in parallel
  const [navLogoRes, footerLogoRes, socialLinks, storeInfo] = await Promise.all([
    getLogoByType("navbar"),
    getLogoByType("footer"),
    db.socialMedia.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    db.storeInfo.findFirst()
  ]);

  const navLogo = navLogoRes?.data;
  const footerData = {
    logo: footerLogoRes?.data,
    socialLinks: socialLinks || [],
    storeInfo: storeInfo
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={arSA}
    >
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <head>
          <meta name="theme-color" content="#000000" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://zafndavpzgpcbqgvosbt.supabase.co" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/logo1.png" sizes="180x180" />
          <link rel="icon" href="/logo1.png" sizes="any" />
          <link rel="icon" href="/logo1.png" type="image/png" sizes="32x32" />
        </head>
        <body
          className={cairo.className}
          style={{
            backgroundColor: "black",
          }}
          suppressHydrationWarning
        >
          <ClientWrapper
            isSignUpPage={isSignUpPage}
            navLogo={navLogo}
            footerData={footerData}
          >
            {children}
          </ClientWrapper>

          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      page_path: window.location.pathname,
                      page_title: document.title,
                      language: 'ar',
                      region: 'SA'
                    });
                  `,
                }}
              />
            </>
          )}

          {/* Klaviyo Script */}
          <Script
            id="klaviyo-script"
            strategy="lazyOnload"
            src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=pk_686aed2d660777c2c5a332503b574bea12"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
