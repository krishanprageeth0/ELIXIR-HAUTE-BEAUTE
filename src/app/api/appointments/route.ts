import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { timeToMinutes, minutesToTime, isTimeOverlapping } from "@/lib/booking-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getCurrentUser();

    const date = searchParams.get("date");
    const staffId = searchParams.get("staffId");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search");

    // Filter building
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Customer can only view their own bookings unless ADMIN
    if (user && user.role !== "ADMIN") {
      where.OR = [
        { customerId: user.userId },
        { customerEmail: user.email },
      ];
    } else if (customerId) {
      where.customerId = customerId;
    }

    if (date) where.date = date;
    if (staffId && staffId !== "all") where.staffId = staffId;
    if (status && status !== "ALL") where.status = status;

    if (search) {
      where.OR = [
        { bookingReference: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        staff: true,
        appointmentServices: {
          include: {
            service: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Appointments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceIds,
      staffId: requestedStaffId,
      date,
      startTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body;

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json({ error: "At least one service must be selected" }, { status: 400 });
    }
    if (!date || !startTime || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // Server-side database transaction with atomic isolation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Fetch real services from DB to compute accurate duration & price
      const services = await tx.service.findMany({
        where: { id: { in: serviceIds }, isActive: true },
      });

      if (services.length !== serviceIds.length) {
        throw new Error("One or more selected services are invalid or no longer active.");
      }

      const totalDuration = services.reduce((acc: number, s: { durationMinutes: number }) => acc + s.durationMinutes, 0);
      const totalPrice = services.reduce((acc: number, s: { price: number }) => acc + s.price, 0);

      const startMins = timeToMinutes(startTime);
      const endMins = startMins + totalDuration;
      const endTime = minutesToTime(endMins);

      const dateObj = new Date(date + "T00:00:00");
      const dayOfWeek = dateObj.getDay();

      let assignedStaffId = requestedStaffId;

      // 2. Validate availability & prevent double booking
      if (requestedStaffId && requestedStaffId !== "any") {
        // Verify staff exists and is working
        const staff = await tx.staff.findUnique({
          where: { id: requestedStaffId },
          include: { schedules: { where: { dayOfWeek } } },
        });

        if (!staff || !staff.isActive) {
          throw new Error("Selected stylist is currently unavailable.");
        }

        const schedule = staff.schedules[0];
        if (!schedule || !schedule.isWorking) {
          throw new Error(`${staff.name} is not scheduled to work on this date.`);
        }

        const staffStart = timeToMinutes(schedule.startTime);
        const staffEnd = timeToMinutes(schedule.endTime);
        const breakStart = schedule.breakStart ? timeToMinutes(schedule.breakStart) : null;
        const breakEnd = schedule.breakEnd ? timeToMinutes(schedule.breakEnd) : null;

        if (startMins < staffStart || endMins > staffEnd) {
          throw new Error(`Appointment exceeds ${staff.name}'s working hours (${schedule.startTime} - ${schedule.endTime}).`);
        }

        if (breakStart !== null && breakEnd !== null && isTimeOverlapping(startMins, endMins, breakStart, breakEnd)) {
          throw new Error(`Appointment conflicts with ${staff.name}'s designated break time.`);
        }

        // Conflict check on DB
        const conflicts = await tx.appointment.findMany({
          where: {
            staffId: requestedStaffId,
            date,
            status: { not: "CANCELLED" },
          },
        });

        const hasOverlap = conflicts.some((c: { startTime: string; endTime: string }) => {
          return isTimeOverlapping(startMins, endMins, timeToMinutes(c.startTime), timeToMinutes(c.endTime));
        });

        if (hasOverlap) {
          throw new Error("Selected time slot has just been reserved by another client. Please select another time.");
        }

        assignedStaffId = requestedStaffId;
      } else {
        // "Any Available Stylist": Find first eligible staff member with zero conflict
        const candidates = await tx.staff.findMany({
          where: { isActive: true },
          include: {
            schedules: { where: { dayOfWeek } },
            appointments: {
              where: {
                date,
                status: { not: "CANCELLED" },
              },
            },
          },
        });

        const eligible = candidates.find((st: { schedules: { isWorking: boolean; startTime: string; endTime: string; breakStart: string | null; breakEnd: string | null }[]; appointments: { startTime: string; endTime: string }[] }) => {
          const schedule = st.schedules[0];
          if (!schedule || !schedule.isWorking) return false;
          const stStart = timeToMinutes(schedule.startTime);
          const stEnd = timeToMinutes(schedule.endTime);
          if (startMins < stStart || endMins > stEnd) return false;

          const brkStart = schedule.breakStart ? timeToMinutes(schedule.breakStart) : null;
          const brkEnd = schedule.breakEnd ? timeToMinutes(schedule.breakEnd) : null;
          if (brkStart !== null && brkEnd !== null && isTimeOverlapping(startMins, endMins, brkStart, brkEnd)) {
            return false;
          }

          const hasConflict = st.appointments.some((a) =>
            isTimeOverlapping(startMins, endMins, timeToMinutes(a.startTime), timeToMinutes(a.endTime))
          );
          return !hasConflict;
        });

        if (!eligible) {
          throw new Error("No stylists are available for the entire duration of this slot. Please select another time.");
        }

        assignedStaffId = eligible.id;
      }

      // 3. Link customer if logged in or by matching email
      const currentUser = await getCurrentUser();
      let customerId = currentUser?.userId || null;

      if (!customerId) {
        const existingCustomer = await tx.user.findUnique({
          where: { email: customerEmail.toLowerCase().trim() },
        });
        if (existingCustomer) {
          customerId = existingCustomer.id;
        }
      }

      // 4. Generate unique reference code: e.g. ELX-2027-4821
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `ELX-2027-${randNum}`;

      // 5. Create Appointment
      const appointment = await tx.appointment.create({
        data: {
          bookingReference,
          customerId,
          customerName: customerName.trim(),
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone: customerPhone.trim(),
          notes: notes?.trim() || null,
          staffId: assignedStaffId,
          date,
          startTime,
          endTime,
          totalDuration,
          totalPrice,
          status: "CONFIRMED",
          appointmentServices: {
            create: services.map((s: { id: string; price: number; durationMinutes: number }) => ({
              serviceId: s.id,
              priceAtBooking: s.price,
              durationAtBooking: s.durationMinutes,
            })),
          },
        },
        include: {
          staff: true,
          appointmentServices: {
            include: { service: true },
          },
        },
      });

      // 6. Create in-app Notifications
      await tx.notification.create({
        data: {
          role: "ADMIN",
          title: "New Appointment Booked",
          message: `${customerName} booked for ${date} at ${startTime} (${bookingReference})`,
          link: `/admin/appointments`,
        },
      });

      if (customerId) {
        await tx.notification.create({
          data: {
            userId: customerId,
            role: "CUSTOMER",
            title: "Booking Confirmed",
            message: `Your appointment ${bookingReference} for ${date} at ${startTime} has been confirmed.`,
            link: `/dashboard`,
          },
        });
      }

      return appointment;
    });

    return NextResponse.json({ success: true, appointment: result }, { status: 201 });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create booking" },
      { status: 400 }
    );
  }
}
