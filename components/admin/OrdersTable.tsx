"use client";

import { useRouter } from "next/navigation";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending:   "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  shipped:   "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  delivered: "bg-green-600/15 text-green-700 dark:text-green-500",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

const PAY_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  unpaid: "bg-red-500/15 text-red-700 dark:text-red-400",
  paid:   "bg-green-600/15 text-green-700 dark:text-green-500",
  cod:    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const STATUS_DOT_CLASS: Record<OrderStatus, string> = {
  pending:   "bg-amber-500",
  confirmed: "bg-blue-500",
  shipped:   "bg-violet-500",
  delivered: "bg-green-600",
  cancelled: "bg-red-500",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled",
};

const PAY_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  cod: "COD",
};

interface Props {
  orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">#</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Customer</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Phone</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">City</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Items</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Total</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Payment</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Pay Status</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Receipt</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Status</th>
            <th className="text-left text-xs uppercase tracking-[0.2em] text-muted border-b border-line py-2 px-3 font-normal whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={11} className="text-center text-muted py-8 px-3">
                No orders found.
              </td>
            </tr>
          )}
          {orders.map((order) => {
            const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
            return (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-soft border-b border-line transition-colors"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <td className="py-3 px-3 text-ink whitespace-nowrap">{order.id}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{order.name}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{order.phone}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{order.city}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{totalQty}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{formatPrice(order.total)}</td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{paymentMethodLabel(order.payMethod)}</td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${PAY_STATUS_BADGE_CLASSES[order.paymentStatus]}`}>
                    {PAY_STATUS_LABELS[order.paymentStatus]}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
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
                        className="w-12 h-12 object-cover rounded border border-line block"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </a>
                  ) : (
                    <span className="text-muted text-sm">—</span>
                  )}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${STATUS_BADGE_CLASSES[order.status]}`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${STATUS_DOT_CLASS[order.status]}`} />
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="py-3 px-3 text-ink whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
