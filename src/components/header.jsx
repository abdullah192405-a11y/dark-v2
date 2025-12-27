"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout, Menu, Loader2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";


const navItems = [
  { name: "الصفحة الرئيسية", href: "/" },
  { name: "عن المتجر", href: "/about" },
  { name: "السيارات", href: "/cars" },
  { name: "البنوك", href: "/banks" },
  { name: "الشركات", href: "/companies" },
  { name: "اراء العملاء", href: "/reviews" },
  { name: "مقالات", href: "/articles" },
  { name: "تواصل معنا", href: "/contact" },
   { name:"", href: "" }
  
];


const Header = ({ isAdminPage = false }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user: clerkUser, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!isLoaded) {
        console.log("⏳ Clerk not loaded yet...");
        return;
      }

      if (!clerkUser) {
        console.log("❌ No user logged in");
        setIsAdmin(false);
        setRoleLoading(false);
        return;
      }

      console.log("====== FETCHING ROLE ======");
      console.log("User ID:", clerkUser.id);
      console.log("Email:", clerkUser.primaryEmailAddress?.emailAddress);

      setRoleLoading(true);

      try {
        // Fetch role from your API/Supabase
        const response = await fetch('/api/user/role', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Role from API:", data.role);
          setIsAdmin(data.role === "ADMIN");
        } else {
          console.log("⚠️ API call failed, checking Clerk metadata");
          // Fallback to Clerk metadata
          const clerkRole = clerkUser.publicMetadata?.role;
          setIsAdmin(clerkRole === "ADMIN");
        }
      } catch (error) {
        console.error("❌ Error fetching role:", error);
        // Fallback to Clerk metadata
        const clerkRole = clerkUser.publicMetadata?.role;
        setIsAdmin(clerkRole === "ADMIN");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [clerkUser, isLoaded]);

  // Debug log
  console.log("====== HEADER STATE ======");
  console.log("isLoaded:", isLoaded);
  console.log("clerkUser exists:", !!clerkUser);
  console.log("roleLoading:", roleLoading);
  console.log("isAdmin:", isAdmin);
  console.log("=========================");

  return (
    <header className="fixed top-0 w-full bg-[#000000] backdrop-blur-none z-50 border-b">
      <nav className="mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
        {/* CarLogo */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2 md:mr-12">
          <Image
            src={"/logo1.png"}
            alt="click_car_logo"
            width={100}
            height={60}
            className="object-contain h-12 w-auto"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight text-white">Admin</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                // Dispatch custom event to show loading immediately
                window.dispatchEvent(new CustomEvent('startLoading'));
                router.push(item.href);
              }}
              className="text-white hover:text-yellow-600 transition-colors text-sm font-medium"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen} suppressHydrationWarning>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]" suppressHydrationWarning>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="mt-4"></div>
                  {navItems.map((item) => (
                    <Button key={item.href} variant="ghost" className="justify-start text-lg font-medium" onClick={() => {
                      setOpen(false);
                      // Dispatch custom event to show loading immediately
                      window.dispatchEvent(new CustomEvent('startLoading'));
                      router.push(item.href);
                    }}>
                      {item.name}
                    </Button>
                  ))}
                  
                  <SignedIn>
                    {roleLoading ? (
                      <div className="flex justify-center py-2">
                        <Loader2 className="animate-spin" size={20} />
                      </div>
                    ) : isAdmin ? (
                      <Button variant="ghost" className="justify-start text-lg font-medium" onClick={() => {
                        setOpen(false);
                        // Dispatch custom event to show loading immediately
                        window.dispatchEvent(new CustomEvent('startLoading'));
                        router.push('/admin');
                      }}>
                        <Layout size={18} className="ml-2" />
                        لوحة الإدارة
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" className="justify-start text-lg font-medium" onClick={() => {
                          setOpen(false);
                          // Dispatch custom event to show loading immediately
                          window.dispatchEvent(new CustomEvent('startLoading'));
                          router.push('/saved-cars');
                        }}>
                          <CarFront size={18} className="ml-2" />
                          السيارات المحفوظة
                        </Button>
                        <Button variant="ghost" className="justify-start text-lg font-medium" onClick={() => {
                          setOpen(false);
                          // Dispatch custom event to show loading immediately
                          window.dispatchEvent(new CustomEvent('startLoading'));
                          router.push('/reservations');
                        }}>
                          <Heart size={18} className="ml-2" />
                          حجوزاتي
                        </Button>
                      </>
                    )}
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <SignedIn>
            {/* Debug display
            {isLoaded && !roleLoading && (
              <div className="hidden md:flex items-center gap-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                <span>isAdmin: {isAdmin ? "TRUE" : "FALSE"}</span>
              </div>
            )} */}

            {isAdminPage ? (
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                // Dispatch custom event to show loading immediately
                window.dispatchEvent(new CustomEvent('startLoading'));
                router.push('/');
              }}>
                <span className="hidden md:inline">العودة للتطبيق</span>
                <ArrowLeft size={18} />
              </Button>
            ) : roleLoading ? (
              <div className="hidden md:flex items-center gap-2">
                <Loader2 className="animate-spin text-white" size={20} />
              </div>
            ) : (
              <>
                {isAdmin ? (
                  <Link href="/admin" className="hidden md:block ml-4">
                    <Button variant="outline" className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 pl-4">
                      <Layout size={18} />
                      <span>لوحة الإدارة</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/saved-cars" className="hidden md:block">
                      <Button className="cursor-pointer flex items-center gap-2">
                        <CarFront size={18} />
                        <span>السيارات المحفوظة</span>
                      </Button>
                    </Link>

                    <Link href="/reservations" className="hidden md:block ml-4">
                      <Button variant="outline" className="flex items-center gap-2 pl-4">
                        <Heart size={18} />
                        <span>حجوزاتي</span>
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" onClick={() => {
                // Dispatch custom event to show loading immediately
                window.dispatchEvent(new CustomEvent('startLoading'));
              }}>تسجيل الدخول</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;