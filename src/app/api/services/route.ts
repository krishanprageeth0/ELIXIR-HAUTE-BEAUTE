import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { defaultCategories, defaultServices } from "@/lib/default-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };
    if (featuredOnly) where.isFeatured = true;
    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: "asc" },
      include: {
        _count: { select: { services: true } },
      },
    });

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    if (categories.length > 0 && services.length > 0) {
      return NextResponse.json({ categories, services });
    }
    return NextResponse.json({ categories: defaultCategories, services: defaultServices });
  } catch (error) {
    console.warn("Services GET fallback activated:", error);
    return NextResponse.json({ categories: defaultCategories, services: defaultServices });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, categoryId, description, durationMinutes, price, image, isFeatured } = body;

    if (!name || !categoryId || !description || !price || !image) {
      return NextResponse.json({ error: "Missing required service fields" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Math.floor(Math.random() * 1000);

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        price: parseFloat(price),
        image,
        isFeatured: Boolean(isFeatured),
        isActive: true,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Service POST error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
