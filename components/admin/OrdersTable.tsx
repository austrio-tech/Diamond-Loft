"use client";

import { useRouter } from "next/navigation";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import styles from "./OrdersTable.module.css";

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid: { bg: "#fdf0f0", color: "#c0392b" },
  paid: { bg: "#e9f7ef", color: "#1a7a40" },
  cod: { bg: "#fff8e7", color: "#856404" },
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pending:   { bg: "#fff3e0", color: "#c9a96e" },
  confirmed: { bg: "#e3f0ff", color: "#2f80ed" },
  shipped:   { bg: "#f0ebff", color: "#8e6fd6" },
  delivered: { bg: "#e4f9ec", color: "#1a7a40" },
  cancelled: { bg: "#fdecea", color: "#c0392b" },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};

interface Props {
  orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();

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
            const scColors = STATUS_COLORS[order.status];
            return (
              <tr
                key={order.id}
                className={styles.clickableRow}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.city}</td>
                <td>{totalQty}</td>
                <td>{formatPrice(order.total)}</td>
                <td>{paymentMethodLabel(order.payMethod)}</td>
                <td>
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
                </td>
                <td>
                  {order.receiptUrl?.startsWith("/uploads/receipts/") ? (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View receipt"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: scColors.bg, color: scColors.color,
                    borderRadius: "20px", padding: "3px 10px",
                    fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap"
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: scColors.color, flexShrink: 0 }} />
                    {STATUS_LABELS[order.status]}
                  </span>
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
