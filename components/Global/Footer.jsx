import { poppins } from "@/app/page";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  company: [
    { title: "About Us", href: "/about" },
    { title: "Our Story", href: "/story" },
    // { title: "Careers", href: "/careers" },
    // { title: "Press", href: "/press" }
  ],
  support: [
    { title: "Contact", href: "/contact" },
    { title: "Order Tracking", href: "/order-tracking" },
    // { title: "Shipping Info", href: "/shipping" },
    // { title: "Returns", href: "/returns" },
  ],
  legal: [
    { title: "Terms of Service", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className={`bg-gray-900 mt-1 ${poppins.variable}`}>
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">zendor</h2>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Elevating interiors with artistic precision. Explore premium
                wallpapers, wooden floorings, and acoustic panels tailored for
                timeless elegance.
              </p>
            </div>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} />
                <span>myzendor@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} />
                <span>+91 84339 00692 </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin size={18} />
                <span>
                  10:00 AM – 8:00 PM IST <br />
                  Mon – Sun
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Explore</h3>
            <div className="grid grid-cols-1 gap-3">
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Customer Care</h3>
            <div className="grid grid-cols-1 gap-3">
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} zendor. Crafted with elegance.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
