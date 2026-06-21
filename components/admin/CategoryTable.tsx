"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { overlay, modalPop } from "@/lib/motion";
import type { Category } from "@/types";
import ActionMenu, { type ActionItem } from "@/components/admin/ActionMenu";
import ConfirmModal from "@/components/admin/ConfirmModal";
import CategoryForm from "@/components/admin/CategoryForm";

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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Name</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Slug</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Products</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Accent</th>
              <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-body font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-line hover:bg-soft transition-colors">
                <td className="py-3 px-3 text-sm text-ink">{cat.name}</td>
                <td className="py-3 px-3 text-sm text-ink">{cat.slug}</td>
                <td className="py-3 px-3 text-sm text-ink">{cat._count?.products ?? 0}</td>
                <td className="py-3 px-3 text-sm text-ink">
                  <span
                    className="w-5 h-5 rounded-sm border border-line inline-block align-middle"
                    style={{ backgroundColor: cat.accent }}
                    title={cat.accent}
                  />
                </td>
                <td className="py-3 px-3 text-sm text-ink">
                  <ActionMenu items={getActions(cat)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editCategory && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setEditCategory(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
              <motion.div
                className="bg-surface border border-line rounded-card shadow-card p-6 w-full max-w-md relative pointer-events-auto"
                variants={modalPop}
                initial="hidden"
                animate="show"
                exit="exit"
                role="dialog"
                aria-modal="true"
                aria-label={`Edit category: ${editCategory.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 text-muted hover:text-ink transition-colors"
                  aria-label="Close"
                  onClick={() => setEditCategory(null)}
                >
                  ✕
                </button>
                <h2 className="font-serif text-xl text-ink mb-4">Edit Category</h2>
                <CategoryForm category={editCategory} onSuccess={() => setEditCategory(null)} />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

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
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{deleteError}</p>
      )}
    </>
  );
}
