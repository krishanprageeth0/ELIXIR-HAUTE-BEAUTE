import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import StylistsShowcase from "@/components/home/StylistsShowcase";
import TransformationSection from "@/components/home/TransformationSection";
import TestimonialsAndVip from "@/components/home/TestimonialsAndVip";
import { prisma } from "@/lib/prisma";
import {
  defaultCategories,
  defaultServices,
  defaultStaff,
  defaultGalleryItems,
  defaultReviews,
} from "@/lib/default-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: any[] = defaultCategories;
  let services: any[] = defaultServices;
  let staff: any[] = defaultStaff;
  let galleryItems: any[] = defaultGalleryItems;
  let reviews: any[] = defaultReviews;

  try {
    const [dbCategories, dbServices, dbStaff, dbGallery, dbReviews] = await Promise.all([
      prisma.category.findMany({
        orderBy: { orderIndex: "asc" },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { price: "desc" }],
      }),
      prisma.staff.findMany({
        where: { isActive: true },
        orderBy: { rating: "desc" },
      }),
      prisma.galleryItem.findMany({
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (dbServices && dbServices.length > 0) services = dbServices;
    if (dbStaff && dbStaff.length > 0) staff = dbStaff;
    if (dbGallery && dbGallery.length > 0) galleryItems = dbGallery;
    if (dbReviews && dbReviews.length > 0) reviews = dbReviews;
  } catch (error) {
    console.warn("Database fallback activated on HomePage:", error);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#F8F6F2]">
      <Navbar />
      <HeroSection />
      <FeaturedServices categories={categories} services={services} />
      <StylistsShowcase staff={staff} />
      <TransformationSection items={galleryItems} />
      <TestimonialsAndVip reviews={reviews} />
      <Footer />
    </main>
  );
}
