"use client";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { calcDiscount, badgeSlug, formatPrice } from "@/lib/utils";
import { hoverLift, tapPress } from "@/lib/motion";
import type { Product } from "@/types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { toggle, has } = useWishlist();

  const wished = has(product.id);
  const discount = calcDiscount(product.price, product.originalPrice);

  return (
    <motion.article
      className="group bg-surface border border-line rounded-card shadow-card overflow-hidden"
      whileHover={hoverLift}
      whileTap={tapPress}
      transition={{ duration: 0.2 }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-page border-b border-line">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover sepia-img transition-transform duration-700 group-hover:scale-[1.04]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`text-[10px] [font-variant:small-caps] tracking-wide px-2 py-0.5 rounded-card font-medium pcard__badge--${badgeSlug(product.badge)}`}
            >
              {product.badge}
            </span>
          )}
          {discount !== null && (
            <span className="text-[10px] [font-variant:small-caps] tracking-wide px-2 py-0.5 rounded-card bg-gold/20 text-gold-dark font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={[
            "absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-surface/80 border border-line rounded-card transition-colors",
            wished ? "text-gold" : "text-muted hover:text-gold",
          ].join(" ")}
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick-add overlay — slides in on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            className="w-full py-2.5 bg-ink-deep/90 text-[#f1e6cf] text-xs [font-variant:small-caps] tracking-widest flex items-center justify-center gap-2 hover:bg-ink-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            aria-label="Add to cart"
          >
            <ShoppingBag size={13} />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 text-center">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-[18px] text-ink leading-snug mb-1 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-center gap-2">
          <span className="text-gold text-[15px] tracking-wide">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice !== null && (
            <span className="text-muted text-[13px] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {!product.inStock && (
          <span className="block mt-1 text-muted text-[11px] [font-variant:small-caps] tracking-wide">
            Out of Stock
          </span>
        )}
      </div>
    </motion.article>
  );
}
