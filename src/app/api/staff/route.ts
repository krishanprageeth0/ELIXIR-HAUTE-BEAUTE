import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { defaultStaff } from "@/lib/default-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";

    const staff = await prisma.staff.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        schedules: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
      orderBy: { rating: "desc" },
    });

    if (staff.length > 0) {
      return NextResponse.json({ staff });
    }
    return NextResponse.json({ staff: defaultStaff });
  } catch (error) {
    console.warn("Staff GET fallback activated:", error);
    return NextResponse.json({ staff: defaultStaff });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, title, bio, photo, experienceYears, specializations, instagram, email, phone } = body;

    if (!name || !title || !bio || !photo) {
      return NextResponse.json({ error: "Missing required staff fields" }, { status: 400 });
    }

    const newStaff = await prisma.staff.create({
      data: {
        name,
        title,
        bio,
        photo,
        experienceYears: parseInt(experienceYears, 10) || 5,
        rating: 5.0,
        reviewCount: 0,
        specializations: specializations || "Precision Styling",
        instagram: instagram || null,
        email: email || null,
        phone: phone || null,
        isActive: true,
      },
    });

    // Create default 7-day schedule
    for (let day = 0; day <= 6; day++) {
      await prisma.staffSchedule.create({
        data: {
          staffId: newStaff.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          isWorking: day !== 1, // Monday off by default
          breakStart: "13:00",
          breakEnd: "14:00",
        },
      });
    }

    const staffWithSchedule = await prisma.staff.findUnique({
      where: { id: newStaff.id },
      include: { schedules: true },
    });

    return NextResponse.json({ success: true, staff: staffWithSchedule }, { status: 201 });
  } catch (error) {
    console.error("Staff POST error:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}
