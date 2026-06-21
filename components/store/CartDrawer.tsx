"use client";
import { useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { overlay, drawerRight } from "@/lib/motion";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=160&q=70";

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, totalPrice, isOpen, closeCart } =
    useCart();
  const router = useRouter();

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cart-overlay"
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            variants={drawerRight}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-surface border-l border-line flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2 className="font-serif text-xl text-ink tracking-wide flex items-center gap-2">
                <ShoppingBag size={18} className="text-gold" />
                Your Cart
              </h2>
              <button
                className="text-muted hover:text-gold transition-colors"
                onClick={closeCart}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
                <ShoppingBag size={44} strokeWidth={1} className="text-line" />
                <p className="text-sm [font-variant:small-caps] tracking-widest">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <>
                {/* Items */}
                <ul className="flex-1 overflow-y-auto divide-y divide-line px-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-card border border-line sepia-img flex-shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            FALLBACK_IMG;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base text-ink leading-snug mb-1 truncate">
                          {item.name}
                        </p>
                        <p className="text-gold text-sm mb-3">
                          PKR {(item.price * item.qty).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            className="w-6 h-6 flex items-center justify-center border border-line rounded-card text-muted hover:text-gold hover:border-gold transition-colors"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-sm text-ink w-5 text-center">
                            {item.qty}
                          </span>
                          <button
                            className="w-6 h-6 flex items-center justify-center border border-line rounded-card text-muted hover:text-gold hover:border-gold transition-colors"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="text-muted hover:text-gold transition-colors self-start mt-1"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-line px-6 py-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-variant:small-caps] tracking-wide text-muted">
                      Total
                    </span>
                    <span className="font-serif text-xl text-ink">
                      PKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted text-center tracking-wide">
                    Shipping calculated at checkout
                  </p>
                  <button
                    className="w-full bg-ink-deep text-[#f1e6cf] py-3.5 text-sm [font-variant:small-caps] tracking-[0.2em] hover:opacity-90 transition-opacity"
                    onClick={() => {
                      closeCart();
                      router.push("/checkout");
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
