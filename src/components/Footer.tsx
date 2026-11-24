import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons/BrandIcons";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#C8A46A]/20 pt-20 pb-12 text-[#929292]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-[#C8A46A]/60 flex items-center justify-center">
                  <span className="font-serif text-base text-[#C8A46A] font-bold">É</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl text-[#F8F6F2] tracking-[0.25em] uppercase font-light">
                    Élixir
                  </span>
                  <span className="text-[10px] text-[#C8A46A] tracking-[0.35em] uppercase -mt-1 font-medium">
                    Haute Beauté · 2027
                  </span>
                </div>
              </Link>

              <p className="text-sm text-[#E8DDCE]/70 max-w-sm leading-relaxed mb-6">
                An international luxury coiffure and aesthetic sanctuary. Where Parisian artistic craft meets cellular skin rejuvenation and architectural precision.
              </p>

              <div className="flex items-center gap-4 text-xs text-[#E8DDCE]/80">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C8A46A] hover:text-[#C8A46A] transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/12128907733"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full border border-white/10 flex items-center gap-2 hover:border-[#C8A46A] hover:text-[#C8A46A] transition-colors text-xs"
                >
                  <span>WhatsApp Concierge</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-sm text-[#F8F6F2] tracking-[0.2em] uppercase mb-5">
              The Maison
            </h4>
            <ul className="space-y-3 text-xs tracking-wider uppercase">
              <li>
                <Link href="/" className="hover:text-[#C8A46A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#C8A46A] transition-colors">
                  Haute Services
                </Link>
              </li>
              <li>
                <Link href="/stylists" className="hover:text-[#C8A46A] transition-colors">
                  Artistic Directors
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C8A46A] transition-colors">
                  Visual Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C8A46A] transition-colors">
                  Philosophy & Space
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C8A46A] transition-colors">
                  Concierge Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Directory */}
          <div>
            <h4 className="font-serif text-sm text-[#F8F6F2] tracking-[0.2em] uppercase mb-5">
              Curated Rituals
            </h4>
            <ul className="space-y-3 text-xs tracking-wider uppercase">
              <li>
                <Link href="/services?category=haircuts-styling" className="hover:text-[#C8A46A] transition-colors">
                  Architectural Cuts
                </Link>
              </li>
              <li>
                <Link href="/services?category=hair-coloring" className="hover:text-[#C8A46A] transition-colors">
                  French Balayage
                </Link>
              </li>
              <li>
                <Link href="/services?category=hair-rebonding" className="hover:text-[#C8A46A] transition-colors">
                  Japanese Rebonding
                </Link>
              </li>
              <li>
                <Link href="/services?category=hair-spa" className="hover:text-[#C8A46A] transition-colors">
                  Waterfall Head Spa
                </Link>
              </li>
              <li>
                <Link href="/services?category=bridal-styling" className="hover:text-[#C8A46A] transition-colors">
                  Bridal Suite
                </Link>
              </li>
              <li>
                <Link href="/services?category=facial-skincare" className="hover:text-[#C8A46A] transition-colors">
                  24K Gold Cellular
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Details */}
          <div>
            <h4 className="font-serif text-sm text-[#F8F6F2] tracking-[0.2em] uppercase mb-5">
              Atelier Location
            </h4>
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A46A] shrink-0 mt-0.5" />
                <span className="text-[#E8DDCE]/80">
                  740 Madison Avenue, Penthouse 4<br />New York, NY 10065
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A46A] shrink-0" />
                <a href="tel:+12128907733" className="hover:text-[#C8A46A] transition-colors">
                  +1 (212) 890-7733
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A46A] shrink-0" />
                <a href="mailto:concierge@elixirhautebeaute.com" className="hover:text-[#C8A46A] transition-colors">
                  concierge@elixirhautebeaute.com
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-2">
                <Clock className="w-4 h-4 text-[#C8A46A] shrink-0 mt-0.5" />
                <div className="text-[#929292]">
                  <p className="text-[#E8DDCE]">Mon – Sun: 09:00 – 20:00</p>
                  <p className="text-[11px] text-[#C8A46A]/80">Private VIP suites available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2027 ÉLIXIR HAUTE BEAUTÉ. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#C8A46A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#C8A46A] transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="text-[#C8A46A]/80 hover:text-[#C8A46A] transition-colors">
              Staff & Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
