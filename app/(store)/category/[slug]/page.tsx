import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getCategoryBySlug, getCategories, getProducts } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard";
import CategorySort from "@/components/store/CategorySort";

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
    <div className="cat-page">
      {/* Banner */}
      <div className="cat-page__banner">
        <img src={category.image} alt={category.name} className="cat-page__banner-img" />
        <div className="cat-page__banner-overlay" />
        <div className="cat-page__banner-content container">
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb__link">Home</Link>
            <ChevronRight size={14} className="breadcrumb__sep" />
            <span className="breadcrumb__current">{category.name}</span>
          </nav>
          <h1 className="cat-page__title">{category.name}</h1>
          <p className="cat-page__desc">{category.description}</p>
        </div>
      </div>

      {/* Sidebar + grid */}
      <div className="container cat-page__body">
        <aside className="cat-page__sidebar">
          <h3 className="sidebar__heading">Categories</h3>
          <ul className="sidebar__list">
            {allCategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`sidebar__link${c.slug === slug ? " sidebar__link--active" : ""}`}
                >
                  {c.name}
                  {c._count && (
                    <span className="sidebar__count">{c._count.products}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="cat-page__main">
          <div className="cat-page__toolbar">
            <p className="cat-page__count">{products.length} products</p>
            <CategorySort currentSort={sort} />
          </div>

          {products.length === 0 ? (
            <div className="cat-page__empty">
              <p>No products in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="cat-page__grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
