import { prisma } from "./prisma";
import type { Product, Section, Category } from "@/types";

type RawProduct = {
  images: string;
  badge: string | null;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

function toProduct(p: RawProduct): Product {
  return {
    ...p,
    images: JSON.parse(p.images) as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  } as unknown as Product;
}

export async function getProducts(opts?: {
  category?: string;
  q?: string;
  sort?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const sort = opts?.sort ?? "featured";
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
      archived: false,
      ...(opts?.category ? { categoryId: opts.category } : {}),
      ...(opts?.featured ? { featured: true } : {}),
      ...(opts?.q ? { name: { contains: opts.q } } : {}),
    },
    include: { category: true },
    orderBy,
  });
  return products.map((p) => toProduct(p as unknown as RawProduct));
}

export async function getProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { id, archived: false },
    include: { category: true },
  });
  return product ? toProduct(product as unknown as RawProduct) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: number,
  take = 4
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, archived: false },
    include: { category: true },
    take,
    orderBy: { sortOrder: "asc" },
  });
  return products.map((p) => toProduct(p as unknown as RawProduct));
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { archived: false } } } },
    },
  });
  return categories as unknown as Category[];
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getSections(onlyEnabled = false): Promise<Section[]> {
  const sections = await prisma.section.findMany({
    where: onlyEnabled ? { enabled: true } : {},
    orderBy: { sortOrder: "asc" },
  });
  return sections.map((s) => ({
    ...s,
    config: JSON.parse(s.config),
  })) as unknown as Section[];
}
