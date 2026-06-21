import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import type { Product, Category } from "@/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rawProduct, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!rawProduct) notFound();

  const product: Product = {
    ...rawProduct,
    images: JSON.parse(rawProduct.images as unknown as string) as string[],
    createdAt: rawProduct.createdAt.toISOString(),
    updatedAt: rawProduct.updatedAt.toISOString(),
  } as unknown as Product;

  return (
    <div className="bg-page min-h-screen p-8">
      <h1 className="font-serif text-3xl text-ink mb-8">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories as unknown as Category[]}
      />
    </div>
  );
}
