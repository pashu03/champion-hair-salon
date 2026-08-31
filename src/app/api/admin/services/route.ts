import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch services" },
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
    const validated = serviceSchema.parse(body);

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const service = await prisma.service.create({
      data: {
        name: validated.name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        category: validated.category,
        price: validated.price,
        duration: validated.duration,
        description: validated.description || null,
        isPopular: validated.isPopular,
        isActive: validated.isActive,
        displayOrder: validated.displayOrder,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create service" },
      { status: 400 }
    );
  }
}
