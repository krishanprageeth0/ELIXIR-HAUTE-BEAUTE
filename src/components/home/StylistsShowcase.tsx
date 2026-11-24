import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Calendar } from "lucide-react";
import { InstagramIcon } from "@/components/icons/BrandIcons";

interface Staff {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specializations: string;
  instagram?: string | null;
}

export default function StylistsShowcase({ staff }: { staff: Staff[] }) {
  return (
    <section className="py-28 bg-[#161616] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-3">
              <span>Haute Artisans</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F8F6F2] font-light tracking-[0.05em] uppercase">
              The Master Artists
            </h2>
          </div>

          <p className="text-sm text-[#929292] max-w-md">
            Our atelier convenes international artistic directors from Paris, Milan, and Tokyo — masters of architectural cuts, French balayage, and clinical aesthetics.
          </p>
        </div>

        {/* Stylists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="group bg-[#111111] border border-white/5 hover:border-[#C8A46A]/50 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#111111]/85 backdrop-blur-md border border-[#C8A46A]/30 text-[11px] text-[#C8A46A] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#C8A46A]" />
                  <span>{member.rating.toFixed(2)}</span>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-4 left-4 text-[10px] tracking-widest uppercase text-[#929292]">
                  {member.experienceYears} Years Atelier Mastery
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#F8F6F2] font-light mb-1 group-hover:text-[#C8A46A] transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs text-[#C8A46A] font-medium tracking-wider uppercase mb-3">
                    {member.title}
                  </div>
                  <p className="text-xs text-[#929292] leading-relaxed line-clamp-2 mb-4">
                    {member.bio}
                  </p>
                  <div className="text-[10px] tracking-widest text-[#E8DDCE]/60 uppercase mb-6">
                    {member.specializations}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  {member.instagram && (
                    <span className="text-[11px] text-[#929292] flex items-center gap-1">
                      <InstagramIcon className="w-3 h-3 text-[#C8A46A]" />
                      <span>{member.instagram}</span>
                    </span>
                  )}
                  <Link
                    href={`/book?stylist=${member.id}`}
                    className="ml-auto inline-flex items-center gap-1.5 text-xs text-[#C8A46A] hover:text-white uppercase tracking-wider font-semibold group-hover:translate-x-1 transition-all"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Stylists Link */}
        <div className="mt-14 text-center">
          <Link
            href="/stylists"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#C8A46A]/30 text-xs tracking-[0.25em] uppercase text-[#E8DDCE] hover:border-[#C8A46A] hover:text-[#C8A46A] transition-colors"
          >
            <span>Meet All Atelier Specialists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
