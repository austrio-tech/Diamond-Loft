import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/admin/ProductTable";
import type { Product } from "@/types";
import styles from "./products.module.css";

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
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Products</h1>
        <Link href="/admin/products/new" className={styles.btnNew}>
          + New Product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
