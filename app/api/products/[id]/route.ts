import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

function parseImages<T extends { images: string }>(p: T) {
  return { ...p, images: JSON.parse(p.images) as string[] };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(parseImages(product));
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    const fields = [
      "categoryId",
      "name",
      "badge",
      "inStock",
      "featured",
      "archived",
      "description",
      "material",
      "weight",
      "size",
      "sortOrder",
      "image",
      "rating",
      "reviews",
    ];
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = body[f];
    }
    if (body.badge !== undefined) data.badge = body.badge || null;
    if (body.images !== undefined) {
      data.images = JSON.stringify(body.images);
      if (body.images[0]) data.image = body.images[0];
    }
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.originalPrice !== undefined)
      data.originalPrice = body.originalPrice
        ? Number(body.originalPrice)
        : null;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(parseImages(product));
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
