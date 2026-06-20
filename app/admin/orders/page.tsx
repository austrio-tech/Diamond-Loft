import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrdersTable from "@/components/admin/OrdersTable";
import type { Order, OrderStatus, OrderItem, PaymentMethod } from "@/types";
import styles from "./orders.module.css";

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where =
    status && STATUSES.includes(status as OrderStatus)
      ? { status: status as OrderStatus }
      : {};

  const rawOrders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const orders: Order[] = rawOrders.map((o) => ({
    ...o,
    items: JSON.parse(o.items as unknown as string) as OrderItem[],
    payMethod: o.payMethod as PaymentMethod,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Orders</h1>

      <nav className={styles.tabs}>
        <Link
          href="/admin/orders"
          className={`${styles.tab} ${!status ? styles.tabActive : ""}`}
        >
          All ({rawOrders.length})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`${styles.tab} ${status === s ? styles.tabActive : ""}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </nav>

      <OrdersTable orders={orders} />
    </div>
  );
}
