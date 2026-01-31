"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import { Cairo } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { arSA } from "@clerk/localizations";
import LoadingBar from "@/components/LoadingBar";
import { SITE_CONFIG } from "@/lib/seo";
import Script from "next/script";
import Head from "next/head";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Remove previously applied theme classes
    document.body.classList.remove("dark", "dark-alt");
    // Apply the selected theme class if not light
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else if (theme === "dark-alt") {
      document.body.classList.add("dark-alt");
    }
  }, [theme]);

  // Handle loading bar for navigation
  useEffect(() => {
    let timeoutId;

    const handleStartLoading = () => {
      setIsLoading(true);
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
    };

    const handleRouteChange = () => {
      setIsLoading(true);
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      // Set loading to false after a short delay to ensure smooth transition
      timeoutId = setTimeout(() => setIsLoading(false), 500);
    };

    // Listen for custom startLoading event
    window.addEventListener('startLoading', handleStartLoading);

    // Listen for pathname changes
    if (pathname) {
      handleRouteChange();
    }

    return () => {
      window.removeEventListener('startLoading', handleStartLoading);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname]);

  // Handle initial page load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  // Function to cycle through themes but no button shown
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("dark-alt");
    } else {
      setTheme("light");
    }
  };

  // The toggleTheme function is available for programmatic control or future use
  const isSignUpPage = pathname && pathname.includes("/sign-up");

  return (
    // wrapping the app in clerk
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={arSA}
    >
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <head>
          {/* Meta Tags for SEO */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={SITE_CONFIG.description} />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          
          {/* Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={SITE_CONFIG.name} />
          <meta property="og:description" content={SITE_CONFIG.description} />
          <meta property="og:url" content={SITE_CONFIG.url} />
          <meta property="og:image" content={`${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`} />
          <meta property="og:locale" content={SITE_CONFIG.locale} />
          
          {/* Twitter Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
          <meta name="twitter:title" content={SITE_CONFIG.name} />
          <meta name="twitter:description" content={SITE_CONFIG.description} />
          <meta name="twitter:image" content={`${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`} />
          
          {/* Search Engine Verification */}
          {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
            <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
          )}
          
          {/* Canonical URL */}
          <link rel="canonical" href={SITE_CONFIG.url} />
          
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://zafndavpzgpcbqgvosbt.supabase.co" />
          
          {/* Alternate language links */}
          <link rel="alternate" hrefLang="ar-SA" href={SITE_CONFIG.url} />
          <link rel="alternate" hrefLang="x-default" href={SITE_CONFIG.url} />
          
          {/* Manifest for PWA */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Apple Icon */}
          <link rel="apple-touch-icon" href="/logo1.png" sizes="180x180" />
          
          {/* Favicon - Multiple sizes for better compatibility */}
          <link rel="icon" href="/logo1.png" sizes="any" />
          <link rel="icon" href="/logo1.png" type="image/png" sizes="32x32" />
          <link rel="icon" href="/logo1.png" type="image/png" sizes="16x16" />
          <link rel="icon" href="/logo1.png" type="image/png" sizes="192x192" />
          
          {/* Shortcut icon for browsers */}
          <link rel="shortcut icon" href="/logo1.png" type="image/png" />
        </head>
        <body
          className={cairo.className}
          style={{
            backgroundColor: "black",
          }}
          suppressHydrationWarning
        >
          {!isSignUpPage && <Header />}
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {!isSignUpPage && <Footer />}
          {isLoading && <LoadingBar />}

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
          <script
            async
            type="text/javascript"
            src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=pk_686aed2d660777c2c5a332503b574bea12"
          ></script>
        </body>
      </html>
    </ClerkProvider>
  );
}
