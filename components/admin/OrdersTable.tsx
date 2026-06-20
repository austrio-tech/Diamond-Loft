"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
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
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.city}</td>
                <td>{totalQty}</td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  {order.payMethod === "bank"
                    ? "Bank Transfer"
                    : "JazzCash/EasyPaisa"}
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
