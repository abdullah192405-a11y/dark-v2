"use client";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, Heart, Eye, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import ChatBot from "@/components/ChatBot";
import { useEffect, useRef } from "react";

export default function About() {
  // Refs for sections to observe
  const sectionRefs = useRef([]);

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

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="pt-20 flex flex-col bg-black-50">
      {/* من نحن */}
      <section ref={addToRefs} className="py-16 px-6 md:px-12 bg-black scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">من نحن</h1>
            <p className="text-lg text-black-600 max-w-4xl mx-auto leading-relaxed">
              Click Car AI هي المنصة الرائدة في الشرق الأوسط للبحث عن السيارات باستخدام تقنية الذكاء الاصطناعي. نحن نجمع بين الخبرة في مجال السيارات والتكنولوجيا المتقدمة لنوفر تجربة شراء فريدة ومضمونة لعملائنا.
            </p>
          </div>
        </div>
      </section>

      {/* رؤيتنا */}
      <section ref={addToRefs} className="py-16 px-6 md:px-12 bg-black-50 scroll-animate">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
              
                <h2 className="text-3xl font-bold">رؤيتنا</h2>
              </div>
              <p className="text-black-600 mb-4 leading-relaxed">
                أن نكون المنصة الأولى في المنطقة لشراء وبيع السيارات، حيث يعتمد العملاء على الذكاء الاصطناعي لاتخاذ قرارات مدروسة وآمنة في اختيار سياراتهم.
              </p>
              <p className="text-black-600 leading-relaxed">
                نسعى لإحداث ثورة في صناعة السيارات من خلال جعل العملية أكثر شفافية وكفاءة ومتعة.
              </p>
            </div>
            <div className="relative h-80">
              <Image
                src="/background1.jpg"
                alt="رؤيتنا"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* رسالتنا */}
      <section ref={addToRefs} className="py-16 px-6 md:px-12 bg-black scroll-animate">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80">
              <Image
                src="/background2.jpeg"
                alt="رسالتنا"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <div className="flex items-center mb-6">
              
                <h2 className="text-3xl font-bold">رسالتنا</h2>
              </div>
              <p className="text-black-600 mb-4 leading-relaxed">
                تمكين العملاء من العثور على السيارة المثالية من خلال منصة ذكية توفر بحثاً دقيقاً ومعلومات شاملة وخدمات موثوقة.
              </p>
              <p className="text-black-600 leading-relaxed">
                نحن ملتزمون بتقديم أعلى مستويات الجودة والأمان في كل تفاعل مع عملائنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* لماذا Click Car AI؟ */}
      <section ref={addToRefs} className="py-16 px-0 md:px-10 bg-black-50 scroll-animate">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            لماذا Click Car AI؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center hover:shadow-2xl transition border-1 rounded-lg p-6 shadow-xl bg-black">
              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">دقة في البحث</h3>
              <p className="text-black-600">
                استخدام الذكاء الاصطناعي للبحث الدقيق عن السيارات التي تناسب احتياجاتك.
              </p>
            </div>

            <div className="text-center hover:shadow-2xl transition rounded-lg p-6 shadow-xl border-1 bg-black">
              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">فريق متخصص</h3>
              <p className="text-black-600">
                فريق من الخبراء في مجال السيارات والتكنولوجيا يدعمك في كل خطوة.
              </p>
            </div>

            <div className="text-center hover:shadow-2xl transition rounded-lg p-6 shadow-xl border-1 bg-black">
              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">جودة مضمونة</h3>
              <p className="text-black-600">
                جميع السيارات موثقة ومعتمدة من وكالات موثوقة.
              </p>
            </div>

            <div className="text-center hover:shadow-2xl transition rounded-lg p-6 shadow-xl border-1 bg-black">
              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">رضا العملاء</h3>
              <p className="text-black-600">
                آلاف العملاء الراضين يثقون بمنصتنا لشراء سياراتهم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={addToRefs} className="py-16 px-0 md:px-4 dotted-background text-black scroll-animate">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            انضم إلينا اليوم
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            ابدأ رحلتك في العثور على سيارة أحلامك مع Click Car AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">تصفح السيارات</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">إنشاء حساب</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}
