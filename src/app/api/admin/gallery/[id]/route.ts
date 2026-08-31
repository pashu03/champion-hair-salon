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

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.altText !== undefined && { altText: body.altText }),
        ...(body.displayOrder !== undefined && { displayOrder: parseInt(body.displayOrder, 10) }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update gallery item" },
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
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
