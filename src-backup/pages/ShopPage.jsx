import { useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/db";
import ProductCard from "../components/ProductCard";
import "./ShopPage.css";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = PRODUCTS.filter(
    (p) => activeCategory === "all" || p.categoryId === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="shop-page">
      {/* Banner */}
      <div className="shop-page__banner">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb__link">Home</Link>
            <ChevronRight size={14} className="breadcrumb__sep" />
            <span className="breadcrumb__current" style={{ color: "rgba(255,255,255,0.8)" }}>
              All Jewellery
            </span>
          </nav>
          <h1 className="shop-page__title">All Jewellery</h1>
          <p className="shop-page__subtitle">
            {PRODUCTS.length} handcrafted pieces, waiting for you.
          </p>
        </div>
      </div>

      <div className="container shop-page__body">
        {/* Category filter pills */}
        <div className="shop-page__filters">
          <button
            className={`filter-pill${activeCategory === "all" ? " filter-pill--active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            All ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = PRODUCTS.filter((p) => p.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                className={`filter-pill${activeCategory === c.id ? " filter-pill--active" : ""}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.name} ({count})
              </button>
            );
          })}

          {activeCategory !== "all" && (
            <button
              className="filter-clear"
              onClick={() => setActiveCategory("all")}
            >
              <X size={14} /> Clear
            </button>
          )}

          {/* Sort — pushed to right */}
          <div className="shop-page__sort-wrap">
            <SlidersHorizontal size={15} />
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="shop-page__grid">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
