import { CDN } from "@shared/constants";
import { Link } from "wouter";
import { Anchor, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200 border-t border-navy-800/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src={CDN.LOGO} alt="BraveMarines" className="h-12 w-auto" />
              <div>
                <span className="text-xl font-bold text-white font-sans">Brave</span>
                <span className="text-xl font-bold text-gold-400 font-sans">Marines</span>
              </div>
            </div>
            <p className="text-sm text-navy-300 leading-relaxed font-sans">
              المنصة الرائدة في التوظيف البحري، تربط البحارة المهرة بأفضل شركات الشحن حول العالم.
            </p>
            <div className="flex items-center gap-2 text-gold-400">
              <Anchor className="h-4 w-4" />
              <span className="text-sm font-sans font-bold">رياح مواتية وبحار هادئة</span>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/share/188N6Uvg9q/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-400/10 hover:border-gold-400/30 transition-all">
                <svg className="h-5 w-5 text-navy-300 hover:text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/marinersbrave" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold-400/10 hover:border-gold-400/30 transition-all">
                <svg className="h-5 w-5 text-navy-300 hover:text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-sans mb-5 text-sm uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { href: "/jobs", label: "تصفح الوظائف" },
                { href: "/seafarers", label: "البحث عن بحّارة" },
                { href: "/companies", label: "الشركات" },
                { href: "/blog", label: "المدونة البحرية" },
                { href: "/register", label: "سجّل الآن" },
                { href: "/feed", label: "المنشورات" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 hover:text-gold-400 transition-colors font-sans font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold font-sans mb-5 text-sm uppercase tracking-wider">الموارد</h4>
            <ul className="space-y-3">
              {[
                { href: "/page/about", label: "من نحن" },
                { href: "/page/privacy", label: "سياسة الخصوصية" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 hover:text-gold-400 transition-colors font-sans font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold font-sans mb-5 text-sm uppercase tracking-wider">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-gold-400" />
                </div>
                <a href="mailto:bravemariners@gmail.com" className="hover:text-gold-400 transition-colors">bravemariners@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-gold-400" />
                </div>
                <a href="tel:+963980197471" className="hover:text-gold-400 transition-colors" dir="ltr">+963 980 197 471</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <div className="w-9 h-9 rounded-lg bg-gold-400/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-gold-400" />
                </div>
                سوريا
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800/30">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-400 font-sans">
            &copy; {new Date().getFullYear()} BraveMarines. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/page/privacy" className="text-xs text-navy-400 hover:text-gold-400 transition-colors font-sans">
              سياسة الخصوصية
            </Link>
            <Link href="/page/about" className="text-xs text-navy-400 hover:text-gold-400 transition-colors font-sans">
              من نحن
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
