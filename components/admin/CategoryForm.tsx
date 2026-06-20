"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";
import styles from "./CategoryForm.module.css";

interface Props {
  category?: Category;
  onSuccess?: () => void;
}

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
      const url = category
        ? `/api/categories/${category.id}`
        : "/api/categories";
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
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p style={{ color: "#842029", fontSize: "0.875rem" }}>{error}</p>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cat-name">
          Name
        </label>
        <input
          id="cat-name"
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          placeholder="e.g. Earrings"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cat-slug">
          Slug
        </label>
        <input
          id="cat-slug"
          className={styles.input}
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          placeholder="e.g. earrings"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cat-description">
          Description
        </label>
        <textarea
          id="cat-description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Short description of this category"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cat-image">
          Image URL
        </label>
        <input
          id="cat-image"
          className={styles.input}
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cat-accent">
          Accent Color
        </label>
        <input
          id="cat-accent"
          className={styles.input}
          type="color"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          style={{ height: "42px", padding: "4px 8px", cursor: "pointer" }}
        />
      </div>

      <button className={styles.submitBtn} type="submit" disabled={loading}>
        {loading
          ? "Saving…"
          : category
            ? "Update Category"
            : "Create Category"}
      </button>
    </form>
  );
}
