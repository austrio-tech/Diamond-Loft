"use client";

import { useState, useEffect } from "react";
import { Printer, Download, X } from "lucide-react";
import { formatPrice, paymentMethodLabel, STORE_INFO } from "@/lib/utils";
import type { OrderItem } from "@/types";

export interface ReceiptData {
  id: number;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  payMethod: string;
  paymentStatusLabel: string;
}

export default function OrderReceipt({ order }: { order: ReceiptData }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function downloadPdf() {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const left = 48;
      const right = pageW - 48;
      let y = 56;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(STORE_INFO.name, left, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(STORE_INFO.tagline, left, y + 16);
      doc.setTextColor(0);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("RECEIPT", right, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Order #${order.id}`, right, y + 16, { align: "right" });
      doc.text(dateStr, right, y + 30, { align: "right" });
      doc.setTextColor(0);

      y += 56;
      doc.setDrawColor(210);
      doc.line(left, y, right, y);
      y += 24;

      // Billed to
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Billed To", left, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(order.name, left, y + 16);
      doc.text(order.phone, left, y + 30);
      doc.text(`${order.address}, ${order.city}`, left, y + 44);

      // Payment
      doc.setFont("helvetica", "bold");
      doc.text("Payment", right, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(paymentMethodLabel(order.payMethod), right, y + 16, { align: "right" });
      doc.text(order.paymentStatusLabel, right, y + 30, { align: "right" });

      y += 72;

      // Items table header
      doc.setFillColor(245, 240, 232);
      doc.rect(left, y, right - left, 24, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Item", left + 10, y + 16);
      doc.text("Qty", right - 170, y + 16, { align: "right" });
      doc.text("Price", right - 90, y + 16, { align: "right" });
      doc.text("Total", right - 10, y + 16, { align: "right" });
      y += 24;

      doc.setFont("helvetica", "normal");
      order.items.forEach((item) => {
        y += 22;
        doc.text(String(item.name).slice(0, 48), left + 10, y);
        doc.text(String(item.qty), right - 170, y, { align: "right" });
        doc.text(formatPrice(item.price), right - 90, y, { align: "right" });
        doc.text(formatPrice(item.price * item.qty), right - 10, y, { align: "right" });
        doc.setDrawColor(232);
        doc.line(left, y + 8, right, y + 8);
      });

      y += 32;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Grand Total", right - 140, y, { align: "right" });
      doc.text(formatPrice(order.total), right - 10, y, { align: "right" });

      y += 48;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(140);
      doc.text(
        `Thank you for shopping with ${STORE_INFO.name}.  ${STORE_INFO.email}`,
        left,
        y
      );

      doc.save(`DiamondLoft-Receipt-${order.id}.pdf`);
      setOpen(false);
    } finally {
      setDownloading(false);
    }
  }

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    fontSize: 13,
    padding: "4px 0",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "1.5px solid var(--gold)",
          background: "var(--white)",
          color: "var(--gold-dark)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        <Printer size={16} /> Print Receipt
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,44,44,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius)",
              maxWidth: 480,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(44,44,44,0.3)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <strong style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>
                Receipt
              </strong>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ color: "var(--muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Receipt body */}
            <div style={{ padding: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--charcoal)" }}>
                  {STORE_INFO.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{STORE_INFO.tagline}</div>
              </div>

              <div style={{ ...rowStyle }}>
                <span style={{ color: "var(--muted)" }}>Order</span>
                <span style={{ fontWeight: 600 }}>#{order.id}</span>
              </div>
              <div style={{ ...rowStyle }}>
                <span style={{ color: "var(--muted)" }}>Date</span>
                <span>{dateStr}</span>
              </div>
              <div style={{ ...rowStyle }}>
                <span style={{ color: "var(--muted)" }}>Customer</span>
                <span style={{ textAlign: "right" }}>{order.name}</span>
              </div>
              <div style={{ ...rowStyle }}>
                <span style={{ color: "var(--muted)" }}>Address</span>
                <span style={{ textAlign: "right" }}>{order.address}, {order.city}</span>
              </div>
              <div style={{ ...rowStyle }}>
                <span style={{ color: "var(--muted)" }}>Payment</span>
                <span style={{ textAlign: "right" }}>
                  {paymentMethodLabel(order.payMethod)} · {order.paymentStatusLabel}
                </span>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />

              {order.items.map((item, i) => (
                <div key={i} style={{ ...rowStyle }}>
                  <span>
                    {item.name} <span style={{ color: "var(--muted)" }}>× {item.qty}</span>
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid var(--border)", margin: "16px 0" }} />

              <div style={{ ...rowStyle, fontSize: 16, fontWeight: 700 }}>
                <span>Grand Total</span>
                <span style={{ color: "var(--gold-dark)" }}>{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Download button */}
            <div style={{ padding: "0 24px 24px" }}>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="btn btn--dark"
                style={{ width: "100%", justifyContent: "center", gap: 8 }}
              >
                <Download size={16} />
                {downloading ? "Preparing…" : "Download Receipt (PDF)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
