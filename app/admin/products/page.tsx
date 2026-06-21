import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/admin/ProductTable";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const rawProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ archived: "asc" }, { sortOrder: "asc" }],
  });

  const products: Product[] = rawProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images as unknown as string) as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  })) as unknown as Product[];

  return (
    <div className="bg-page min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-ink-deep text-gold text-sm rounded hover:opacity-90 transition-opacity"
        >
          + New Product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
