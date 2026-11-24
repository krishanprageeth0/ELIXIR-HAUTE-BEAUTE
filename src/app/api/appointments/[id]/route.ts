import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { timeToMinutes, minutesToTime, isTimeOverlapping } from "@/lib/booking-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findFirst({
      where: {
        OR: [{ id }, { bookingReference: id }],
      },
      include: {
        staff: true,
        appointmentServices: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const settings = await prisma.salonSettings.findFirst();

    return NextResponse.json({ appointment, settings });
  } catch (error) {
    console.error("Appointment GET [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await getCurrentUser();

    const existing = await prisma.appointment.findFirst({
      where: {
        OR: [{ id }, { bookingReference: id }],
      },
      include: {
        staff: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Permission check: if customer, must own the appointment
    if (user && user.role !== "ADMIN") {
      if (existing.customerId !== user.userId && existing.customerEmail !== user.email) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
      }
    }

    // Cancellation flow
    if (body.action === "CANCEL" || body.status === "CANCELLED") {
      const updated = await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          status: "CANCELLED",
          cancellationReason: body.cancellationReason || "Cancelled by client",
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          role: "ADMIN",
          title: "Appointment Cancelled",
          message: `Booking ${existing.bookingReference} for ${existing.customerName} on ${existing.date} was cancelled.`,
          link: `/admin/appointments`,
        },
      });

      return NextResponse.json({ success: true, appointment: updated });
    }

    // Rescheduling flow
    if (body.action === "RESCHEDULE") {
      const { newDate, newStartTime } = body;
      if (!newDate || !newStartTime) {
        return NextResponse.json({ error: "New date and start time are required" }, { status: 400 });
      }

      const totalDuration = existing.totalDuration;
      const startMins = timeToMinutes(newStartTime);
      const endMins = startMins + totalDuration;
      const newEndTime = minutesToTime(endMins);

      // Verify availability
      if (existing.staffId) {
        const conflicts = await prisma.appointment.findMany({
          where: {
            staffId: existing.staffId,
            date: newDate,
            id: { not: existing.id },
            status: { not: "CANCELLED" },
          },
        });

        const hasOverlap = conflicts.some((c) =>
          isTimeOverlapping(startMins, endMins, timeToMinutes(c.startTime), timeToMinutes(c.endTime))
        );

        if (hasOverlap) {
          return NextResponse.json({ error: "Selected slot conflicts with an existing booking." }, { status: 400 });
        }
      }

      const updated = await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          status: "CONFIRMED",
        },
      });

      await prisma.notification.create({
        data: {
          role: "ADMIN",
          title: "Appointment Rescheduled",
          message: `${existing.customerName} rescheduled booking ${existing.bookingReference} to ${newDate} at ${newStartTime}.`,
          link: `/admin/appointments`,
        },
      });

      return NextResponse.json({ success: true, appointment: updated });
    }

    // General status update (ADMIN)
    const allowedStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];
    if (body.status && allowedStatuses.includes(body.status)) {
      const updated = await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          status: body.status,
          notes: body.notes !== undefined ? body.notes : existing.notes,
        },
      });
      return NextResponse.json({ success: true, appointment: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Appointment PATCH error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Appointment DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
