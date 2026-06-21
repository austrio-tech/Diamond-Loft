"use client";

import { useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  currentSort: string;
}

export default function CategorySort({ currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "featured") {
      router.push(pathname, { scroll: false });
    } else {
      router.push(`${pathname}?sort=${val}`, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-2 border border-line rounded-card px-3 py-2">
      <SlidersHorizontal size={13} className="text-muted flex-shrink-0" />
      <select
        className="bg-transparent text-[11px] [font-variant:small-caps] tracking-[0.12em] text-muted focus:outline-none cursor-pointer"
        value={currentSort}
        onChange={handleChange}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
