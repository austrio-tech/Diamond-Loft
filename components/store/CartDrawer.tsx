"use client";
import { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { validatePakistaniPhone } from "@/lib/utils";
import type { PaymentMethod, CreateOrderResponse } from "@/types";

// TODO: replace with real payment details before launch
const BANK = {
  bankName: "Habib Bank Limited (HBL)",
  title: "Diamond Loft",
  account: "0001-23456789-01",
  iban: "PK36 HABB 0000 1234 5678 9001",
};
const JAZZCASH = { title: "Diamond Loft", number: "0300-0000000" };
const EASYPAISA = { title: "Diamond Loft", number: "0300-0000001" };

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=160&q=70";

export default function CartDrawer() {
  const { items, removeFromCart, updateQty, clearCart, totalPrice, isOpen, closeCart } =
    useCart();

  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("bank");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderName, setOrderName] = useState("");

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    if (!validatePakistaniPhone(form.phone)) {
      setPhoneError("Enter a valid Pakistani number (e.g. 0312-3456789)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
          total: totalPrice,
          payMethod,
        }),
      });
      const data = (await res.json()) as CreateOrderResponse;
      window.open(data.whatsappUrl, "_blank");
      setOrderName(form.name);
      clearCart();
      setStep("done");
    } catch {
      setPhoneError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={closeCart} />

      {/* Drawer */}
      <aside className="cart-drawer">
        {/* ── STEP: CART ── */}
        {step === "cart" && (
          <>
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
                          (e.currentTarget as HTMLImageElement).src =
                            FALLBACK_IMG;
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
                    onClick={() => setStep("checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── STEP: CHECKOUT ── */}
        {step === "checkout" && (
          <div className="cart-checkout">
            <div className="cart-drawer__hd">
              <button
                className="cart-drawer__back"
                onClick={() => setStep("cart")}
                aria-label="Back to cart"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="cart-drawer__title">Checkout</h2>
              <button
                className="cart-drawer__close"
                onClick={closeCart}
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <form
              className="cart-checkout__scroll"
              onSubmit={handleOrder}
              noValidate
            >
              {/* Contact Info */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Contact Information</h3>
                <div className="cart-co-fields">
                  <div className="cart-co-field">
                    <label htmlFor="co-name">Full Name</label>
                    <input
                      id="co-name"
                      type="text"
                      placeholder="e.g. Sara Ahmed"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="cart-co-field">
                    <label htmlFor="co-phone">Phone Number</label>
                    <input
                      id="co-phone"
                      type="tel"
                      placeholder="e.g. 0312-3456789"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      required
                    />
                    {phoneError && (
                      <p className="cart-co-error">{phoneError}</p>
                    )}
                  </div>
                  <div className="cart-co-field cart-co-field--full">
                    <label htmlFor="co-address">Delivery Address</label>
                    <input
                      id="co-address"
                      type="text"
                      placeholder="Street, area…"
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="cart-co-field">
                    <label htmlFor="co-city">City</label>
                    <input
                      id="co-city"
                      type="text"
                      placeholder="e.g. Karachi"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Payment Method</h3>
                <div className="pay-tabs">
                  <button
                    type="button"
                    className={`pay-tab${payMethod === "bank" ? " pay-tab--on" : ""}`}
                    onClick={() => setPayMethod("bank")}
                  >
                    Bank Transfer
                  </button>
                  <button
                    type="button"
                    className={`pay-tab${payMethod === "mobile" ? " pay-tab--on" : ""}`}
                    onClick={() => setPayMethod("mobile")}
                  >
                    Mobile Wallet
                  </button>
                </div>

                {payMethod === "bank" && (
                  <div className="pay-info">
                    <p className="pay-info__heading">{BANK.bankName}</p>
                    <div className="pay-info__row">
                      <span>Account Title</span>
                      <span>{BANK.title}</span>
                    </div>
                    <div className="pay-info__row">
                      <span>Account No.</span>
                      <span>{BANK.account}</span>
                    </div>
                    <div className="pay-info__row">
                      <span>IBAN</span>
                      <span>{BANK.iban}</span>
                    </div>
                    <p className="pay-info__note">
                      Transfer the total amount and share the receipt via
                      WhatsApp after placing your order.
                    </p>
                  </div>
                )}

                {payMethod === "mobile" && (
                  <div className="pay-info">
                    <div className="pay-mobile-grid">
                      <div className="pay-mobile-card pay-mobile-card--jazz">
                        <p className="pay-mobile-card__brand">JazzCash</p>
                        <p className="pay-mobile-card__label">
                          {JAZZCASH.title}
                        </p>
                        <p className="pay-mobile-card__number">
                          {JAZZCASH.number}
                        </p>
                      </div>
                      <div className="pay-mobile-card pay-mobile-card--easy">
                        <p className="pay-mobile-card__brand">EasyPaisa</p>
                        <p className="pay-mobile-card__label">
                          {EASYPAISA.title}
                        </p>
                        <p className="pay-mobile-card__number">
                          {EASYPAISA.number}
                        </p>
                      </div>
                    </div>
                    <p className="pay-info__note">
                      Send the amount to either number and share the
                      transaction ID via WhatsApp after placing your order.
                    </p>
                  </div>
                )}
              </section>

              {/* Order Summary */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Order Summary</h3>
                <div className="cart-co-summary">
                  {items.map((item) => (
                    <div key={item.id} className="cart-co-sum-row">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>
                        PKR {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="cart-co-sum-row cart-co-sum-row--total">
                    <span>Total</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                className="cart-co-submit"
                disabled={submitting}
              >
                {submitting ? "Placing Order…" : "Place Order via WhatsApp"}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: DONE ── */}
        {step === "done" && (
          <div className="cart-drawer__done">
            <div className="cart-drawer__done-icon">
              <Check size={36} />
            </div>
            <h2>Order Placed!</h2>
            <p>
              Thank you, <strong>{orderName}</strong>! Your order has been sent
              via WhatsApp. We will confirm it shortly.
            </p>
            <button
              className="cart-drawer__outline-btn"
              onClick={() => {
                setStep("cart");
                setForm({ name: "", phone: "", address: "", city: "" });
                setPhoneError("");
                closeCart();
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
