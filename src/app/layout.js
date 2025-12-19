"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Cairo } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { arSA } from "@clerk/localizations";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

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
