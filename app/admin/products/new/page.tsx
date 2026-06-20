import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import type { Category } from "@/types";

export default async function NewProductPage() {
  const categories = (await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  })) as unknown as Category[];

  return (
    <div style={{ padding: "32px" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2rem",
          marginBottom: "24px",
        }}
      >
        New Product
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
