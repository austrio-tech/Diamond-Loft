import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.paymentStatus !== undefined) data.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) data.notes = body.notes;

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json({ ...order, items: JSON.parse(order.items) });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
