import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        schedules: { orderBy: { dayOfWeek: "asc" } },
        appointments: {
          take: 5,
          orderBy: { date: "desc" },
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Staff GET [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch staff details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.title && { title: body.title }),
        ...(body.bio && { bio: body.bio }),
        ...(body.photo && { photo: body.photo }),
        ...(body.experienceYears !== undefined && { experienceYears: parseInt(body.experienceYears, 10) }),
        ...(body.specializations && { specializations: body.specializations }),
        ...(body.instagram !== undefined && { instagram: body.instagram }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    // Update schedules if provided
    if (body.schedules && Array.isArray(body.schedules)) {
      for (const sch of body.schedules) {
        if (sch.id) {
          await prisma.staffSchedule.update({
            where: { id: sch.id },
            data: {
              startTime: sch.startTime,
              endTime: sch.endTime,
              isWorking: sch.isWorking,
              breakStart: sch.breakStart,
              breakEnd: sch.breakEnd,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, staff: updated });
  } catch (error) {
    console.error("Staff PATCH error:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Staff removed" });
  } catch (error) {
    console.error("Staff DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
