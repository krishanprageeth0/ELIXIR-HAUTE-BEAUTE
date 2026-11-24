import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, category, image, beforeImage, description, featured } = body;

    const item = await prisma.galleryItem.create({
      data: {
        title,
        category: category || "EDITORIAL",
        image,
        beforeImage: beforeImage || null,
        description: description || null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }
}
