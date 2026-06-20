"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, PaymentStatus } from "@/types";
import StatusDropdown from "./StatusDropdown";
import styles from "./OrderDetailControls.module.css";

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
    <div className={styles.controls}>
      <div className={styles.statusSection}>
        <span className={styles.fieldLabel}>Order Status</span>
        <StatusDropdown value={status} onChange={handleStatusChange} busy={busy} />
      </div>

      {paymentStatus === "unpaid" && (
        <button
          type="button"
          className={styles.confirmBtn}
          onClick={handleConfirmPayment}
          disabled={busy}
        >
          Confirm Payment
        </button>
      )}
    </div>
  );
}
