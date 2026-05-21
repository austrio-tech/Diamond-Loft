import { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ChevronLeft, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

// ── Update these with your real payment details ─────────────
const BANK = {
  bankName:  "Habib Bank Limited (HBL)",
  title:     "Diamond Loft",
  account:   "0001-23456789-01",
  iban:      "PK36 HABB 0000 1234 5678 9001",
};
const JAZZCASH  = { title: "Diamond Loft", number: "0300-0000000" };
const EASYPAISA = { title: "Diamond Loft", number: "0300-0000001" };
// ───────────────────────────────────────────────────────────

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=160&q=70";

export default function CartDrawer({ onClose }) {
  const { items, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const [step, setStep]           = useState("cart"); // cart | checkout | done
  const [payMethod, setPayMethod] = useState("bank");
  const [form, setForm]           = useState({ name: "", phone: "", address: "", city: "" });

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleOrder = (e) => {
    e.preventDefault();
    clearCart();
    setStep("done");
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">

        {/* ── Header ─────────────────────────────────── */}
        <div className="cart-drawer__hd">
          {step === "checkout" && (
            <button className="cart-drawer__back" onClick={() => setStep("cart")}>
              <ChevronLeft size={17} /> Back
            </button>
          )}
          <h2 className="cart-drawer__title">
            {step === "cart"     && "Your Cart"}
            {step === "checkout" && "Checkout"}
            {step === "done"     && "Order Confirmed"}
          </h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* ── CART ───────────────────────────────────── */}
        {step === "cart" && (
          items.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={52} strokeWidth={1.2} />
              <p>Your cart is empty</p>
              <button className="cart-drawer__outline-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-drawer__items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item__img"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
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
                          disabled={item.qty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-val">{item.qty}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-item__del"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-drawer__ft">
                <div className="cart-drawer__total-row">
                  <span>Subtotal</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <p className="cart-drawer__note">Shipping calculated at checkout</p>
                <button className="cart-drawer__cta" onClick={() => setStep("checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )
        )}

        {/* ── CHECKOUT ───────────────────────────────── */}
        {step === "checkout" && (
          <form className="cart-checkout" onSubmit={handleOrder}>
            <div className="cart-checkout__scroll">

              {/* Delivery */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Delivery Details</h3>
                <div className="cart-co-fields">
                  <div className="cart-co-field">
                    <label>Full Name *</label>
                    <input
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={form.name}
                      onChange={field("name")}
                    />
                  </div>
                  <div className="cart-co-field">
                    <label>Phone Number *</label>
                    <input
                      required
                      placeholder="03XX-XXXXXXX"
                      value={form.phone}
                      onChange={field("phone")}
                    />
                  </div>
                  <div className="cart-co-field cart-co-field--full">
                    <label>Delivery Address *</label>
                    <input
                      required
                      placeholder="Street, House No., Area"
                      value={form.address}
                      onChange={field("address")}
                    />
                  </div>
                  <div className="cart-co-field">
                    <label>City *</label>
                    <input
                      required
                      placeholder="e.g. Lahore"
                      value={form.city}
                      onChange={field("city")}
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Payment Method</h3>

                <div className="pay-tabs">
                  <button
                    type="button"
                    className={`pay-tab${payMethod === "bank" ? " pay-tab--on" : ""}`}
                    onClick={() => setPayMethod("bank")}
                  >
                    🏦 Bank Transfer
                  </button>
                  <button
                    type="button"
                    className={`pay-tab${payMethod === "mobile" ? " pay-tab--on" : ""}`}
                    onClick={() => setPayMethod("mobile")}
                  >
                    📱 JazzCash / EasyPaisa
                  </button>
                </div>

                {payMethod === "bank" && (
                  <div className="pay-info">
                    <p className="pay-info__heading">Transfer to this account</p>
                    <div className="pay-info__row">
                      <span>Bank</span>
                      <strong>{BANK.bankName}</strong>
                    </div>
                    <div className="pay-info__row">
                      <span>Account Title</span>
                      <strong>{BANK.title}</strong>
                    </div>
                    <div className="pay-info__row">
                      <span>Account No.</span>
                      <strong>{BANK.account}</strong>
                    </div>
                    <div className="pay-info__row">
                      <span>IBAN</span>
                      <strong>{BANK.iban}</strong>
                    </div>
                    <p className="pay-info__note">
                      After transfer, send the receipt screenshot on WhatsApp to confirm your order.
                    </p>
                  </div>
                )}

                {payMethod === "mobile" && (
                  <div className="pay-info">
                    <div className="pay-mobile-grid">
                      <div className="pay-mobile-card pay-mobile-card--jazz">
                        <span className="pay-mobile-card__brand">JazzCash</span>
                        <span className="pay-mobile-card__label">{JAZZCASH.title}</span>
                        <span className="pay-mobile-card__number">{JAZZCASH.number}</span>
                      </div>
                      <div className="pay-mobile-card pay-mobile-card--easy">
                        <span className="pay-mobile-card__brand">EasyPaisa</span>
                        <span className="pay-mobile-card__label">{EASYPAISA.title}</span>
                        <span className="pay-mobile-card__number">{EASYPAISA.number}</span>
                      </div>
                    </div>
                    <p className="pay-info__note">
                      Send payment to either wallet, then share the screenshot on WhatsApp to confirm your order.
                    </p>
                  </div>
                )}
              </section>

              {/* Order summary */}
              <section className="cart-co-section">
                <h3 className="cart-co-section__title">Order Summary</h3>
                <div className="cart-co-summary">
                  {items.map((item) => (
                    <div key={item.id} className="cart-co-sum-row">
                      <span>{item.name} × {item.qty}</span>
                      <span>PKR {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="cart-co-sum-row cart-co-sum-row--total">
                    <span>Total</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </section>

            </div>

            <div className="cart-co-submit">
              <button type="submit" className="cart-drawer__cta">
                Confirm Order
              </button>
            </div>
          </form>
        )}

        {/* ── SUCCESS ────────────────────────────────── */}
        {step === "done" && (
          <div className="cart-drawer__done">
            <div className="cart-drawer__done-icon">
              <Check size={30} />
            </div>
            <h3>Order Placed!</h3>
            <p>
              Thank you, <strong>{form.name}</strong>! We've received your order and will
              contact you at <strong>{form.phone}</strong> to confirm.
            </p>
            <p className="cart-drawer__done-note">
              Please complete your payment using the details above and send the
              receipt on WhatsApp.
            </p>
            <button className="cart-drawer__outline-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </>
  );
}
