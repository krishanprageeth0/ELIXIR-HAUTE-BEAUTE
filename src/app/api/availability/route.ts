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

    const dateObj = new Date(date + "T00:00:00");
    const dayOfWeek = dateObj.getDay();

    let salonSettings = {
      openingTime: "09:00",
      closingTime: "20:00",
      workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
    };

    try {
      const dbSettings = await prisma.salonSettings.findFirst();
      if (dbSettings) salonSettings = dbSettings;
    } catch {}

    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = daysName[dayOfWeek];
    if (!salonSettings.workingDays.includes(currentDayName)) {
      return NextResponse.json({ slots: [], message: `Salon is closed on ${currentDayName}s` });
    }

    const salonOpenMins = timeToMinutes(salonSettings.openingTime);
    const salonCloseMins = timeToMinutes(salonSettings.closingTime);

    // Try DB query
    try {
      if (staffId && staffId !== "any") {
        const staff = await prisma.staff.findUnique({
          where: { id: staffId },
          include: {
            schedules: { where: { dayOfWeek } },
          },
        });

        if (staff && staff.isActive) {
          const schedule = staff.schedules[0];
          if (!schedule || !schedule.isWorking) {
            return NextResponse.json({ slots: [], message: `${staff.name} does not work on this day` });
          }

          const staffStart = Math.max(salonOpenMins, timeToMinutes(schedule.startTime));
          const staffEnd = Math.min(salonCloseMins, timeToMinutes(schedule.endTime));
          const breakStart = schedule.breakStart ? timeToMinutes(schedule.breakStart) : null;
          const breakEnd = schedule.breakEnd ? timeToMinutes(schedule.breakEnd) : null;

          const existingAppointments = await prisma.appointment.findMany({
            where: {
              staffId,
              date,
              status: { not: "CANCELLED" },
            },
          });

          const slots: { time: string; available: boolean; reason?: string }[] = [];
          const interval = 30;

          for (let time = staffStart; time + duration <= staffEnd; time += interval) {
            const slotEnd = time + duration;
            let isAvailable = true;
            let conflictReason: string | undefined = undefined;

            if (breakStart !== null && breakEnd !== null && isTimeOverlapping(time, slotEnd, breakStart, breakEnd)) {
              isAvailable = false;
              conflictReason = "Stylist Break";
            }

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
      }

      const allStaff = await prisma.staff.findMany({
        where: { isActive: true },
        include: {
          schedules: { where: { dayOfWeek } },
          appointments: {
            where: { date, status: { not: "CANCELLED" } },
          },
        },
      });

      const workingStaff = allStaff.filter((s) => s.schedules[0]?.isWorking);

      if (workingStaff.length > 0) {
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

            if (time < staffStart || slotEnd > staffEnd) continue;
            if (breakStart !== null && breakEnd !== null && isTimeOverlapping(time, slotEnd, breakStart, breakEnd)) continue;

            const hasConflict = st.appointments.some((apt) =>
              isTimeOverlapping(time, slotEnd, timeToMinutes(apt.startTime), timeToMinutes(apt.endTime))
            );

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
      }
    } catch (dbErr) {
      console.warn("DB availability check fallback:", dbErr);
    }

    // Default slot generator if DB is unreachable
    const fallbackSlots: { time: string; available: boolean }[] = [];
    for (let time = salonOpenMins; time + duration <= salonCloseMins; time += 30) {
      fallbackSlots.push({
        time: minutesToTime(time),
        available: true,
      });
    }

    return NextResponse.json({ slots: fallbackSlots });
  } catch (error) {
    console.error("Availability API Error:", error);
    return NextResponse.json({ error: "Failed to compute availability" }, { status: 500 });
  }
}
