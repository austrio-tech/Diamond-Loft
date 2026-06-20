"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useRef,
} from "react";
import type { CartItem, CartAction, Product } from "@/types";

const STORAGE_KEY = "dl-cart";

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex((i) => i.id === action.product.id);
      if (idx !== -1) {
        return state.map((i, n) =>
          n === idx ? { ...i, qty: i.qty + action.qty } : i
        );
      }
      return [...state, { ...action.product, qty: action.qty }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "UPDATE":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.items;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        dispatch({ type: "HYDRATE", items: parsed });
      }
    } catch {
      // ignore corrupt storage
    }
    hydrated.current = true;
  }, []);

  // Persist on change (only after initial hydration)
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addToCart = (product: Product, qty = 1) => {
    dispatch({ type: "ADD", product, qty });
    setIsOpen(true);
  };
  const removeFromCart = (id: number) => dispatch({ type: "REMOVE", id });
  const updateQty = (id: number, qty: number) =>
    dispatch({ type: "UPDATE", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
