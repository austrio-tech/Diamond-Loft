"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { calcDiscount, badgeSlug, formatPrice } from "@/lib/utils";
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
    <article className="pcard">
      <div className="pcard__img-wrap">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="pcard__img"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </Link>

        <div className="pcard__badges">
          {product.badge && (
            <span
              className={`pcard__badge pcard__badge--${badgeSlug(product.badge)}`}
            >
              {product.badge}
            </span>
          )}
          {discount !== null && (
            <span className="pcard__badge pcard__badge--sale">
              -{discount}%
            </span>
          )}
        </div>

        <button
          className={`pcard__wish${wished ? " pcard__wish--active" : ""}`}
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} />
        </button>

        <div className="pcard__hover-actions">
          <Link href={`/product/${product.id}`} className="pcard__quick-view">
            Quick View
          </Link>
          <button
            className="pcard__quick-add"
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="pcard__body">
        <div className="pcard__rating">
          <Star size={12} fill="currentColor" />
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="pcard__name">{product.name}</h3>
        </Link>

        <div className="pcard__price-row">
          <span className="pcard__price">{formatPrice(product.price)}</span>
          {product.originalPrice !== null && (
            <span className="pcard__original">
              {formatPrice(product.originalPrice)}
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
