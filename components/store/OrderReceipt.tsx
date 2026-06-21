"use client";

import { useState, useEffect } from "react";
import { Printer, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, paymentMethodLabel, STORE_INFO } from "@/lib/utils";
import { overlay, modalPop } from "@/lib/motion";
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

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-5 border border-gold text-gold-dark text-[13px] [font-variant:small-caps] tracking-[0.15em] rounded-card hover:bg-gold hover:text-[#f7efe0] transition-colors"
      >
        <Printer size={15} /> Print Receipt
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              key="receipt-overlay"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-5"
              onClick={() => setOpen(false)}
            >
              {/* Modal panel */}
              <motion.div
                key="receipt-modal"
                variants={modalPop}
                initial="hidden"
                animate="show"
                exit="exit"
                className="bg-surface border border-line rounded-card w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-card-hover"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                  <span className="font-serif text-xl text-ink">Receipt</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="text-muted hover:text-gold transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Receipt body */}
                <div className="px-6 py-6">
                  {/* Brand */}
                  <div className="text-center mb-6">
                    <div className="font-serif text-2xl text-ink tracking-wide">
                      {STORE_INFO.name}
                    </div>
                    <div className="text-muted text-[12px] [font-variant:small-caps] tracking-wide mt-1">
                      {STORE_INFO.tagline}
                    </div>
                    <div className="w-10 h-px bg-gold mx-auto mt-3" />
                  </div>

                  {/* Meta rows */}
                  {[
                    { label: "Order", value: `#${order.id}` },
                    { label: "Date", value: dateStr },
                    { label: "Customer", value: order.name },
                    { label: "Address", value: `${order.address}, ${order.city}` },
                    {
                      label: "Payment",
                      value: `${paymentMethodLabel(order.payMethod)} · ${order.paymentStatusLabel}`,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between gap-3 text-[13px] py-1.5"
                    >
                      <span className="text-muted [font-variant:small-caps] tracking-wide">
                        {label}
                      </span>
                      <span className="text-ink text-right">{value}</span>
                    </div>
                  ))}

                  <div className="h-px bg-line my-4" />

                  {/* Items */}
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between gap-3 text-[13px] py-1.5"
                    >
                      <span className="text-ink">
                        {item.name}{" "}
                        <span className="text-muted">× {item.qty}</span>
                      </span>
                      <span className="text-ink font-medium">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}

                  <div className="h-px bg-line my-4" />

                  {/* Total */}
                  <div className="flex justify-between items-baseline text-base">
                    <span className="font-serif text-ink">Grand Total</span>
                    <span className="font-serif text-xl text-gold">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Download button */}
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-ink-deep text-[#f1e6cf] text-[13px] [font-variant:small-caps] tracking-[0.15em] hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Download size={15} />
                    {downloading ? "Preparing…" : "Download Receipt (PDF)"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
