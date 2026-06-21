import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import type { Category } from "@/types";

export default async function NewProductPage() {
  const categories = (await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  })) as unknown as Category[];

  return (
    <div className="bg-page min-h-screen p-8">
      <h1 className="font-serif text-3xl text-ink mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
