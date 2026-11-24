import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.salonSettings.findFirst();
    if (!settings) {
      settings = await prisma.salonSettings.create({
        data: {
          id: "default",
          salonName: "ÉLIXIR HAUTE BEAUTÉ",
          tagline: "Where Artistry Meets Transcendence",
        },
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Salon Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch salon settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await prisma.salonSettings.upsert({
      where: { id: "default" },
      update: body,
      create: {
        id: "default",
        ...body,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Salon Settings PATCH error:", error);
    return NextResponse.json({ error: "Failed to update salon settings" }, { status: 500 });
  }
}
