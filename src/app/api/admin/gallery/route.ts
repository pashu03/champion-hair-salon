import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch gallery items" },
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
    const { title, category, imageUrl, altText, displayOrder, isPublished } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        category: category || "Salon",
        imageUrl,
        altText: altText || title,
        displayOrder: parseInt(displayOrder || "0", 10),
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to add gallery item" },
      { status: 400 }
    );
  }
}
