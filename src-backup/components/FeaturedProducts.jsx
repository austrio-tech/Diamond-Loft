import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../data/db";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="featured">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Handpicked for You</p>
          <h2 className="section-title">Featured Pieces</h2>
        </div>
        <div className="featured__grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="featured__footer">
          <Link to="/shop" className="btn btn--dark">
            View All Jewellery
          </Link>
        </div>
      </div>
    </section>
  );
}
