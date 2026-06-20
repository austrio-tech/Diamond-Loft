import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { archived: false } } } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const slug = body.slug ? slugify(body.slug) : slugify(body.name);
    const id = body.id ? slugify(body.id) : slug;
    const category = await prisma.category.create({
      data: {
        id,
        name: body.name,
        slug,
        description: body.description ?? "",
        image: body.image ?? "",
        accent: body.accent ?? "#c9a96e",
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
