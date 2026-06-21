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
    <div className="flex flex-wrap items-center gap-2">
      {/* All filter pill */}
      <button
        className={[
          "px-4 py-1.5 text-[11px] [font-variant:small-caps] tracking-[0.15em] border rounded-card transition-colors",
          activeCategory === "all"
            ? "bg-ink-deep text-[#f1e6cf] border-ink-deep"
            : "border-line text-muted hover:border-gold hover:text-gold",
        ].join(" ")}
        onClick={() => update({ category: undefined })}
      >
        All ({totalProducts})
      </button>

      {categories.map((c) => {
        const count = categoryCounts[c.id] ?? 0;
        return (
          <button
            key={c.id}
            className={[
              "px-4 py-1.5 text-[11px] [font-variant:small-caps] tracking-[0.15em] border rounded-card transition-colors",
              activeCategory === c.id
                ? "bg-ink-deep text-[#f1e6cf] border-ink-deep"
                : "border-line text-muted hover:border-gold hover:text-gold",
            ].join(" ")}
            onClick={() => update({ category: c.id })}
          >
            {c.name} ({count})
          </button>
        );
      })}

      {activeCategory !== "all" && (
        <button
          className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-muted hover:text-gold transition-colors"
          onClick={() => update({ category: undefined })}
        >
          <X size={12} /> Clear
        </button>
      )}

      {/* Sort select */}
      <div className="flex items-center gap-2 ml-auto border border-line rounded-card px-3 py-1.5">
        <SlidersHorizontal size={13} className="text-muted flex-shrink-0" />
        <select
          className="bg-transparent text-[11px] [font-variant:small-caps] tracking-[0.12em] text-muted focus:outline-none cursor-pointer"
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
