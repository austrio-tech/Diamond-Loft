import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrdersTable from "@/components/admin/OrdersTable";
import type { Order, OrderStatus, OrderItem, PaymentMethod, PaymentStatus } from "@/types";

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

  const [rawOrders, statusGroups] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  // Build counts map
  const countMap: Record<string, number> = {};
  let totalCount = 0;
  for (const g of statusGroups) {
    countMap[g.status] = g._count.id;
    totalCount += g._count.id;
  }

  const orders: Order[] = rawOrders.map((o) => ({
    ...o,
    items: JSON.parse(o.items as unknown as string) as OrderItem[],
    payMethod: o.payMethod as PaymentMethod,
    paymentStatus: o.paymentStatus as PaymentStatus,
    status: o.status as OrderStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div className="bg-page min-h-screen p-8">
      <h1 className="font-serif text-3xl text-ink mb-6">Orders</h1>

      <nav className="flex flex-wrap gap-1 mb-6 border-b border-line pb-1">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 text-sm transition-colors ${
            !status
              ? "text-gold-dark border-b-2 border-gold font-medium"
              : "text-muted hover:text-ink"
          }`}
        >
          All ({totalCount})
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 text-sm transition-colors ${
              status === s
                ? "text-gold-dark border-b-2 border-gold font-medium"
                : "text-muted hover:text-ink"
            }`}
          >
            {STATUS_LABELS[s]} ({countMap[s] ?? 0})
          </Link>
        ))}
      </nav>

      <OrdersTable orders={orders} />
    </div>
  );
}
