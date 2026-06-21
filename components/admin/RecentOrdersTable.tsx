"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export interface RecentOrderRow {
  id: number;
  name: string;
  city: string;
  itemCount: number;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  shipped: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  delivered: "bg-green-600/15 text-green-700 dark:text-green-500",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function RecentOrdersTable({
  orders,
}: {
  orders: RecentOrderRow[];
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Order #", "Customer", "City", "Items", "Total", "Status", "Date"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-line hover:bg-soft transition-colors cursor-pointer"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <td className="py-3 px-3 text-sm text-ink">#{order.id}</td>
              <td className="py-3 px-3 text-sm text-ink">{order.name}</td>
              <td className="py-3 px-3 text-sm text-muted">{order.city}</td>
              <td className="py-3 px-3 text-sm text-muted">{order.itemCount}</td>
              <td className="py-3 px-3 text-sm text-ink">
                {formatPrice(order.total)}
              </td>
              <td className="py-3 px-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    STATUS_CLASSES[order.status] ?? "bg-soft text-muted"
                  }`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
              <td className="py-3 px-3 text-sm text-muted">
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-muted text-sm">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
