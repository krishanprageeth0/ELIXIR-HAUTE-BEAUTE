import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, serviceName, rating, comment } = body;

    if (!customerName || !comment) {
      return NextResponse.json({ error: "Customer name and comment are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        customerName,
        serviceName: serviceName || "Signature Treatment",
        rating: parseInt(rating, 10) || 5,
        comment,
        date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
