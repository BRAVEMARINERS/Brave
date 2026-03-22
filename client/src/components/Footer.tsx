import { CDN } from "@shared/constants";
import { Link } from "wouter";
import { Anchor, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200 border-t border-navy-800/50">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={CDN.LOGO} alt="BraveMarines" className="h-10 w-auto" />
              <div>
                <span className="text-lg font-bold text-white font-sans">Brave</span>
                <span className="text-lg font-bold text-gold-400 font-sans">Marines</span>
              </div>
            </div>
            <p className="text-sm text-navy-300 leading-relaxed font-sans">
              The leading maritime recruitment platform connecting skilled seafarers with top shipping companies worldwide.
            </p>
            <div className="flex items-center gap-2 text-gold-400">
              <Anchor className="h-4 w-4" />
              <span className="text-sm font-sans font-medium">Fair Winds & Following Seas</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold font-sans mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/jobs", label: "Browse Jobs" },
                { href: "/seafarers", label: "Find Seafarers" },
                { href: "/companies", label: "Companies" },
                { href: "/blog", label: "Maritime Blog" },
                { href: "/register", label: "Register Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 hover:text-gold-400 transition-colors font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold font-sans mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: "/page/about", label: "About Us" },
                { href: "/page/privacy", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 hover:text-gold-400 transition-colors font-sans">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-sans mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                info@bravemarines.com
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                +961 XX XXX XXX
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-300 font-sans">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0" />
                Beirut, Lebanon
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800/50">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-400 font-sans">
            &copy; {new Date().getFullYear()} BraveMarines. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/page/privacy" className="text-xs text-navy-400 hover:text-gold-400 transition-colors font-sans">
              Privacy Policy
            </Link>
            <Link href="/page/about" className="text-xs text-navy-400 hover:text-gold-400 transition-colors font-sans">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
