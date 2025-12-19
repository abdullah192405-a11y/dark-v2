"use client";

import { Card } from "@/components/ui/card";
import HomeSearch from "@/components/HomeSearch";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Car, Calendar, Shield, Search, Brain, Zap } from "lucide-react";
import Image from "next/image";

import { bodyTypes, faqItems } from "@/lib/data";
import CarCard from "@/components/CarCard";
import Link from "next/link";
import FeaturedBrandCard from "@/components/FeaturedBrandCard";
import BankCard from "@/components/BankCard";
import ReviewCard from "@/components/ReviewCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";
import { getFeaturedCars } from "@/actions/home";
import { getFeaturedBrands } from "@/actions/featured-brands";
import { getFeaturedModels } from "@/actions/featured-models";
import { getBanks } from "@/actions/banks";
import { useEffect, useState, useRef } from "react";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";

import BackgroundMovingObjects from "@/components/BackgroundMovingObjects";
import AdPopup from "@/components/AdPopup";
const LetterByLetterText = ({ text, delay = 50, startDelay = 0, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, delay);
        
        return () => clearTimeout(timeout);
      }
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [currentIndex, text, delay, startDelay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};
export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredBrands, setFeaturedBrands] = useState([]);
  const [featuredModels, setFeaturedModels] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBrandsLoading, setIsBrandsLoading] = useState(true);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isBanksLoading, setIsBanksLoading] = useState(true);
  const [heroVideoSrc, setHeroVideoSrc] = useState("/https://res.cloudinary.com/dshvevzgv/video/upload/v1766159273/hero1_hv4wxn.mp4");
  const [sectionVideoSrc, setSectionVideoSrc] = useState("/sectionBG4.mp4");
  const [featuredVideoSrc, setFeaturedVideoSrc] = useState("/featured.mp4");
  const [brandsVideoSrc, setBrandsVideoSrc] = useState("/");
  const [ctaVideoSrc, setCtaVideoSrc] = useState("/sectionBG5.mp4");
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  // Refs for sections to observe
  const sectionRefs = useRef([]);
  const aboutVideoRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setIsLoading(true);
        const result = await getFeaturedCars();
        if (result?.success && result?.data) {
          setFeaturedCars(result.data);
        }
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      } finally {
        setIsLoading(false);
      }
    };


    const fetchFeaturedBrands = async () => {
      try {
        setIsBrandsLoading(true);
        const result = await getFeaturedBrands();
        if (result?.success && result?.data) {
          setFeaturedBrands(result.data);
        }
      } catch (error) {
        console.error("Error fetching featured brands:", error);
      } finally {
        setIsBrandsLoading(false);
      }
    };

    const fetchFeaturedModels = async () => {
      try {
        setIsModelsLoading(true);
        const result = await getFeaturedModels();
        if (result?.success && result?.data) {
          setFeaturedModels(result.data);
        }
      } catch (error) {
        console.error("Error fetching featured models:", error);
      } finally {
        setIsModelsLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        setIsBanksLoading(true);
        const result = await getBanks();
        if (result?.success && result?.data) {
          setBanks(result.data);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setIsBanksLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        setIsReviewsLoading(true);
        const response = await fetch('/api/reviews');
        const result = await response.json();
        if (result?.success && result?.data) {
          setReviews(result.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    fetchFeaturedCars();
    fetchFeaturedBrands();
    fetchFeaturedModels();
    fetchBanks();
    fetchReviews();
  }, []);

  // Handle hero video src based on screen size
  useEffect(() => {
    const updateVideoSrc = () => {
      const isMobile = window.innerWidth <= 768;
      setHeroVideoSrc(isMobile ? "/https://res.cloudinary.com/dshvevzgv/video/upload/v1766159273/hero1_hv4wxn.mp4" : "/https://res.cloudinary.com/dshvevzgv/video/upload/v1766159273/hero1_hv4wxn.mp4");
    };

    updateVideoSrc(); // Set initial src

    window.addEventListener("resize", updateVideoSrc);
    return () => window.removeEventListener("resize", updateVideoSrc);
  }, []);

  // Handle CTA video src based on screen size
  useEffect(() => {
    const updateCtaVideoSrc = () => {
      const isMobile = window.innerWidth <= 768;
      setCtaVideoSrc(isMobile ? "/sectionBG5-mobile.mp4" : "/sectionBG5.mp4");
    };

    updateCtaVideoSrc(); // Set initial src

    window.addEventListener("resize", updateCtaVideoSrc);
    return () => window.removeEventListener("resize", updateCtaVideoSrc);
  }, []);

  // Handle Featured Cars video src based on screen size
  useEffect(() => {
    const updateFeaturedVideoSrc = () => {
      const isMobile = window.innerWidth <= 768;
      setFeaturedVideoSrc(isMobile ? "/featured-mobile.mp4" : "/featured.mp4");
    };

    updateFeaturedVideoSrc(); // Set initial src

    window.addEventListener("resize", updateFeaturedVideoSrc);
    return () => window.removeEventListener("resize", updateFeaturedVideoSrc);
  }, []);

  // Handle Why choose us section video src
  useEffect(() => {
    const updateSectionVideoSrc = () => {
      setSectionVideoSrc("/sectionBG4.mp4");
    };

    updateSectionVideoSrc(); // Set initial src

    window.addEventListener("resize", updateSectionVideoSrc);
    return () => window.removeEventListener("resize", updateSectionVideoSrc);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Check if window width is mobile
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) return; // Only run on mobile

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            // Optionally unobserve after animation to improve performance
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before reaching viewport
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  

  // Intersection Observer for About video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && aboutVideoRef.current) {
            aboutVideoRef.current.play().catch(() => {
              // Autoplay failed, but video is ready
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: "0px 0px 0px 0px",
      }
    );

    if (aboutVideoRef.current) {
      observer.observe(aboutVideoRef.current.parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="pt-20 flex flex-col bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-48 md:pt-24 md:pb-48 lg:pt-32 lg:pb-60">
        <video
          key={heroVideoSrc} // Force re-render on src change
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={heroVideoSrc}
          autoPlay
          muted
          loop
          playsInline
        ></video>
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-48 gradient-fade-to-black z-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
         <div className="mb-24 mt-8">
  <h1 className="text-5xl md:text-6xl lg:text-7xl mb-4 text-white font-bold leading-tight mx-4 md:mx-0">
    <LetterByLetterText 
      text="ابحث عن سيارة أحلامك مع كليك كار " 
      delay={50}
      startDelay={100}
    />
  </h1>
  <p className="text-xl text-white mb-4 max-w-2xl mx-auto">
    <LetterByLetterText 
      text="بحث ذكي عن السيارات واختبار القيادة من بين مئات المركبات." 
      delay={30}
      startDelay={100}
    />
  </p>
</div>

          {/* Search */}
          <div className="md:animate-none animate-fade-in-up animation-delay-400">
            <HomeSearch />
          </div>
        </div>
      </section>


        {/* About Section - Enhanced with Glassmorphism and Interactivity */}
      <section ref={addToRefs} className="py-20 px-6 md:px-12 scroll-animate relative">
        {/* Background video */}
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-500/5 rounded-3xl -z-10"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Content - Right Side (displayed first on mobile, second on desktop) */}
            <div className="text-right space-y-6 order-2 md:order-1 animate-fade-in-up animation-delay-200">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                عن كليك كار   
              </h2>

              <div className="space-y-4">
                <div className="flex items-start justify-end space-x-4 space-x-reverse">
                  <p className="text-white/90 leading-relaxed text-lg flex-1">
                    نحن منصة رائدة في مجال البحث عن السيارات وحجز اختبارات القيادة في المنطقة.
                    نوفر لك تجربة سلسة وآمنة للعثور على سيارة أحلامك من بين مئات الخيارات المتاحة.
                  </p>
                  
                </div>

                <div className="flex items-start justify-end space-x-4 space-x-reverse">
                  <p className="text-white/90 leading-relaxed text-lg flex-1">
                    مع تقنيات الذكاء الاصطناعي المتقدمة، نساعدك على اتخاذ القرار الصحيح
                    من خلال توفير معلومات دقيقة ومقارنات شاملة بين المركبات المختلفة.
                  </p>
                 
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 border-2 border-yellow-400/50"
                  asChild
                >
                  <Link href="/about" className="flex items-center space-x-2 space-x-reverse">
                    <span>اعرف المزيد</span>
                    {/* <Zap className="h-5 w-5" /> */}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image - Left Side (displayed second on mobile, first on desktop) */}
            <div className="relative order-1 md:order-2 animate-fade-in-up animation-delay-400">
              <div className="relative w-full max-w-lg mx-auto group">
                <div className="relative rounded-3xl">
                
                  <img
                    src="/icon-about.png"
                    alt="About Click Car AI"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




    {/* Featured Cars */}
<section ref={addToRefs} className="py-12 px-6 md:px-12 scroll-animate relative">
  {/* Background video */}
  <video
    key={featuredVideoSrc} // Force re-render on src change
    className="absolute inset-0 w-full h-full object-cover z-0"
    src={featuredVideoSrc}
    autoPlay
    muted
    loop
    playsInline
  ></video>
  {/* Gradient overlay top */}
  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-5"></div>
  {/* Gradient overlay bottom */}
  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-5"></div>
  {/* Headings */}
  <div className="container mx-auto relative z-10">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-white">السيارات المميزة</h2>
      <Button variant="ghost" className="flex items-center" asChild>
        <Link href={`/cars`}>
          عرض الكل <ChevronLeft className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
    {/* Featured Cars Car-card*/}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading ? (
        // Loading skeleton
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="group relative rounded-lg shadow-md p-4 animate-pulse overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-300/50 backdrop-blur-md bg-white/70 hover:bg-gradient-to-t hover:from-amber-400/40 hover:to-white/70">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))
      ) : featuredCars?.length > 0 ? (
        featuredCars.map((car) => {
          return <CarCard key={car.id} car={car} isFeatured={true} />;
        })
      ) : (
        <div className="col-span-full text-center py-8 text-white">
          لا توجد سيارات مميزة متاحة حالياً
        </div>
      )}
    </div>
  </div>
</section>

      
{/* Banks Section */}
      <section ref={addToRefs} className="py-6 px-6 md:px-12 scroll-animate">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">البنوك الشريكة</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href={`/banks`}>

                عرض الكل <ChevronLeft className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isBanksLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-xl p-6 animate-pulse" />
              ))
            ) : banks?.length > 0 ? (
              banks.slice(0, 6).map((bank) => (
                <div key={bank.id || bank.name} className="h-full w-full">
                  <BankCard bank={bank} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                لا توجد بنوك متاحة حالياً
              </div>
            )}
          </div>
        </div>
      </section>





      {/* Browse by makes */}
      <section ref={addToRefs} className="py-6 px-6 md:px-12 scroll-animate relative">
        {/* Background video */}
        <video
          key={brandsVideoSrc} // Force re-render on src change
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={brandsVideoSrc}
          autoPlay
          muted
          loop
          playsInline
        ></video>
        {/* Gradient overlay top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-5"></div>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-5"></div>
        {/* wrapper div */}
        <div className="container mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">الشركات المميزة</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href={`/companies`}>
                عرض الكل <ChevronLeft className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Makes*/}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isBrandsLoading ? (
              // Loading skeleton
             Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-xl p-4 animate-pulse">
                  <div className="h-16 bg-gray-200/20 rounded"></div>
                </div>
              ))
            ) : featuredBrands?.length > 0 ? (
              featuredBrands.map((brand) => {
                return <FeaturedBrandCard key={brand.id} brand={brand} />;
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                لا توجد علامات تجارية متاحة حالياً
              </div>
            )}
          </div>
        </div>
      </section>




      {/* Why choose us */}
      <section ref={addToRefs} className="py-12 px-0 md:px-10 scroll-animate relative">
        {/* Background video */}
        <video
          key={sectionVideoSrc} // Force re-render on src change
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={sectionVideoSrc}
          autoPlay
          muted
          loop
          playsInline
        ></video>
        {/* Gradient overlay top */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-5"></div>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            لماذا تختار منصتنا
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="text-center hover:shadow-2xl transition border border-white/20 rounded-md mt-4 p-4 shadow-xl bg-black/50 backdrop-blur-lg bg-white/20 text-white">
              <div className="bg-black text-black-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">تشكيلة واسعة</h3>
              <p className="text-white">
                آلاف المركبات الموثقة من وكالات معتمدة وبائعين خاصين.
              </p>
            </div>

            <div className="text-center hover:shadow-2xl transition border border-white/20 rounded-md mt-4 shadow-xl p-4 bg-black/50 backdrop-blur-lg bg-white/20 text-white">
              <div className="bg-black text-black-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">اختبار قيادة سهل</h3>
              <p className="text-white">
                احجز اختبار القيادة عبر الإنترنت في دقائق، مع خيارات جدولة مرنة.
              </p>
            </div>

            <div className="text-center hover:shadow-2xl transition border border-white/20 rounded-md mt-4 shadow-xl p-4 bg-black/50 backdrop-blur-lg bg-white/20 text-white">
              <div className="bg-black text-black-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">عملية آمنة</h3>
              <p className="text-white">
                قوائم موثقة وعملية حجز آمنة لراحة بالك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section
      <section ref={addToRefs} className="py-12 px-6 md:px-12 scroll-animate">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">آراء العملاء</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href={`/reviews`}>
                عرض الكل <ChevronLeft className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isReviewsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200/20 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200/20 rounded w-1/2"></div>
                </div>
              ))
            ) : reviews?.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-white">
                لا توجد آراء متاحة حالياً
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* browse by model */}
      <section ref={addToRefs} className="py-6 px-6 md:px-12 scroll-animate">
        {/* wrapper div */}
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">الموديلات المميزة</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href={`/cars`}>
                عرض الكل <ChevronLeft className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* browse models*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          {isModelsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="relative group cursor-pointer rounded-lg animate-pulse h-48 bg-gray-200" />
            ))
          ) : featuredModels?.length > 0 ? (
            featuredModels.map((model) => {
              return (
                       <Link key={model.id} href={`/cars?bodyType=${model.name}`}>
                  <Card className="relative group cursor-pointer rounded-2xl overflow-hidden h-48 md:h-64 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-0">
                    <div className="relative h-full w-full">
                      <Image
                        src={model.image}
                        alt={model.nameAr}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>
    
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">
                        {model.nameAr}
                      </h3>
                      <div className="flex items-center text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <span>استكشف المزيد</span>
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              لا توجد موديلات متاحة حالياً
            </div>
          )}
        </div>
      </section>

      
      {/* FAQs */}
      <section ref={addToRefs} className="py-12 px-12 bg-black text-white scroll-animate">
        <div className="container mx-auto px-4 text-right">
          <h2 className="text-2xl font-bold">الأسئلة الشائعة</h2>

          <Accordion type="single" collapsible className="w-full" dir="rtl" suppressHydrationWarning>
            {faqItems.map((faq, index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`} suppressHydrationWarning>
                  <AccordionTrigger suppressHydrationWarning>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      {/* filter blur-sm */}
      <section ref={addToRefs} className="py-64 md:py-48 px-0 md:px-4 text-white scroll-animate relative">
        <video
          key={ctaVideoSrc} // Force re-render on src change
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={ctaVideoSrc}
          autoPlay
          muted
          loop
          playsInline
        ></video>
        {/* Gradient overlay top */}
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-5"></div>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl font-bold mb-4">
            هل أنت مستعد للعثور على سيارة أحلامك؟
          </h3>
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الراضين الذين وجدوا سيارتهم المثالية من خلال منصتنا.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">عرض جميع السيارات</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">سجل الآن</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* ChatBot Component */}
      <ChatBot onOpenChange={setIsChatBotOpen} />

      {/* Ad Popup */}
      <AdPopup />
    </div>
  );
}
