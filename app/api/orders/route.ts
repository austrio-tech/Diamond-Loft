import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import {
  buildWhatsAppOrderUrl,
  buildOrderWhatsAppMessage,
  STORE_INFO,
} from "@/lib/utils";
import type { CreateOrderPayload, OrderItem, PaymentMethod } from "@/types";

const VALID_PAY_METHODS: PaymentMethod[] = ["bank", "mobile"];

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

    // Validate required fields
    if (
      !body.name ||
      !body.phone ||
      !body.address ||
      !body.city ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate payment method against allowed enum
    if (!VALID_PAY_METHODS.includes(body.payMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // SECURITY: never trust client-supplied prices. Re-fetch each product
    // from the DB and recompute prices/total server-side.
    const productIds = body.items.map((i) => Number(i.productId));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, archived: false },
    });
    const priceMap = new Map(dbProducts.map((p) => [p.id, p]));

    const verifiedItems: OrderItem[] = [];
    let total = 0;
    for (const item of body.items) {
      const product = priceMap.get(Number(item.productId));
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} is unavailable` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
      const lineItem: OrderItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
      };
      verifiedItems.push(lineItem);
      total += product.price * qty;
    }

    const order = await prisma.order.create({
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        city: body.city,
        items: JSON.stringify(verifiedItems),
        total,
        payMethod: body.payMethod,
      },
    });

    const message = buildOrderWhatsAppMessage({
      name: body.name,
      phone: body.phone,
      address: body.address,
      city: body.city,
      items: verifiedItems,
      total,
      payMethod: body.payMethod,
    });
    const whatsappUrl = buildWhatsAppOrderUrl(STORE_INFO.whatsapp, message);

    return NextResponse.json(
      { order: { ...order, items: verifiedItems }, whatsappUrl },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
