import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";
import OrderDetailControls from "@/components/admin/OrderDetailControls";
import ReceiptViewer from "@/components/admin/ReceiptViewer";

const PAYMENT_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  unpaid: "bg-red-500/15 text-red-700 dark:text-red-400",
  paid:   "bg-green-600/15 text-green-700 dark:text-green-500",
  cod:    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  cod: "COD",
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Order #${id}` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raw = await prisma.order.findUnique({ where: { id: Number(id) } });
  if (!raw) notFound();

  const order: Order = {
    ...raw,
    items: JSON.parse(raw.items as unknown as string) as OrderItem[],
    payMethod: raw.payMethod as PaymentMethod,
    paymentStatus: raw.paymentStatus as PaymentStatus,
    status: raw.status as OrderStatus,
    createdAt: raw.createdAt.toISOString(),
  };

  const placedDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
    dateStyle: "long",
  });

  return (
    <div className="bg-page min-h-screen p-8">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink mb-6 transition-colors">
        ← Back to Orders
      </Link>

      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Order #{order.id}</h1>
        <p className="text-muted text-sm mt-1">Placed {placedDate}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Items card */}
          <div className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-serif text-lg text-ink mb-4 pb-2 border-b border-line">Items</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs uppercase tracking-[0.2em] text-muted pb-2 border-b border-line font-normal">Item</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] text-muted pb-2 border-b border-line font-normal">Qty</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] text-muted pb-2 border-b border-line font-normal">Unit Price</th>
                  <th className="text-left text-xs uppercase tracking-[0.2em] text-muted pb-2 border-b border-line font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-line last:border-0">
                    <td className="py-2.5 text-ink">{item.name}</td>
                    <td className="py-2.5 text-ink">{item.qty}</td>
                    <td className="py-2.5 text-ink">{formatPrice(item.price)}</td>
                    <td className="py-2.5 text-ink">{formatPrice(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line">
                  <td colSpan={3} className="pt-3 font-semibold text-ink">Grand Total</td>
                  <td className="pt-3 font-semibold text-ink">{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer & Delivery card */}
          <div className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-serif text-lg text-ink mb-4 pb-2 border-b border-line">Customer &amp; Delivery</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-0.5">Name</p>
                <p className="text-sm text-ink">{order.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-0.5">Phone</p>
                <p className="text-sm text-ink">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-0.5">Address</p>
                <p className="text-sm text-ink">{order.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-0.5">City</p>
                <p className="text-sm text-ink">{order.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Payment card */}
          <div className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-serif text-lg text-ink mb-4 pb-2 border-b border-line">Payment</h2>
            <div className="flex items-center justify-between py-2 border-b border-line">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Method</span>
              <span className="text-sm text-ink">{paymentMethodLabel(order.payMethod)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-line">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${PAYMENT_STATUS_BADGE_CLASSES[order.paymentStatus]}`}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Receipt</span>
              <ReceiptViewer url={order.receiptUrl} size="w-16 h-16" />
            </div>
          </div>

          {/* Fulfilment card */}
          <div className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-serif text-lg text-ink mb-4 pb-2 border-b border-line">Fulfilment</h2>
            <OrderDetailControls
              orderId={order.id}
              status={order.status}
              paymentStatus={order.paymentStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
