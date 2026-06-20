"use client";

import { useRouter, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  activeCategory: string;
  sort: string;
  totalProducts: number;
  categoryCounts: Record<string, number>;
}

export default function ShopFilters({
  categories,
  activeCategory,
  sort,
  totalProducts,
  categoryCounts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const update = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    if (activeCategory && activeCategory !== "all") sp.set("category", activeCategory);
    if (sort && sort !== "featured") sp.set("sort", sort);
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === "all" || v === "featured") {
        sp.delete(k);
      } else {
        sp.set(k, v);
      }
    });
    const qs = sp.toString();
    router.push(pathname + (qs ? "?" + qs : ""));
  };

  return (
    <div className="shop-page__filters">
      <button
        className={`filter-pill${activeCategory === "all" ? " filter-pill--active" : ""}`}
        onClick={() => update({ category: undefined })}
      >
        All ({totalProducts})
      </button>

      {categories.map((c) => {
        const count = categoryCounts[c.id] ?? 0;
        return (
          <button
            key={c.id}
            className={`filter-pill${activeCategory === c.id ? " filter-pill--active" : ""}`}
            onClick={() => update({ category: c.id })}
          >
            {c.name} ({count})
          </button>
        );
      })}

      {activeCategory !== "all" && (
        <button className="filter-clear" onClick={() => update({ category: undefined })}>
          <X size={14} /> Clear
        </button>
      )}

      <div className="shop-page__sort-wrap">
        <SlidersHorizontal size={15} />
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}
