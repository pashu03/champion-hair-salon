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

    const enquiry = await prisma.contactEnquiry.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update enquiry" },
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
    await prisma.contactEnquiry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
