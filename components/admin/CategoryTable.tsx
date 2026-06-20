"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";
import ActionMenu, { type ActionItem } from "@/components/admin/ActionMenu";
import ConfirmModal from "@/components/admin/ConfirmModal";
import CategoryForm from "@/components/admin/CategoryForm";
import styles from "./CategoryTable.module.css";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();

  // Edit modal
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteTarget = deleteId !== null
    ? categories.find((c) => c.id === deleteId) ?? null
    : null;

  // Close modal on Escape
  useEffect(() => {
    if (!editCategory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditCategory(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [editCategory]);

  async function handleDelete() {
    if (deleteId === null) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/categories/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setDeleteError(data.error ?? "Could not delete category.");
        return;
      }
      setDeleteId(null);
      router.refresh();
    } finally {
      setDeleteBusy(false);
    }
  }

  function getActions(c: Category): ActionItem[] {
    return [
      {
        label: "Edit",
        onClick: () => setEditCategory(c),
      },
      {
        label: "Delete",
        danger: true,
        onClick: () => {
          setDeleteError(null);
          setDeleteId(c.id);
        },
      },
    ];
  }

  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Accent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat._count?.products ?? 0}</td>
                <td>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: cat.accent }}
                    title={cat.accent}
                  />
                </td>
                <td>
                  <ActionMenu items={getActions(cat)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editCategory && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditCategory(null)}
        >
          <div
            className={styles.modalBox}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Edit category: ${editCategory.name}`}
          >
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close"
              onClick={() => setEditCategory(null)}
            >
              ✕
            </button>
            <h2 className={styles.modalTitle}>Edit Category</h2>
            <CategoryForm
              category={editCategory}
              onSuccess={() => setEditCategory(null)}
            />
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete category?"
        message={
          deleteTarget
            ? `Permanently delete "${deleteTarget.name}"? This cannot be undone.`
            : "Permanently delete this category? This cannot be undone."
        }
        confirmLabel="Delete"
        danger
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteId(null);
          setDeleteError(null);
        }}
      />

      {/* Inline error if delete was blocked (e.g. products still assigned) */}
      {deleteError && (
        <p className={styles.deleteError}>{deleteError}</p>
      )}
    </>
  );
}
