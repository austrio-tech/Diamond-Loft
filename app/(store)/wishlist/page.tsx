"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/store/ProductCard";
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
      <div className="container" style={{ paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}>
        <p>Loading your wishlist…</p>
      </div>
    );
  }

  if (ids.size === 0 || products.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "6rem", paddingBottom: "6rem", textAlign: "center" }}>
        <Heart size={52} strokeWidth={1.2} style={{ opacity: 0.3, marginBottom: "1rem" }} />
        <h2 style={{ marginBottom: "0.75rem" }}>Your wishlist is empty</h2>
        <p style={{ marginBottom: "1.5rem", opacity: 0.6 }}>
          Save pieces you love and come back to them anytime.
        </p>
        <Link href="/shop" className="btn btn--primary">Browse Jewellery</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
      <div className="section-header">
        <p className="section-label">Saved Items</p>
        <h1 className="section-title">Your Wishlist</h1>
      </div>
      <div className="shop-page__grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
