"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import ActionMenu, { type ActionItem } from "@/components/admin/ActionMenu";
import ConfirmModal from "@/components/admin/ConfirmModal";
import styles from "./ProductTable.module.css";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmProduct = confirmId !== null
    ? products.find((p) => p.id === confirmId) ?? null
    : null;

  async function handleFeatureToggle(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !product.featured }),
    });
    router.refresh();
  }

  async function handleArchiveToggle(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !product.archived }),
    });
    router.refresh();
  }

  async function handleDelete() {
    if (confirmId === null) return;
    setBusy(true);
    try {
      await fetch(`/api/products/${confirmId}`, { method: "DELETE" });
      setConfirmId(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function getActions(p: Product): ActionItem[] {
    return [
      {
        label: "Edit",
        onClick: () => router.push(`/admin/products/${p.id}`),
      },
      {
        label: p.featured ? "Unfeature" : "Feature",
        onClick: () => handleFeatureToggle(p),
      },
      {
        label: p.archived ? "Restore" : "Archive",
        onClick: () => handleArchiveToggle(p),
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => setConfirmId(p.id),
      },
    ];
  }

  return (
    <>
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
                  <ActionMenu items={getActions(p)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmId !== null}
        title="Delete product?"
        message={
          confirmProduct
            ? `Permanently delete "${confirmProduct.name}"? This cannot be undone.`
            : "Permanently delete this product? This cannot be undone."
        }
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
