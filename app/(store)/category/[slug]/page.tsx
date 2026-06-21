import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getCategoryBySlug, getCategories, getProducts } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard";
import CategorySort from "@/components/store/CategorySort";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort = "featured" } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    getProducts({ category: slug, sort }),
    getCategories(),
  ]);

  return (
    <div className="bg-page min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="sepia-img absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-ink-deep/70" />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end mx-auto max-w-[1380px] px-6 pb-10">
          <nav className="flex items-center gap-2 mb-4">
            <Link
              href="/"
              className="uppercase tracking-[0.25em] text-xs text-gold-light hover:text-gold transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={12} className="text-gold-light/50" />
            <span className="uppercase tracking-[0.25em] text-xs text-white/60">
              {category.name}
            </span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light leading-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-white/60 max-w-xl text-sm leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar + grid */}
      <div className="mx-auto max-w-[1380px] px-6 py-12 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="md:w-52 shrink-0">
          <h3 className="text-ink font-serif text-lg mb-4 border-b border-line pb-2">
            Categories
          </h3>
          <ul className="space-y-1">
            {allCategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`flex items-center justify-between py-1.5 px-2 rounded text-sm transition-colors ${
                    c.slug === slug
                      ? "text-gold font-medium bg-gold/5 border-l-2 border-gold pl-3"
                      : "text-ink hover:text-gold hover:bg-soft"
                  }`}
                >
                  <span>{c.name}</span>
                  {c._count && (
                    <span className="text-muted text-xs ml-2">{c._count.products}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted text-sm">
              <span className="text-ink font-medium">{products.length}</span> products
            </p>
            <CategorySort currentSort={sort} />
          </div>

          {products.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <p className="font-serif text-xl text-muted italic">
                No products in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </main>
      </div>
    </div>
  );
}
