"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, User, ShieldCheck, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Stylists", href: "/stylists" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isCurrent = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#111111]/90 backdrop-blur-md border-b border-[#C8A46A]/20 py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#C8A46A]/60 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 group-hover:border-[#C8A46A]">
              <span className="font-serif text-sm text-[#C8A46A] font-bold">É</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl text-[#F8F6F2] tracking-[0.25em] uppercase font-light">
                Élixir
              </span>
              <span className="text-[9px] text-[#C8A46A] tracking-[0.3em] uppercase -mt-1 font-medium">
                Haute Beauté
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isCurrent(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300 py-1"
                >
                  <span
                    className={
                      active
                        ? "text-[#C8A46A]"
                        : "text-[#E8DDCE]/80 hover:text-[#F8F6F2]"
                    }
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8A46A]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-[#C8A46A]/10 text-[#C8A46A] border border-[#C8A46A]/40 hover:bg-[#C8A46A]/20 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A46A]" />
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-[#1B1B1B] text-[#E8DDCE] border border-white/10 hover:border-[#C8A46A]/40 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#C8A46A]" />
                    {user.name.split(" ")[0]}
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs text-[#E8DDCE]/70 hover:text-[#F8F6F2] tracking-[0.15em] uppercase font-medium transition-colors px-2 py-1"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/book"
              className="relative group overflow-hidden px-5 py-2.5 rounded-none bg-gradient-to-r from-[#C8A46A] to-[#D8B57B] text-[#111111] font-medium text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,164,106,0.4)] hover:brightness-110 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/book"
              className="px-3.5 py-1.5 text-[11px] tracking-wider uppercase font-semibold bg-[#C8A46A] text-[#111111]"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#E8DDCE] hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#111111]/98 backdrop-blur-2xl flex flex-col pt-24 px-8 pb-10 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-5 my-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-serif text-2xl tracking-[0.15em] uppercase text-[#F8F6F2] hover:text-[#C8A46A] transition-colors flex items-center justify-between border-b border-white/5 pb-3"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#C8A46A]/50" />
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs text-[#929292]">Signed in as {user.name}</div>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="py-3 px-4 bg-[#1B1B1B] text-[#C8A46A] border border-[#C8A46A]/30 text-center uppercase tracking-widest text-xs font-semibold"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="py-3 px-4 bg-[#1B1B1B] text-white border border-white/10 text-center uppercase tracking-widest text-xs font-semibold"
                    >
                      Customer Dashboard
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="py-3 px-4 bg-[#1B1B1B] text-white border border-white/10 text-center uppercase tracking-widest text-xs font-semibold"
                  >
                    Customer Sign In / Register
                  </Link>
                )}

                <Link
                  href="/book"
                  className="py-3.5 bg-[#C8A46A] text-[#111111] text-center uppercase tracking-widest text-xs font-bold shadow-lg shadow-[#C8A46A]/20"
                >
                  Book Your Appointment
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-[11px] text-[#929292] tracking-wider uppercase">
                740 Madison Avenue, New York · +1 (212) 890-7733
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
