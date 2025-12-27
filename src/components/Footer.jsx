import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Mail, Phone, Video, Youtube } from "lucide-react";
import { SiTiktok, SiWhatsapp, SiSnapchat } from "react-icons/si";

const navItems = [
  { name: "الصفحة الرئيسية", href: "/" },
  { name: "عن المتجر", href: "/about" },
  { name: "السيارات", href: "/cars" },
  { name: "البنوك", href: "/banks" },
  { name: "الشركات", href: "/companies" },
  { name: "اراء العملاء", href: "/reviews" },
  { name: "مقالات", href: "/articles" },
  { name: "تواصل معنا", href: "/contact" },
];

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-black py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo or Brand */}
          <div className="pt-4 text-center md:text-right">
            <Link href="/" className="flex justify-center md:justify-start items-center gap-2 mb-4">
              <Image
                src="/logo33.png"
                alt="click_car_logo"
                width={100}
                height={60}
                className="object-contain h-12 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm">
              ابحث عن سيارتك المثالية مع كراون أوتو
            </p>
          </div>

          {/* Social Media */}
          <div className="pt-4 text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-4">تابعنا</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://www.facebook.com/ClickCar0" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://www.snapchat.com/add/clickcar.sa" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <SiSnapchat size={24} />
              </a>
              <a href="https://www.instagram.com/clickcar_sa/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://www.tiktok.com/@clickcars.sa" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <SiTiktok size={24} />
              </a>
              <a href="https://www.youtube.com/@Clickcar-sa" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
              <a href="https://wa.me/966123456789" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <SiWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-4 text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-4">تواصل معنا</h3>
            <div className="space-y-2 flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <Mail size={18} className="text-gray-300" />
                <span className="text-gray-300">info@crownauto.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} className="text-gray-300" />
                <span className="text-gray-300">+966 123 456 789</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="pt-4 text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-4">روابط سريعة</h3>
            <div className="grid grid-cols-2 gap-2 justify-items-center md:justify-items-start">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    // Dispatch custom event to show loading immediately
                    window.dispatchEvent(new CustomEvent('startLoading'));
                    router.push(item.href);
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Call to Action Section */}
        <div className="pt-4 bg-black mt-2 pb-2">
         
        </div>
        {/* Copyright */}
        <div className="pt-4 border-t border-gray-700 text-center text-gray-300">
          <p>جميع الحقوق محفوظة لدى كراون أوتو 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
