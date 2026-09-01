import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: validated.customerName,
        rating: validated.rating,
        review: validated.review,
        serviceName: validated.serviceName || "Hair Cut & Styling",
        isPublished: true,
        isFeatured: body.isFeatured || false,
        date: "Recent",
      },
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to add testimonial" },
      { status: 400 }
    );
  }
}
