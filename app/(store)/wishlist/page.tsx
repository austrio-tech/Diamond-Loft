"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/store/ProductCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Product } from "@/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.size === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(
      Array.from(ids).map((id) =>
        fetch(`/api/products/${id}`)
          .then((r) => (r.ok ? (r.json() as Promise<Product>) : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) {
        setProducts(results.filter((p): p is Product => p !== null));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1380px] px-6 py-24 text-center">
        <p className="text-muted font-body">Loading your wishlist…</p>
      </div>
    );
  }

  if (ids.size === 0 || products.length === 0) {
    return (
      <div className="mx-auto max-w-[1380px] px-6 py-24 flex flex-col items-center text-center">
        <Heart
          size={52}
          strokeWidth={1.2}
          className="text-muted opacity-30 mb-5"
        />
        <h2 className="font-serif text-3xl text-ink font-light mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-7 max-w-sm">
          Save pieces you love and come back to them anytime.
        </p>
        <Link
          href="/shop"
          className="inline-block border border-gold text-gold hover:bg-gold hover:text-white transition-colors px-8 py-3 uppercase tracking-[0.2em] text-xs"
        >
          Browse Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-16">
      {/* Section header */}
      <div className="mb-10 text-center">
        <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">
          Saved Items
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink font-light">
          Your Wishlist
        </h1>
      </div>

      <Stagger className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
