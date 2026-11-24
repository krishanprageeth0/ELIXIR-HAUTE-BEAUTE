import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Service GET [id] error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
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

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.description && { description: body.description }),
        ...(body.durationMinutes !== undefined && { durationMinutes: parseInt(body.durationMinutes, 10) }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.image && { image: body.image }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Service PATCH error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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

    // Soft delete or real delete
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Service removed" });
  } catch (error) {
    console.error("Service DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
