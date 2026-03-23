import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CDN } from "@shared/constants";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/jobs", label: "الوظائف" },
    { href: "/seafarers", label: "البحّارة" },
    { href: "/companies", label: "الشركات" },
    { href: "/blog", label: "المدونة" },
    { href: "/feed", label: "المنشورات" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-xl border-b border-navy-800/30">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src={CDN.LOGO} alt="BraveMarines" className="h-10 lg:h-12 w-auto" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white font-sans tracking-wide">Brave</span>
              <span className="text-lg font-bold text-gold-400 font-sans tracking-wide">Marines</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold font-sans transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-gold-400 bg-gold-400/10 shadow-sm shadow-gold-400/10"
                    : "text-navy-200 hover:text-white hover:bg-white/5"
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-navy-200 hover:text-white hover:bg-white/5 h-10">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400/30 to-gold-400/10 border border-gold-400/30 flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-gold-400" />
                        )}
                      </div>
                      <span className="hidden md:inline text-sm font-sans font-bold">{user.name || "مستخدم"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold font-sans">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" /> لوحة الإدارة
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 ml-2" /> تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-navy-200 hover:text-white hover:bg-white/5 font-sans text-sm font-bold hidden sm:inline-flex">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gold-gradient text-navy-950 font-bold font-sans text-sm hover:opacity-90 transition-all glow-gold-sm">
                    ابدأ الآن
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" className="lg:hidden text-navy-200 hover:text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-navy-800/30">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold font-sans transition-all ${
                    isActive(link.href) ? "text-gold-400 bg-gold-400/10" : "text-navy-200 hover:text-white hover:bg-white/5"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
