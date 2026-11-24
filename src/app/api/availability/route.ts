import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { timeToMinutes, minutesToTime, isTimeOverlapping } from "@/lib/booking-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    const staffId = searchParams.get("staffId"); // optional or "any"
    const duration = parseInt(searchParams.get("duration") || "60", 10);

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    // Get Day of Week (0 = Sunday, 1 = Monday, etc.)
    const dateObj = new Date(date + "T00:00:00");
    const dayOfWeek = dateObj.getDay();

    // Get Salon Settings
    const salonSettings = await prisma.salonSettings.findFirst() || {
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
    };

    // Check if the salon is open on this day of week
    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = daysName[dayOfWeek];
    if (!salonSettings.workingDays.includes(currentDayName)) {
      return NextResponse.json({ slots: [], message: `Salon is closed on ${currentDayName}s` });
    }

    const salonOpenMins = timeToMinutes(salonSettings.openingTime);
    const salonCloseMins = timeToMinutes(salonSettings.closingTime);

    // If specific staffId requested (and not "any")
    if (staffId && staffId !== "any") {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        include: {
          schedules: {
            where: { dayOfWeek },
          },
        },
      });

      if (!staff || !staff.isActive) {
        return NextResponse.json({ slots: [], error: "Stylist not found or inactive" });
      }

      const schedule = staff.schedules[0];
      if (!schedule || !schedule.isWorking) {
        return NextResponse.json({ slots: [], message: `${staff.name} does not work on this day` });
      }

      const staffStart = Math.max(salonOpenMins, timeToMinutes(schedule.startTime));
      const staffEnd = Math.min(salonCloseMins, timeToMinutes(schedule.endTime));
      const breakStart = schedule.breakStart ? timeToMinutes(schedule.breakStart) : null;
      const breakEnd = schedule.breakEnd ? timeToMinutes(schedule.breakEnd) : null;

      // Existing bookings on this date for this stylist (excluding CANCELLED)
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          staffId,
          date,
          status: { not: "CANCELLED" },
        },
      });

      const slots: { time: string; available: boolean; reason?: string }[] = [];
      const interval = 30; // 30-min slot intervals

      for (let time = staffStart; time + duration <= staffEnd; time += interval) {
        const slotEnd = time + duration;
        let isAvailable = true;
        let conflictReason: string | undefined = undefined;

        // Check break overlap
        if (breakStart !== null && breakEnd !== null) {
          if (isTimeOverlapping(time, slotEnd, breakStart, breakEnd)) {
            isAvailable = false;
            conflictReason = "Stylist Break";
          }
        }

        // Check appointment overlaps
        if (isAvailable) {
          for (const apt of existingAppointments) {
            const aptStart = timeToMinutes(apt.startTime);
            const aptEnd = timeToMinutes(apt.endTime);
            if (isTimeOverlapping(time, slotEnd, aptStart, aptEnd)) {
              isAvailable = false;
              conflictReason = "Booked";
              break;
            }
          }
        }

        slots.push({
          time: minutesToTime(time),
          available: isAvailable,
          reason: conflictReason,
        });
      }

      return NextResponse.json({ slots, staffName: staff.name });
    }

    // "Any Available Stylist": Check all active staff members
    const allStaff = await prisma.staff.findMany({
      where: { isActive: true },
      include: {
        schedules: {
          where: { dayOfWeek },
        },
        appointments: {
          where: {
            date,
            status: { not: "CANCELLED" },
          },
        },
      },
    });

    const workingStaff = allStaff.filter((s) => s.schedules[0]?.isWorking);

    if (workingStaff.length === 0) {
      return NextResponse.json({ slots: [], message: "No stylists available on this day" });
    }

    const slots: { time: string; available: boolean; availableStaffIds: string[] }[] = [];
    const interval = 30;

    for (let time = salonOpenMins; time + duration <= salonCloseMins; time += interval) {
      const slotEnd = time + duration;
      const availableStaffForSlot: string[] = [];

      for (const st of workingStaff) {
        const schedule = st.schedules[0];
        const staffStart = timeToMinutes(schedule.startTime);
        const staffEnd = timeToMinutes(schedule.endTime);
        const breakStart = schedule.breakStart ? timeToMinutes(schedule.breakStart) : null;
        const breakEnd = schedule.breakEnd ? timeToMinutes(schedule.breakEnd) : null;

        // Check if slot fits within working hours
        if (time < staffStart || slotEnd > staffEnd) continue;

        // Check break
        if (breakStart !== null && breakEnd !== null && isTimeOverlapping(time, slotEnd, breakStart, breakEnd)) {
          continue;
        }

        // Check existing bookings
        const hasConflict = st.appointments.some((apt) => {
          const aptStart = timeToMinutes(apt.startTime);
          const aptEnd = timeToMinutes(apt.endTime);
          return isTimeOverlapping(time, slotEnd, aptStart, aptEnd);
        });

        if (!hasConflict) {
          availableStaffForSlot.push(st.id);
        }
      }

      slots.push({
        time: minutesToTime(time),
        available: availableStaffForSlot.length > 0,
        availableStaffIds: availableStaffForSlot,
      });
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Availability API Error:", error);
    return NextResponse.json({ error: "Failed to compute availability" }, { status: 500 });
  }
}
