import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import OrderReceipt from "@/components/store/OrderReceipt";
import type { OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

const STAGES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const STAGE_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Awaiting Payment",
  paid: "Payment Confirmed",
  cod: "Pay on Delivery",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await prisma.order.findUnique({ where: { token } });
  if (!order) return { title: "Order Not Found" };
  return { title: `Order #${order.id} — Diamond Loft` };
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const rawOrder = await prisma.order.findUnique({ where: { token } });
  if (!rawOrder) notFound();

  const order = {
    ...rawOrder,
    items: JSON.parse(rawOrder.items as unknown as string) as OrderItem[],
    payMethod: rawOrder.payMethod as PaymentMethod,
    paymentStatus: rawOrder.paymentStatus as PaymentStatus,
    status: rawOrder.status as OrderStatus,
    createdAt: rawOrder.createdAt.toISOString(),
  };

  const isCancelled = order.status === "cancelled";
  const currentStageIndex = isCancelled
    ? -1
    : STAGES.indexOf(order.status);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header banner */}
      <div style={{ background: isCancelled ? "#fdf0f0" : "linear-gradient(135deg, #1a3a2a 0%, #27ae60 100%)", padding: "48px 0 36px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          {isCancelled ? (
            <>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>❌</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px,4vw,40px)", fontWeight: 400, color: "#c0392b", marginBottom: "8px" }}>
                Order Cancelled
              </h1>
              <p style={{ color: "#c0392b", fontSize: "15px" }}>
                Order #{order.id} has been cancelled. Please contact us if you need assistance.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px,4vw,40px)", fontWeight: 400, color: "#fff", marginBottom: "8px" }}>
                Thank you! Your order is confirmed.
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px" }}>
                Order #{order.id} — placed on {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}>
          {/* Left: tracker + details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Status tracker */}
            {!isCancelled && (
              <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "28px 32px", boxShadow: "var(--shadow)" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, color: "var(--charcoal)", marginBottom: "28px" }}>
                  Fulfilment Status
                </h2>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0", position: "relative" }}>
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        {/* Connector line */}
                        {idx < STAGES.length - 1 && (
                          <div style={{
                            position: "absolute",
                            top: "19px",
                            left: "50%",
                            width: "100%",
                            height: "2px",
                            background: idx < currentStageIndex ? "var(--gold)" : "var(--border)",
                            zIndex: 0,
                          }} />
                        )}
                        {/* Circle */}
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: `2px solid ${isCompleted ? "var(--gold)" : "var(--border)"}`,
                          background: isCompleted ? "var(--gold)" : "var(--white)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          zIndex: 1,
                          flexShrink: 0,
                          boxShadow: isCurrent ? "0 0 0 4px rgba(201,169,110,0.2)" : "none",
                          transition: "all 0.3s",
                        }}>
                          {isCompleted ? (
                            <span style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>✓</span>
                          ) : (
                            <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: "13px" }}>{idx + 1}</span>
                          )}
                        </div>
                        <p style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCompleted ? "var(--gold-dark)" : "var(--muted)",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}>
                          {STAGE_LABELS[stage]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order items */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "28px 32px", boxShadow: "var(--shadow)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 400, color: "var(--charcoal)", marginBottom: "20px" }}>
                Items Ordered
              </h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px dashed var(--border)", fontSize: "14px" }}>
                    <span style={{ color: "var(--charcoal)" }}>
                      {item.name} <span style={{ color: "var(--muted)" }}>× {item.qty}</span>
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--charcoal)" }}>
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", fontSize: "16px", fontWeight: 700, color: "var(--charcoal)" }}>
                  <span>Grand Total</span>
                  <span style={{ color: "var(--gold-dark)" }}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Save page note */}
            <div style={{ background: "var(--soft)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🔖</span>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--charcoal)" }}>Save this page</strong> to track your order status. This is your unique order tracking link.
              </p>
            </div>
          </div>

          {/* Right: delivery & payment details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Delivery details */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "24px", boxShadow: "var(--shadow)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 400, color: "var(--charcoal)", marginBottom: "16px" }}>
                Delivery Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Name", value: order.name },
                  { label: "Phone", value: order.phone },
                  { label: "Address", value: order.address },
                  { label: "City", value: order.city },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
                    <span style={{ color: "var(--muted)", flexShrink: 0 }}>{label}</span>
                    <span style={{ color: "var(--charcoal)", fontWeight: 500, textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment details */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "24px", boxShadow: "var(--shadow)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 400, color: "var(--charcoal)", marginBottom: "16px" }}>
                Payment
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Method</span>
                  <span style={{ color: "var(--charcoal)", fontWeight: 500 }}>{paymentMethodLabel(order.payMethod)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
                  <span style={{ color: "var(--muted)" }}>Status</span>
                  <span style={{
                    fontWeight: 600,
                    color: order.paymentStatus === "paid" ? "#27ae60" : order.paymentStatus === "cod" ? "var(--gold-dark)" : "#c0392b",
                  }}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt */}
            <OrderReceipt
              order={{
                id: order.id,
                createdAt: order.createdAt,
                name: order.name,
                phone: order.phone,
                address: order.address,
                city: order.city,
                items: order.items,
                total: order.total,
                payMethod: order.payMethod,
                paymentStatusLabel:
                  PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus,
              }}
            />

            {/* Back to shop */}
            <Link href="/shop" className="btn btn--dark" style={{ textAlign: "center", justifyContent: "center" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
