import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (user?.role === "ADMIN") {
      where.role = "ADMIN";
    } else if (user) {
      where.userId = user.userId;
    } else {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { id, markAllRead } = body;

    if (markAllRead) {
      if (user.role === "ADMIN") {
        await prisma.notification.updateMany({
          where: { role: "ADMIN" },
          data: { read: true },
        });
      } else {
        await prisma.notification.updateMany({
          where: { userId: user.userId },
          data: { read: true },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
