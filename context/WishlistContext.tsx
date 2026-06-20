"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const STORAGE_KEY = "dl-wishlist";

interface WishlistContextValue {
  ids: Set<number>;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(new Set());
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        setIds(new Set(parsed));
      }
    } catch {
      // ignore
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch {
      // ignore
    }
  }, [ids]);

  const toggle = (id: number) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const has = (id: number) => ids.has(id);

  return (
    <WishlistContext.Provider value={{ ids, toggle, has, count: ids.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
