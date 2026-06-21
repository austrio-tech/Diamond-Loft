"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, PaymentStatus } from "@/types";
import StatusDropdown from "./StatusDropdown";

interface Props {
  orderId: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export default function OrderDetailControls({ orderId, status, paymentStatus }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleStatusChange(newStatus: OrderStatus) {
    setBusy(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirmPayment() {
    setBusy(true);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-muted block mb-1">Order Status</span>
        <StatusDropdown value={status} onChange={handleStatusChange} busy={busy} />
      </div>

      {paymentStatus === "unpaid" && (
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-gold text-white text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          onClick={handleConfirmPayment}
          disabled={busy}
        >
          Confirm Payment
        </button>
      )}
    </div>
  );
}
