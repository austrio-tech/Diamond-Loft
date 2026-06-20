import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

function parseImages<T extends { images: string }>(p: T) {
  return { ...p, images: JSON.parse(p.images) as string[] };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort") ?? "featured";
  const featured = searchParams.get("featured");
  const includeArchived = searchParams.get("includeArchived") === "true";

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "rating"
          ? { rating: "desc" as const }
          : { sortOrder: "asc" as const };

  const products = await prisma.product.findMany({
    where: {
      ...(includeArchived ? {} : { archived: false }),
      ...(category ? { categoryId: category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q ? { name: { contains: q } } : {}),
    },
    include: { category: true },
    orderBy,
  });

  return NextResponse.json(products.map(parseImages));
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.name || !body.categoryId) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }
    if (Number(body.price) <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }
    const images: string[] = body.images ?? [];
    const product = await prisma.product.create({
      data: {
        categoryId: body.categoryId,
        name: body.name,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        image: images[0] ?? body.image ?? "",
        images: JSON.stringify(images),
        badge: body.badge || null,
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
        description: body.description ?? "",
        material: body.material ?? "",
        weight: body.weight ?? "",
        size: body.size ?? "",
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(parseImages(product), { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
