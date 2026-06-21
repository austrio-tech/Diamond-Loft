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
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

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

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="bg-page min-h-screen">
      <div className="container-site py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center flex-wrap gap-1 text-[12px] text-muted">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li className="text-line">
              <ChevronRight size={13} />
            </li>
            <li>
              <Link href="/shop" className="hover:text-gold transition-colors">
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <li className="text-line">
                  <ChevronRight size={13} />
                </li>
                <li>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="hover:text-gold transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-line">
              <ChevronRight size={13} />
            </li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square border border-line rounded-card overflow-hidden bg-surface">
              <img
                src={allImages[selectedImg] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover sepia-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                }}
              />
              {product.badge && (
                <span
                  className={`absolute top-3 left-3 text-[10px] [font-variant:small-caps] tracking-wide px-2 py-0.5 rounded-card pcard__badge--${badgeSlug(product.badge)}`}
                >
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-[#f1e6cf] [font-variant:small-caps] tracking-widest text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((src, idx) => (
                  <button
                    key={idx}
                    className={[
                      "w-16 h-16 flex-shrink-0 border rounded-card overflow-hidden transition-colors",
                      idx === selectedImg
                        ? "border-gold"
                        : "border-line hover:border-gold",
                    ].join(" ")}
                    onClick={() => setSelectedImg(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover sepia-img"
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
          <div className="flex flex-col gap-5">
            {product.badge && (
              <span
                className={`self-start text-[10px] [font-variant:small-caps] tracking-wide px-2 py-0.5 rounded-card pcard__badge--${badgeSlug(product.badge)}`}
              >
                {product.badge}
              </span>
            )}

            <h1 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] text-ink font-medium leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.rating)
                        ? "text-gold"
                        : "text-line"
                    }
                    fill={
                      i < Math.round(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-line">
              <span className="font-serif text-2xl text-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice !== null && (
                <span className="text-muted text-base line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discount !== null && (
                <span className="text-[11px] [font-variant:small-caps] tracking-wide bg-gold/15 text-gold-dark px-2 py-0.5 rounded-card">
                  Save {discount}%
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-muted text-[15px] leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Details */}
            {(product.material || product.weight || product.size) && (
              <div className="flex flex-col gap-2 py-3 border-y border-line">
                {product.material && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted [font-variant:small-caps] tracking-wide">
                      Material
                    </span>
                    <span className="text-ink">{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted [font-variant:small-caps] tracking-wide">
                      Weight
                    </span>
                    <span className="text-ink">{product.weight}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted [font-variant:small-caps] tracking-wide">
                      Size
                    </span>
                    <span className="text-ink">{product.size}</span>
                  </div>
                )}
              </div>
            )}

            {product.inStock ? (
              <>
                {/* Qty + Add to cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-line rounded-card">
                    <button
                      className="w-9 h-10 flex items-center justify-center text-muted hover:text-gold transition-colors"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-ink text-sm">
                      {qty}
                    </span>
                    <button
                      className="w-9 h-10 flex items-center justify-center text-muted hover:text-gold transition-colors"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={[
                      "flex-1 flex items-center justify-center gap-2 py-3 text-sm [font-variant:small-caps] tracking-widest transition-colors",
                      added
                        ? "bg-gold text-[#f7efe0]"
                        : "bg-ink-deep text-[#f1e6cf] hover:bg-ink",
                    ].join(" ")}
                    onClick={handleAddToCart}
                  >
                    {added ? (
                      <>
                        <Star size={15} /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    className={[
                      "w-11 h-11 flex items-center justify-center border rounded-card transition-colors",
                      wished
                        ? "border-gold text-gold"
                        : "border-line text-muted hover:border-gold hover:text-gold",
                    ].join(" ")}
                    onClick={() => toggle(product.id)}
                    aria-label={
                      wished ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <Heart size={17} fill={wished ? "currentColor" : "none"} />
                  </button>
                </div>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#25d366] text-[#25d366] py-3 text-sm [font-variant:small-caps] tracking-wide hover:bg-[#25d366] hover:text-white transition-colors rounded-card"
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </a>
              </>
            ) : (
              <p className="text-muted text-sm italic">
                This item is currently out of stock. Contact us on WhatsApp to
                be notified.
              </p>
            )}

            {/* Trust strip */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-line">
              {[
                { Icon: Truck, text: "Free delivery on orders over PKR 3,000" },
                { Icon: RefreshCw, text: "7-day easy returns" },
                { Icon: Shield, text: "Secure & trusted checkout" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-muted">
                  <Icon size={15} className="text-gold flex-shrink-0" strokeWidth={1.5} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="ornament mb-10">❦</div>
            <Reveal className="text-center mb-10">
              <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-ink font-medium">
                You May Also Like
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    </div>
  );
}
