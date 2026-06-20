import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className="pcard">
      <div className="pcard__img-wrap">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="pcard__img"
            loading="lazy"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />
        </Link>

        {/* Badges */}
        <div className="pcard__badges">
          {product.badge && (
            <span className={`pcard__badge pcard__badge--${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="pcard__badge pcard__badge--discount">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`pcard__wish${wished ? " pcard__wish--active" : ""}`}
          onClick={() => setWished((v) => !v)}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick add overlay */}
        <div className="pcard__hover-actions">
          <Link to={`/product/${product.id}`} className="pcard__quick-view">
            Quick View
          </Link>
          <button
            className="pcard__quick-add"
            disabled={!product.inStock}
            onClick={() => product.inStock && addToCart(product, 1)}
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      <div className="pcard__body">
        {/* Rating */}
        <div className="pcard__rating">
          <Star size={12} fill="currentColor" className="pcard__star" />
          <span className="pcard__rating-val">{product.rating}</span>
          <span className="pcard__reviews">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="pcard__name">{product.name}</h3>
        </Link>

        <div className="pcard__price-row">
          <span className="pcard__price">PKR {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="pcard__original">
              PKR {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {!product.inStock && (
          <span className="pcard__oos">Out of Stock</span>
        )}
      </div>
    </article>
  );
}
