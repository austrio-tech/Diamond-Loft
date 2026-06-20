"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { calcDiscount, formatPrice, badgeSlug, STORE_INFO } from "@/lib/utils";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product.id);

  const discount = calcDiscount(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waMsg = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" (${formatPrice(product.price)}). Can you help?`
  );
  const waHref = `https://wa.me/${STORE_INFO.whatsappClean}?text=${waMsg}`;

  // Build the full image list (primary + extras)
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <ol className="breadcrumb">
            <li>
              <Link href="/" className="breadcrumb__link">
                Home
              </Link>
            </li>
            <li className="breadcrumb__sep">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link href="/shop" className="breadcrumb__link">
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <li className="breadcrumb__sep">
                  <ChevronRight size={14} />
                </li>
                <li>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="breadcrumb__link"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="breadcrumb__sep">
              <ChevronRight size={14} />
            </li>
            <li>
              <span className="breadcrumb__current breadcrumb__current--dark">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Main layout */}
        <div className="pd-layout">
          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              <img
                src={allImages[selectedImg] ?? product.image}
                alt={product.name}
                className="pd-gallery__img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
              {product.badge && (
                <span
                  className={`pd-gallery__badge pcard__badge--${badgeSlug(product.badge)}`}
                >
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="pd-gallery__oos-overlay">Out of Stock</div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="pd-gallery__thumbs">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    className={`pd-gallery__thumb${idx === selectedImg ? " pd-gallery__thumb--active" : ""}`}
                    onClick={() => setSelectedImg(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${idx + 1}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.badge && (
              <span
                className={`pcard__badge pd-badge pcard__badge--${badgeSlug(product.badge)}`}
              >
                {product.badge}
              </span>
            )}

            <h1 className="pd-info__name">{product.name}</h1>

            <div className="pd-info__rating">
              <div className="pd-info__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`pd-star${i < Math.round(product.rating) ? " pd-star--filled" : ""}`}
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="pd-info__rating-val">{product.rating}</span>
              <span className="pd-info__reviews">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="pd-info__price-row">
              <span className="pd-info__price">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice !== null && (
                <span className="pd-info__original">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount !== null && (
                <span className="pd-info__save">Save {discount}%</span>
              )}
            </div>

            {product.description && (
              <p className="pd-info__desc">{product.description}</p>
            )}

            <div className="pd-info__details">
              {product.material && (
                <div className="pd-detail">
                  <span className="pd-detail__label">Material</span>
                  <span className="pd-detail__val">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="pd-detail">
                  <span className="pd-detail__label">Weight</span>
                  <span className="pd-detail__val">{product.weight}</span>
                </div>
              )}
              {product.size && (
                <div className="pd-detail">
                  <span className="pd-detail__label">Size</span>
                  <span className="pd-detail__val">{product.size}</span>
                </div>
              )}
            </div>

            {product.inStock ? (
              <>
                <div className="pd-info__qty-row">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <span>−</span>
                    </button>
                    <span className="qty-val">{qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <span>+</span>
                    </button>
                  </div>

                  <button
                    className={`pd-add-btn${added ? " pd-add-btn--added" : ""}`}
                    onClick={handleAddToCart}
                  >
                    {added ? (
                      <>
                        <Star size={18} /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    className={`pd-wish-btn${wished ? " pd-wish-btn--active" : ""}`}
                    onClick={() => toggle(product.id)}
                    aria-label={
                      wished ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart size={20} />
                  </button>
                </div>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-wa-btn"
                >
                  <MessageCircle size={18} /> Ask on WhatsApp
                </a>
              </>
            ) : (
              <p className="pd-oos-msg">
                This item is currently out of stock. Contact us on WhatsApp to
                be notified.
              </p>
            )}

            {/* Trust icons */}
            <div className="pd-trust">
              <div className="pd-trust-item">
                <Truck size={18} />
                <span>Free delivery on orders over PKR 3,000</span>
              </div>
              <div className="pd-trust-item">
                <RefreshCw size={18} />
                <span>7-day easy returns</span>
              </div>
              <div className="pd-trust-item">
                <Shield size={18} />
                <span>Secure &amp; trusted checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2>You May Also Like</h2>
            <div className="pd-related__grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
