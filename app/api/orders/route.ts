import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import {
  buildWhatsAppOrderUrl,
  buildOrderWhatsAppMessage,
  STORE_INFO,
} from "@/lib/utils";
import type { CreateOrderPayload } from "@/types";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const orders = await prisma.order.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      orders.map((o) => ({ ...o, items: JSON.parse(o.items) }))
    );
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: CreateOrderPayload = await req.json();
    if (
      !body.name ||
      !body.phone ||
      !body.address ||
      !body.city ||
      !body.items?.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const order = await prisma.order.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        city: body.city,
        items: JSON.stringify(body.items),
        total: body.total,
        payMethod: body.payMethod,
      },
    });
    const message = buildOrderWhatsAppMessage({
      name: body.name,
      phone: body.phone,
      address: body.address,
      city: body.city,
      items: body.items,
      total: body.total,
      payMethod: body.payMethod,
    });
    const whatsappUrl = buildWhatsAppOrderUrl(STORE_INFO.whatsapp, message);
    return NextResponse.json(
      { order: { ...order, items: body.items }, whatsappUrl },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
