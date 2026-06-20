import { useParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { getCategoryBySlug, getProductsByCategory, CATEGORIES } from "../data/db";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="not-found">
        <h2>Category not found</h2>
        <Link to="/shop">Browse all jewellery</Link>
      </div>
    );
  }

  return (
    <div className="cat-page">
      {/* Banner */}
      <div className="cat-page__banner">
        <img src={category.image} alt={category.name} className="cat-page__banner-img" />
        <div className="cat-page__banner-overlay" />
        <div className="cat-page__banner-content container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <ChevronRight size={14} className="breadcrumb__sep" />
            <span className="breadcrumb__current">{category.name}</span>
          </nav>
          <h1 className="cat-page__title">{category.name}</h1>
          <p className="cat-page__desc">{category.description}</p>
        </div>
      </div>

      {/* Sidebar categories + product grid */}
      <div className="container cat-page__body">
        {/* Sidebar */}
        <aside className="cat-page__sidebar">
          <h3 className="sidebar__heading">Categories</h3>
          <ul className="sidebar__list">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/category/${c.slug}`}
                  className={`sidebar__link${c.slug === slug ? " sidebar__link--active" : ""}`}
                >
                  {c.name}
                  <span className="sidebar__count">
                    {getProductsByCategory(c.slug).length}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="cat-page__main">
          <div className="cat-page__toolbar">
            <p className="cat-page__count">{products.length} products</p>
            <div className="cat-page__sort">
              <SlidersHorizontal size={15} />
              <select className="sort-select" defaultValue="featured">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
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
