"use client";
import { useEffect } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={closeCart} />

      {/* Drawer */}
      <aside className="cart-drawer">
        <div className="cart-drawer__hd">
          <h2 className="cart-drawer__title">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <ShoppingBag size={48} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                  <div className="cart-item__body">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">
                      PKR {(item.price * item.qty).toLocaleString()}
                    </p>
                    <div className="cart-item__qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-qty-val">{item.qty}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item__del"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__ft">
              <div className="cart-drawer__total-row">
                <span>Total</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>
              <p className="cart-drawer__note">
                Shipping calculated at checkout
              </p>
              <button
                className="cart-drawer__cta"
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
      </aside>
    </>
  );
}
