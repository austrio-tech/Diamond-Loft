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
      router.push(pathname);
    } else {
      router.push(`${pathname}?sort=${val}`);
    }
  };

  return (
    <div className="cat-page__sort">
      <SlidersHorizontal size={15} />
      <select className="sort-select" value={currentSort} onChange={handleChange}>
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
