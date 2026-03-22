import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { CDN } from "@shared/constants";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Bell, User, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/seafarers", label: "Seafarers" },
    { href: "/companies", label: "Companies" },
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-navy-800/50">
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
                className={`px-4 py-2 rounded-lg text-sm font-medium font-sans transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-gold-400 bg-gold-400/10"
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
                      <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-gold-400" />
                      </div>
                      <span className="hidden md:inline text-sm font-sans">{user.name || "User"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold font-sans">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-navy-200 hover:text-white hover:bg-white/5 font-sans text-sm hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gold-gradient text-navy-950 font-semibold font-sans text-sm hover:opacity-90 transition-opacity">
                    Get Started
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
          <div className="lg:hidden py-4 border-t border-navy-800/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium font-sans transition-all ${
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
