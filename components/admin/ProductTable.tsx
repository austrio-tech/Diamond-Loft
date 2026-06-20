"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import styles from "./ProductTable.module.css";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  async function handleArchiveToggle(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !product.archived }),
    });
    router.refresh();
  }

  async function handleFeatureToggle(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    });
    router.refresh();
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.image}
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  alt={p.name}
                />
              </td>
              <td>
                <div>{p.name}</div>
                {p.category && (
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    {p.category.name}
                  </div>
                )}
              </td>
              <td>{formatPrice(p.price)}</td>
              <td>
                {p.featured && (
                  <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                    Featured
                  </span>
                )}
                {p.archived && (
                  <span className={`${styles.badge} ${styles.badgeArchived}`}>
                    Archived
                  </span>
                )}
                {!p.inStock && (
                  <span className={`${styles.badge} ${styles.badgeOutOfStock}`}>
                    Out of Stock
                  </span>
                )}
              </td>
              <td>
                <div className={styles.actions}>
                  <Link href={`/admin/products/${p.id}`} className={styles.btnEdit}>
                    Edit
                  </Link>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleArchiveToggle(p)}
                  >
                    {p.archived ? "Restore" : "Archive"}
                  </button>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => handleFeatureToggle(p)}
                  >
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
