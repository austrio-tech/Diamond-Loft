import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Star, Heart, ShoppingBag, MessageCircle, Truck, RefreshCw, Shield } from "lucide-react";
import { getProductById, getCategoryBySlug, getProductsByCategory, STORE_INFO } from "../data/db";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty]                 = useState(1);
  const [wished, setWished]           = useState(false);
  const [added, setAdded]             = useState(false);

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/shop">Browse all jewellery</Link>
      </div>
    );
  }

  const category = getCategoryBySlug(product.categoryId);
  const related  = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const waNumber = STORE_INFO.whatsapp.replace(/\D/g, "");
  const waMsg    = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (PKR ${product.price.toLocaleString()}). Can you help?`
  );

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb pd-breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <ChevronRight size={14} className="breadcrumb__sep" />
          {category && (
            <>
              <Link to={`/category/${category.slug}`} className="breadcrumb__link">
                {category.name}
              </Link>
              <ChevronRight size={14} className="breadcrumb__sep" />
            </>
          )}
          <span className="breadcrumb__current breadcrumb__current--dark">{product.name}</span>
        </nav>

        <div className="pd-layout">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              <img
                src={product.images[selectedImg] || product.image}
                alt={product.name}
                className="pd-gallery__img"
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
              />
              {discount && <span className="pd-gallery__badge">-{discount}%</span>}
              {!product.inStock && (
                <div className="pd-gallery__oos-overlay">Out of Stock</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="pd-gallery__thumbs">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb${i === selectedImg ? " pd-gallery__thumb--active" : ""}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img
                      src={src}
                      alt={`View ${i + 1}`}
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.badge && (
              <span className={`pcard__badge pcard__badge--${product.badge.toLowerCase()} pd-badge`}>
                {product.badge}
              </span>
            )}

            <h1 className="pd-info__name">{product.name}</h1>

            {/* Rating */}
            <div className="pd-info__rating">
              <div className="pd-info__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                    className="pd-star"
                  />
                ))}
              </div>
              <span className="pd-info__rating-val">{product.rating}</span>
              <span className="pd-info__reviews">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="pd-info__price-row">
              <span className="pd-info__price">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="pd-info__original">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="pd-info__save">Save {discount}%</span>
              )}
            </div>

            <p className="pd-info__desc">{product.description}</p>

            {/* Details */}
            <div className="pd-info__details">
              <div className="pd-detail">
                <span className="pd-detail__label">Material</span>
                <span className="pd-detail__val">{product.material}</span>
              </div>
              <div className="pd-detail">
                <span className="pd-detail__label">Weight</span>
                <span className="pd-detail__val">{product.weight}</span>
              </div>
              <div className="pd-detail">
                <span className="pd-detail__label">Size</span>
                <span className="pd-detail__val">{product.size}</span>
              </div>
            </div>

            {/* Quantity + Add to cart */}
            {product.inStock ? (
              <>
                <div className="pd-info__qty-row">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >−</button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
                  </div>

                  <button
                    className={`pd-add-btn${added ? " pd-add-btn--added" : ""}`}
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag size={18} />
                    {added ? "Added!" : "Add to Cart"}
                  </button>

                  <button
                    className={`pd-wish-btn${wished ? " pd-wish-btn--active" : ""}`}
                    onClick={() => setWished((v) => !v)}
                    aria-label="Wishlist"
                  >
                    <Heart size={18} fill={wished ? "currentColor" : "none"} />
                  </button>
                </div>
              </>
            ) : (
              <p className="pd-oos-msg">Currently out of stock</p>
            )}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${waNumber}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-wa-btn"
            >
              <MessageCircle size={18} />
              Ask on WhatsApp
            </a>

            {/* Trust pills */}
            <div className="pd-trust">
              <span className="pd-trust-item"><Truck size={14} /> Free Shipping above PKR 3,000</span>
              <span className="pd-trust-item"><RefreshCw size={14} /> 30-Day Returns</span>
              <span className="pd-trust-item"><Shield size={14} /> Authentic Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="pd-related">
            <div className="section-header">
              <p className="section-label">You May Also Like</p>
              <h2 className="section-title">Related Pieces</h2>
            </div>
            <div className="pd-related__grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
