import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";
import OrderDetailControls from "@/components/admin/OrderDetailControls";
import dashStyles from "@/app/admin/dashboard.module.css";
import styles from "./order-detail.module.css";

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid: { bg: "#fdf0f0", color: "#c0392b" },
  paid: { bg: "#e9f7ef", color: "#1a7a40" },
  cod: { bg: "#fff8e7", color: "#856404" },
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

  const psColors = PAYMENT_STATUS_COLORS[order.paymentStatus];
  const placedDate = new Date(order.createdAt).toLocaleDateString("en-PK", {
    dateStyle: "long",
  });

  return (
    <div className={dashStyles.page}>
      <Link href="/admin/orders" className={styles.backLink}>
        ← Back to Orders
      </Link>

      <div className={styles.header}>
        <h1 className={styles.heading}>Order #{order.id}</h1>
        <p className={styles.subtext}>Placed {placedDate}</p>
      </div>

      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.column}>
          {/* Items card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Items</h2>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.totalRow}>
                  <td colSpan={3}>Grand Total</td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer & Delivery card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Customer &amp; Delivery</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <label>Name</label>
                <p>{order.name}</p>
              </div>
              <div className={styles.infoField}>
                <label>Phone</label>
                <p>{order.phone}</p>
              </div>
              <div className={styles.infoField}>
                <label>Address</label>
                <p>{order.address}</p>
              </div>
              <div className={styles.infoField}>
                <label>City</label>
                <p>{order.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.column}>
          {/* Payment card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Payment</h2>
            <div className={styles.payRow}>
              <span className={styles.payLabel}>Method</span>
              <span className={styles.payValue}>{paymentMethodLabel(order.payMethod)}</span>
            </div>
            <div className={styles.payRow}>
              <span className={styles.payLabel}>Status</span>
              <span
                className={styles.badge}
                style={{ background: psColors.bg, color: psColors.color }}
              >
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </span>
            </div>
            <div className={styles.payRow}>
              <span className={styles.payLabel}>Receipt</span>
              {order.receiptUrl?.startsWith("/uploads/receipts/") ? (
                <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" title="View receipt">
                  <img
                    src={order.receiptUrl}
                    alt="Receipt"
                    className={styles.receiptImg}
                  />
                </a>
              ) : (
                <span className={styles.payValue}>—</span>
              )}
            </div>
          </div>

          {/* Fulfilment card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Fulfilment</h2>
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
