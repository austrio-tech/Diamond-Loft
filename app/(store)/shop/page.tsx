import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";

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
    <div className="shop-page">
      {/* Banner */}
      <div className="shop-page__banner">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb__link">Home</Link>
            <ChevronRight size={14} className="breadcrumb__sep" />
            <span className="breadcrumb__current" style={{ color: "rgba(255,255,255,0.8)" }}>
              All Jewellery
            </span>
          </nav>
          <h1 className="shop-page__title">All Jewellery</h1>
          <p className="shop-page__subtitle">
            {allProducts.length} handcrafted pieces, waiting for you.
          </p>
        </div>
      </div>

      <div className="container shop-page__body">
        <ShopFilters
          categories={categories}
          activeCategory={category}
          sort={sort}
          totalProducts={allProducts.length}
          categoryCounts={categoryCounts}
        />

        {/* Grid */}
        <div className="shop-page__grid">
          {filteredWithSearch.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filteredWithSearch.length === 0 && (
          <div className="shop-page__empty">
            <p>No products found{q ? ` for "${q}"` : ""}. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
