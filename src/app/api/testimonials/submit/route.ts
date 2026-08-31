import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: validated.customerName,
        rating: validated.rating,
        review: validated.review,
        serviceName: validated.serviceName || "Hair Grooming",
        isPublished: true, // Auto publish for genuine flow or admin moderate
        isFeatured: false,
        date: "Recent",
      },
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit review" },
      { status: 400 }
    );
  }
}
