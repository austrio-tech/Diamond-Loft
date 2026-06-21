"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import ActionMenu, { type ActionItem } from "@/components/admin/ActionMenu";
import ConfirmModal from "@/components/admin/ConfirmModal";

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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Image</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Name</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Price</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Status</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line hover:bg-soft transition-colors">
                <td className="py-3 px-3 text-sm text-ink">
                  <img
                    src={p.image}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                    alt={p.name}
                  />
                </td>
                <td className="py-3 px-3 text-sm text-ink">
                  <div className="text-sm font-medium text-ink">{p.name}</div>
                  {p.category && (
                    <div className="text-xs text-muted mt-0.5">{p.category.name}</div>
                  )}
                </td>
                <td className="py-3 px-3 text-sm text-ink">{formatPrice(p.price)}</td>
                <td className="py-3 px-3 text-sm text-ink">
                  <div className="flex flex-wrap gap-1">
                    {p.featured && (
                      <span className="bg-gold/15 text-gold-dark text-xs px-2 py-0.5 rounded uppercase tracking-wide font-medium">
                        Featured
                      </span>
                    )}
                    {p.archived && (
                      <span className="bg-soft text-muted text-xs px-2 py-0.5 rounded uppercase tracking-wide font-medium border border-line">
                        Archived
                      </span>
                    )}
                    {!p.inStock && (
                      <span className="bg-red-500/15 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded uppercase tracking-wide font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-ink">
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
