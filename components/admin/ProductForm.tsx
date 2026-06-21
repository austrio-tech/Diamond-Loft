"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category, BadgeType } from "@/types";
import ImageUpload from "./ImageUpload";

type BadgeOption = "None" | BadgeType;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

const inputCls =
  "w-full bg-page border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold transition-colors";
const labelCls = "block text-xs uppercase tracking-[0.2em] text-muted mb-1.5";

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
  const [badge, setBadge] = useState<BadgeOption>(product?.badge ?? "None");
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
      const url = product ? `/api/products/${product.id}` : "/api/products";
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
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Row 1: Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-name">Name</label>
          <input
            id="pf-name"
            type="text"
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-category">Category</label>
          <select
            id="pf-category"
            className={inputCls}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-price">Price (PKR)</label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="any"
            className={inputCls}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-original-price">Original Price (optional)</label>
          <input
            id="pf-original-price"
            type="number"
            min="0"
            step="any"
            className={inputCls}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className={labelCls} htmlFor="pf-description">Description</label>
        <textarea
          id="pf-description"
          className={`${inputCls} resize-y`}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description…"
        />
      </div>

      {/* Row 3: Material + Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-material">Material</label>
          <input
            id="pf-material"
            type="text"
            className={inputCls}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. 22K Gold"
          />
        </div>

        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-weight">Weight</label>
          <input
            id="pf-weight"
            type="text"
            className={inputCls}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 5g"
          />
        </div>
      </div>

      {/* Row 4: Size + Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-size">Size</label>
          <input
            id="pf-size"
            type="text"
            className={inputCls}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. Free size"
          />
        </div>

        <div className="flex flex-col">
          <label className={labelCls} htmlFor="pf-badge">Badge</label>
          <select
            id="pf-badge"
            className={inputCls}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-amber-600 w-4 h-4"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span className="text-xs uppercase tracking-[0.2em] text-muted">In Stock</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-amber-600 w-4 h-4"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className="text-xs uppercase tracking-[0.2em] text-muted">Featured</span>
        </label>
      </div>

      {/* Images */}
      <div className="flex flex-col gap-1.5">
        <span className={labelCls}>Images</span>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-ink-deep text-gold text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          disabled={submitting}
        >
          {submitting ? "Saving…" : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
