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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="font-serif text-3xl font-normal text-ink">
          Your cart is empty
        </h1>
        <p className="text-muted text-sm">
          Browse our collection and add something beautiful.
        </p>
        <Link href="/shop" className="btn btn--primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-page min-h-screen pb-20">
      {/* Page header */}
      <div className="bg-ink-deep py-12 md:pt-14 md:pb-10">
        <div className="mx-auto max-w-[1380px] px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-4">
            <Link
              href="/"
              className="text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              Home
            </Link>
            <span className="text-white/40 text-xs">/</span>
            <span className="text-xs text-gold-light font-medium [font-variant:small-caps] tracking-wide">
              Checkout
            </span>
          </nav>
          <h1 className="font-serif text-[clamp(28px,4vw,48px)] font-normal text-white">
            Checkout
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1380px] px-6 pt-10">
        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid gap-8 items-start lg:grid-cols-[1fr_380px]">
            {/* Left column: form */}
            <div className="flex flex-col gap-6">
              {/* Contact Information */}
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                <h2 className="font-serif text-xl font-normal text-ink mb-5">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="co-name" className="text-xs uppercase tracking-[0.15em] text-muted mb-1 block">
                      Full Name
                    </label>
                    <input
                      id="co-name"
                      className="w-full border border-line bg-page px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold placeholder:text-muted/60"
                      type="text"
                      placeholder="e.g. Sara Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="co-phone" className="text-xs uppercase tracking-[0.15em] text-muted mb-1 block">
                      Phone Number
                    </label>
                    <input
                      id="co-phone"
                      className={`w-full border bg-page px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold placeholder:text-muted/60 ${phoneError ? "border-red-400" : "border-line"}`}
                      type="tel"
                      placeholder="e.g. 0312-3456789"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                      required
                    />
                    {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="co-address" className="text-xs uppercase tracking-[0.15em] text-muted mb-1 block">
                      Delivery Address
                    </label>
                    <input
                      id="co-address"
                      className="w-full border border-line bg-page px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold placeholder:text-muted/60"
                      type="text"
                      placeholder="Street, area, landmark…"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="co-city" className="text-xs uppercase tracking-[0.15em] text-muted mb-1 block">
                      City
                    </label>
                    <input
                      id="co-city"
                      className="w-full border border-line bg-page px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold placeholder:text-muted/60"
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
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                <h2 className="font-serif text-xl font-normal text-ink mb-5">
                  Payment Method
                </h2>

                {/* Top-level choice */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <button
                    type="button"
                    onClick={() => setPayTop("cod")}
                    className={`border p-4 rounded text-left transition hover:border-gold ${payTop === "cod" ? "border-gold bg-gold/5" : "border-line bg-page"}`}
                  >
                    <span className="block text-xl mb-1">🚚</span>
                    <span className="block text-sm font-medium text-ink">Cash on Delivery</span>
                    <span className="block text-xs text-muted mt-0.5">Pay when you receive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayTop("manual")}
                    className={`border p-4 rounded text-left transition hover:border-gold ${payTop === "manual" ? "border-gold bg-gold/5" : "border-line bg-page"}`}
                  >
                    <span className="block text-xl mb-1">💳</span>
                    <span className="block text-sm font-medium text-ink">Pay Now</span>
                    <span className="block text-xs text-muted mt-0.5">Bank / JazzCash / EasyPaisa</span>
                  </button>
                </div>

                {payTop === "cod" && (
                  <div className="bg-soft rounded p-4 text-sm text-muted">
                    Pay in cash when your order arrives at your doorstep. No advance payment required.
                  </div>
                )}

                {payTop === "manual" && (
                  <div>
                    {/* Sub-method tabs */}
                    <div className="flex gap-2 mb-4">
                      {(["bank", "jazzcash", "easypaisa"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setManualMethod(m)}
                          className={`uppercase tracking-[0.15em] text-xs px-3 py-1.5 border transition ${manualMethod === m ? "border-gold text-gold bg-gold/5" : "border-line text-muted hover:border-gold hover:text-gold"}`}
                        >
                          {m === "bank" ? "Bank Transfer" : m === "jazzcash" ? "JazzCash" : "EasyPaisa"}
                        </button>
                      ))}
                    </div>

                    {/* Account details */}
                    {manualMethod === "bank" && (
                      <div className="bg-soft border border-line rounded-card p-5 text-sm">
                        <p className="font-serif text-base font-normal text-ink mb-3">{BANK_DETAILS.bankName}</p>
                        <div className="flex justify-between py-1.5 border-b border-line/50">
                          <span className="text-muted">Account Title</span>
                          <strong className="text-ink font-medium">{BANK_DETAILS.title}</strong>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-line/50">
                          <span className="text-muted">Account No.</span>
                          <strong className="text-ink font-medium">{BANK_DETAILS.account}</strong>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-muted">IBAN</span>
                          <strong className="text-ink font-medium">{BANK_DETAILS.iban}</strong>
                        </div>
                        <p className="text-muted text-xs mt-3 leading-relaxed">Transfer the total amount, then upload your payment receipt below.</p>
                      </div>
                    )}

                    {manualMethod === "jazzcash" && (
                      <div className="bg-soft border border-line rounded-card p-5 text-sm">
                        <div className="mb-3">
                          <div className="border border-line rounded p-4 bg-surface inline-block">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">JazzCash</p>
                            <p className="text-sm text-ink font-medium">Diamond Loft</p>
                            <p className="text-base font-serif text-gold-dark">{JAZZCASH_NUMBER}</p>
                          </div>
                        </div>
                        <p className="text-muted text-xs leading-relaxed">Send the amount to the above JazzCash number, then upload your receipt screenshot below.</p>
                      </div>
                    )}

                    {manualMethod === "easypaisa" && (
                      <div className="bg-soft border border-line rounded-card p-5 text-sm">
                        <div className="mb-3">
                          <div className="border border-line rounded p-4 bg-surface inline-block">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">EasyPaisa</p>
                            <p className="text-sm text-ink font-medium">Diamond Loft</p>
                            <p className="text-base font-serif text-gold-dark">{EASYPAISA_NUMBER}</p>
                          </div>
                        </div>
                        <p className="text-muted text-xs leading-relaxed">Send the amount to the above EasyPaisa number, then upload your receipt screenshot below.</p>
                      </div>
                    )}

                    {/* Receipt upload */}
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-muted mb-2 block">
                        Payment Receipt <span className="text-red-500">*</span>
                      </p>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleReceiptUpload}
                      />
                      {!receiptUrl ? (
                        <button
                          type="button"
                          className="w-full border border-dashed border-line py-3 text-sm text-muted hover:border-gold hover:text-gold transition disabled:opacity-50"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploadingReceipt}
                        >
                          {uploadingReceipt ? "Uploading…" : "Upload Receipt"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 mt-2">
                          <img
                            src={receiptUrl}
                            alt="Receipt preview"
                            className="w-20 h-20 object-cover rounded border border-line"
                          />
                          <div>
                            <p className="text-sm text-green-600 font-semibold mb-1">Receipt uploaded</p>
                            <button
                              type="button"
                              className="text-xs text-muted underline hover:text-ink transition"
                              onClick={() => { setReceiptUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                      {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: order summary + CTA */}
            <div>
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8 sticky top-[90px]">
                <h2 className="font-serif text-xl font-normal text-ink mb-5">Order Summary</h2>
                <div className="flex flex-col">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2.5 border-b border-dashed border-line text-sm"
                    >
                      <span className="text-ink">
                        {item.name}{" "}
                        <span className="text-muted">× {item.qty}</span>
                      </span>
                      <span className="font-semibold text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3.5 text-base font-bold text-ink">
                    <span>Total</span>
                    <span className="text-gold-dark">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-600 mt-4">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-ink-deep text-[#f1e6cf] py-3 uppercase tracking-[0.2em] text-xs font-medium hover:bg-gold transition disabled:opacity-50 mt-5"
                  disabled={submitting}
                >
                  {submitting ? "Placing Order…" : "Place Order"}
                </button>

                <p className="text-[11px] text-muted text-center mt-2.5 leading-relaxed">
                  By placing your order you agree to our terms &amp; conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
