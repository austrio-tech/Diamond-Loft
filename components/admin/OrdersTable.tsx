"use client";

import { useRouter } from "next/navigation";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import styles from "./OrdersTable.module.css";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid: { bg: "#fdf0f0", color: "#c0392b" },
  paid: { bg: "#e9f7ef", color: "#1a7a40" },
  cod: { bg: "#fff8e7", color: "#856404" },
};

interface Props {
  orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function handleConfirmPayment(orderId: number) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "paid" }),
    });
    router.refresh();
  }

  if (orders.length === 0) {
    return <p style={{ color: "var(--muted)", padding: "24px 0" }}>No orders found.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>City</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Pay Status</th>
            <th>Receipt</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
            const psColors = PAYMENT_STATUS_COLORS[order.paymentStatus];
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.city}</td>
                <td>{totalQty}</td>
                <td>{formatPrice(order.total)}</td>
                <td>{paymentMethodLabel(order.payMethod)}</td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        background: psColors.bg,
                        color: psColors.color,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.paymentStatus === "unpaid"
                        ? "Unpaid"
                        : order.paymentStatus === "paid"
                        ? "Paid"
                        : "COD"}
                    </span>
                    {order.paymentStatus === "unpaid" && (
                      <button
                        className={styles.confirmBtn}
                        onClick={() => handleConfirmPayment(order.id)}
                      >
                        Confirm Payment
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  {order.receiptUrl?.startsWith("/uploads/receipts/") ? (
                    <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" title="View receipt">
                      <img
                        src={order.receiptUrl}
                        alt="Receipt"
                        style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", display: "block" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </a>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>—</span>
                  )}
                </td>
                <td>
                  <select
                    className={`${styles.statusSelect} ${styles[order.status as keyof typeof styles] ?? ""}`}
                    defaultValue={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
