"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

interface Props {
  category?: Category;
  onSuccess?: () => void;
}

const inputCls =
  "w-full bg-page border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold transition-colors";
const labelCls = "block text-xs uppercase tracking-[0.2em] text-muted mb-1.5";

export default function CategoryForm({ category, onSuccess }: Props) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [accent, setAccent] = useState(category?.accent ?? "#c9a84c");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManual) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
    }
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setSlug(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, slug, description, image, accent };

    try {
      const url = category ? `/api/categories/${category.id}` : "/api/categories";
      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      <div className="flex flex-col">
        <label className={labelCls} htmlFor="cat-name">Name</label>
        <input
          id="cat-name"
          className={inputCls}
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          placeholder="e.g. Earrings"
        />
      </div>

      <div className="flex flex-col">
        <label className={labelCls} htmlFor="cat-slug">Slug</label>
        <input
          id="cat-slug"
          className={inputCls}
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          placeholder="e.g. earrings"
        />
      </div>

      <div className="flex flex-col">
        <label className={labelCls} htmlFor="cat-description">Description</label>
        <textarea
          id="cat-description"
          className={`${inputCls} resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Short description of this category"
        />
      </div>

      <div className="flex flex-col">
        <label className={labelCls} htmlFor="cat-image">Image URL</label>
        <input
          id="cat-image"
          className={inputCls}
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex flex-col">
        <label className={labelCls} htmlFor="cat-accent">Accent Color</label>
        <input
          id="cat-accent"
          className="w-full h-10 rounded border border-line cursor-pointer p-1 bg-page focus:outline-none focus:border-gold"
          type="color"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
        />
      </div>

      <button
        className="px-6 py-2.5 bg-ink-deep text-gold text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity self-start"
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving…" : category ? "Update Category" : "Create Category"}
      </button>
    </form>
  );
}
