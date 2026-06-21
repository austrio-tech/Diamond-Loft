import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

export const metadata = {
  title: "All Jewellery",
  description: "Browse our full collection of handcrafted jewellery — earrings, pendants, bracelets & ear tops.",
};

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const q = params.q ?? "";
  const sort = params.sort ?? "featured";

  const [allProducts, categories] = await Promise.all([
    getProducts({ sort }),
    getCategories(),
  ]);

  // Filter by category client-side after fetching all (consistent with original)
  const filtered =
    category === "all"
      ? allProducts
      : allProducts.filter((p) => p.categoryId === category);

  const filteredWithSearch = q
    ? filtered.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : filtered;

  // Build category counts from all products
  const categoryCounts: Record<string, number> = {};
  for (const p of allProducts) {
    categoryCounts[p.categoryId] = (categoryCounts[p.categoryId] ?? 0) + 1;
  }

  return (
    <div className="bg-page min-h-screen">
      {/* Banner */}
      <div className="bg-ink-deep py-16 md:py-20">
        <div className="mx-auto max-w-[1380px] px-6">
          <nav className="flex items-center gap-2 mb-5">
            <Link
              href="/"
              className="uppercase tracking-[0.25em] text-xs text-gold-light hover:text-gold transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={12} className="text-gold-light/50" />
            <span className="uppercase tracking-[0.25em] text-xs text-white/60">
              All Jewellery
            </span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light leading-tight">
            All Jewellery
          </h1>
          <p className="mt-3 text-white/60 text-sm tracking-wide">
            {allProducts.length} handcrafted pieces, waiting for you.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1380px] px-6 py-12">
        {/* Filters bar (full width, above the grid) */}
        <div className="mb-8">
          <ShopFilters
            categories={categories}
            activeCategory={category}
            sort={sort}
            totalProducts={allProducts.length}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Product grid or empty state */}
        {filteredWithSearch.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-serif text-xl text-muted italic">
              No products found{q ? ` for "${q}"` : ""}. Try a different filter.
            </p>
          </div>
        ) : (
          <Stagger className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
            {filteredWithSearch.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
