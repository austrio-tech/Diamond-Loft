"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category, BadgeType } from "@/types";
import ImageUpload from "./ImageUpload";
import styles from "./ProductForm.module.css";

type BadgeOption = "None" | BadgeType;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice?.toString() ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [weight, setWeight] = useState(product?.weight ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [badge, setBadge] = useState<BadgeOption>(
    product?.badge ?? "None"
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (!price || parsedPrice <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    const payload = {
      name,
      categoryId,
      description,
      material,
      weight,
      size,
      price: parsedPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      badge: badge === "None" ? null : badge,
      inStock,
      featured,
      images,
      image: images[0] ?? "",
    };

    setSubmitting(true);
    try {
      const url = product
        ? `/api/products/${product.id}`
        : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Row 1: Name + Category */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-name">
            Name
          </label>
          <input
            id="pf-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-category">
            Category
          </label>
          <select
            id="pf-category"
            className={styles.select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category…</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Price + Original Price */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-price">
            Price (PKR)
          </label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="any"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-original-price">
            Original Price (optional)
          </label>
          <input
            id="pf-original-price"
            type="number"
            min="0"
            step="any"
            className={styles.input}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-description">
          Description
        </label>
        <textarea
          id="pf-description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description…"
        />
      </div>

      {/* Row 3: Material + Weight */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-material">
            Material
          </label>
          <input
            id="pf-material"
            type="text"
            className={styles.input}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. 22K Gold"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-weight">
            Weight
          </label>
          <input
            id="pf-weight"
            type="text"
            className={styles.input}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 5g"
          />
        </div>
      </div>

      {/* Row 4: Size + Badge */}
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-size">
            Size
          </label>
          <input
            id="pf-size"
            type="text"
            className={styles.input}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. Free size"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-badge">
            Badge
          </label>
          <select
            id="pf-badge"
            className={styles.select}
            value={badge}
            onChange={(e) => setBadge(e.target.value as BadgeOption)}
          >
            <option value="None">None</option>
            <option value="Sale">Sale</option>
            <option value="New">New</option>
            <option value="Bestseller">Bestseller</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className={styles.grid}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span className={styles.label}>In Stock</span>
        </label>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className={styles.label}>Featured</span>
        </label>
      </div>

      {/* Images */}
      <div className={styles.field}>
        <span className={styles.label}>Images</span>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      {/* Error */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Submit */}
      <div>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting
            ? "Saving…"
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
}
