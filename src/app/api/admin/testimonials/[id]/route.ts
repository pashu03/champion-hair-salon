import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(body.customerName !== undefined && { customerName: body.customerName }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.review !== undefined && { review: body.review }),
        ...(body.serviceName !== undefined && { serviceName: body.serviceName }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
