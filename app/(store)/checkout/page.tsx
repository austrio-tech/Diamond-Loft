"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { validatePakistaniPhone, formatPrice } from "@/lib/utils";
import type { PaymentMethod, CreateOrderResponse } from "@/types";

// TODO: replace with real account details before launch
const BANK_DETAILS = {
  bankName: "Meezan Bank",
  title: "Diamond Loft",
  account: "0000 0000 0000",
  iban: "PK00 MEZN 0000 0000 0000 0000",
};
const JAZZCASH_NUMBER = "0300-0000000";
const EASYPAISA_NUMBER = "0300-0000001";

type PayTopLevel = "cod" | "manual";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [payTop, setPayTop] = useState<PayTopLevel>("cod");
  const [manualMethod, setManualMethod] = useState<"bank" | "jazzcash" | "easypaisa">("bank");

  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const payMethod: PaymentMethod = payTop === "cod" ? "cod" : manualMethod;

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadingReceipt(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/receipt", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url: string };
      setReceiptUrl(data.url);
    } catch {
      setUploadError("Receipt upload failed. Please try again.");
    } finally {
      setUploadingReceipt(false);
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    setSubmitError("");

    if (!validatePakistaniPhone(phone)) {
      setPhoneError("Enter a valid Pakistani number (e.g. 0312-3456789)");
      return;
    }
    if (payTop === "manual" && !receiptUrl) {
      setSubmitError("Please upload your payment receipt before placing the order.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
          total: totalPrice,
          payMethod,
          receiptUrl: payTop === "cod" ? null : receiptUrl,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Something went wrong");
      }

      const data = (await res.json()) as CreateOrderResponse;
      clearCart();
      router.push("/order/" + data.order.token);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "48px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, color: "var(--charcoal)" }}>
          Your cart is empty
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          Browse our collection and add something beautiful.
        </p>
        <Link href="/shop" className="btn btn--primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Page header */}
      <div style={{ background: "linear-gradient(135deg, var(--charcoal) 0%, #4a3728 100%)", padding: "48px 0 36px" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
            <Link href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>/</span>
            <span style={{ fontSize: "12px", color: "var(--gold-light)", fontWeight: 500 }}>Checkout</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#fff" }}>
            Checkout
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ paddingTop: "40px" }}>
        <form onSubmit={handlePlaceOrder} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
            {/* Left column: form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Contact Information */}
              <div className="co-card">
                <h2 className="co-card__title">Contact Information</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div className="co-field">
                    <label htmlFor="co-name" className="co-label">Full Name</label>
                    <input
                      id="co-name"
                      className="co-input"
                      type="text"
                      placeholder="e.g. Sara Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="co-field">
                    <label htmlFor="co-phone" className="co-label">Phone Number</label>
                    <input
                      id="co-phone"
                      className={"co-input" + (phoneError ? " co-input--error" : "")}
                      type="tel"
                      placeholder="e.g. 0312-3456789"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                      required
                    />
                    {phoneError && <p className="co-error">{phoneError}</p>}
                  </div>
                  <div className="co-field" style={{ gridColumn: "span 2" }}>
                    <label htmlFor="co-address" className="co-label">Delivery Address</label>
                    <input
                      id="co-address"
                      className="co-input"
                      type="text"
                      placeholder="Street, area, landmark…"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="co-field">
                    <label htmlFor="co-city" className="co-label">City</label>
                    <input
                      id="co-city"
                      className="co-input"
                      type="text"
                      placeholder="e.g. Karachi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="co-card">
                <h2 className="co-card__title">Payment Method</h2>

                {/* Top-level choice */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  <button
                    type="button"
                    className={"co-pay-option" + (payTop === "cod" ? " co-pay-option--on" : "")}
                    onClick={() => setPayTop("cod")}
                  >
                    <span className="co-pay-option__icon">🚚</span>
                    <span className="co-pay-option__label">Cash on Delivery</span>
                    <span className="co-pay-option__sub">Pay when you receive</span>
                  </button>
                  <button
                    type="button"
                    className={"co-pay-option" + (payTop === "manual" ? " co-pay-option--on" : "")}
                    onClick={() => setPayTop("manual")}
                  >
                    <span className="co-pay-option__icon">💳</span>
                    <span className="co-pay-option__label">Pay Now</span>
                    <span className="co-pay-option__sub">Bank / JazzCash / EasyPaisa</span>
                  </button>
                </div>

                {payTop === "cod" && (
                  <div style={{ background: "var(--soft)", borderRadius: "10px", padding: "14px 16px" }}>
                    <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
                      Pay in cash when your order arrives at your doorstep. No advance payment required.
                    </p>
                  </div>
                )}

                {payTop === "manual" && (
                  <div>
                    {/* Sub-method tabs */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                      {(["bank", "jazzcash", "easypaisa"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={"pay-tab" + (manualMethod === m ? " pay-tab--on" : "")}
                          onClick={() => setManualMethod(m)}
                        >
                          {m === "bank" ? "Bank Transfer" : m === "jazzcash" ? "JazzCash" : "EasyPaisa"}
                        </button>
                      ))}
                    </div>

                    {/* Account details */}
                    {manualMethod === "bank" && (
                      <div className="pay-info">
                        <p className="pay-info__heading">{BANK_DETAILS.bankName}</p>
                        <div className="pay-info__row">
                          <span>Account Title</span>
                          <strong>{BANK_DETAILS.title}</strong>
                        </div>
                        <div className="pay-info__row">
                          <span>Account No.</span>
                          <strong>{BANK_DETAILS.account}</strong>
                        </div>
                        <div className="pay-info__row">
                          <span>IBAN</span>
                          <strong>{BANK_DETAILS.iban}</strong>
                        </div>
                        <p className="pay-info__note">Transfer the total amount, then upload your payment receipt below.</p>
                      </div>
                    )}

                    {manualMethod === "jazzcash" && (
                      <div className="pay-info">
                        <div className="pay-mobile-grid">
                          <div className="pay-mobile-card pay-mobile-card--jazz">
                            <p className="pay-mobile-card__brand">JazzCash</p>
                            <p className="pay-mobile-card__label">Diamond Loft</p>
                            <p className="pay-mobile-card__number">{JAZZCASH_NUMBER}</p>
                          </div>
                        </div>
                        <p className="pay-info__note">Send the amount to the above JazzCash number, then upload your receipt screenshot below.</p>
                      </div>
                    )}

                    {manualMethod === "easypaisa" && (
                      <div className="pay-info">
                        <div className="pay-mobile-grid">
                          <div className="pay-mobile-card pay-mobile-card--easy">
                            <p className="pay-mobile-card__brand">EasyPaisa</p>
                            <p className="pay-mobile-card__label">Diamond Loft</p>
                            <p className="pay-mobile-card__number">{EASYPAISA_NUMBER}</p>
                          </div>
                        </div>
                        <p className="pay-info__note">Send the amount to the above EasyPaisa number, then upload your receipt screenshot below.</p>
                      </div>
                    )}

                    {/* Receipt upload */}
                    <div style={{ marginTop: "16px" }}>
                      <p className="co-label" style={{ marginBottom: "8px" }}>
                        Payment Receipt <span style={{ color: "#c0392b" }}>*</span>
                      </p>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: "none" }}
                        onChange={handleReceiptUpload}
                      />
                      {!receiptUrl ? (
                        <button
                          type="button"
                          className="co-upload-btn"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploadingReceipt}
                        >
                          {uploadingReceipt ? "Uploading…" : "Upload Receipt"}
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                          <img
                            src={receiptUrl}
                            alt="Receipt preview"
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1.5px solid var(--border)" }}
                          />
                          <div>
                            <p style={{ fontSize: "13px", color: "#27ae60", fontWeight: 600, marginBottom: "4px" }}>Receipt uploaded</p>
                            <button
                              type="button"
                              style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "underline" }}
                              onClick={() => { setReceiptUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                      {uploadError && <p className="co-error">{uploadError}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: order summary + CTA */}
            <div>
              <div className="co-card" style={{ position: "sticky", top: "90px" }}>
                <h2 className="co-card__title">Order Summary</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: "13px" }}>
                      <span style={{ color: "var(--charcoal)" }}>
                        {item.name} <span style={{ color: "var(--muted)" }}>× {item.qty}</span>
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", fontSize: "16px", fontWeight: 700, color: "var(--charcoal)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--gold-dark)" }}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {submitError && (
                  <div style={{ marginTop: "14px", background: "#fdf0f0", border: "1px solid #f5c6cb", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#c0392b" }}>
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="co-place-btn"
                  disabled={submitting}
                  style={{ marginTop: "20px" }}
                >
                  {submitting ? "Placing Order…" : "Place Order"}
                </button>

                <p style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "10px", lineHeight: 1.5 }}>
                  By placing your order you agree to our terms & conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
