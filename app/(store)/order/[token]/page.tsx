import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, paymentMethodLabel } from "@/lib/utils";
import OrderReceipt from "@/components/store/OrderReceipt";
import Reveal from "@/components/motion/Reveal";
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
  const currentStageIndex = isCancelled ? -1 : STAGES.indexOf(order.status);

  return (
    <div className="bg-page min-h-screen pb-20">
      {/* Header banner */}
      {isCancelled ? (
        <div className="bg-red-50 border-b border-red-200 py-12 md:pt-14 md:pb-10">
          <div className="mx-auto max-w-[1380px] px-6 text-center">
            <div className="text-5xl mb-3">❌</div>
            <h1 className="font-serif text-[clamp(24px,4vw,40px)] font-normal text-red-700 mb-2">
              Order Cancelled
            </h1>
            <p className="text-red-600 text-sm">
              Order #{order.id} has been cancelled. Please contact us if you need assistance.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-800 py-12 md:pt-14 md:pb-10">
          <div className="mx-auto max-w-[1380px] px-6 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h1 className="font-serif text-[clamp(24px,4vw,40px)] font-normal text-white mb-2">
              Thank you! Your order is confirmed.
            </h1>
            <p className="text-white/85 text-sm">
              Order #{order.id} — placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1380px] px-6 pt-10">
        <div className="grid gap-8 items-start lg:grid-cols-[1fr_360px]">
          {/* Left: tracker + details */}
          <div className="flex flex-col gap-6">

            {/* Status tracker */}
            {!isCancelled && (
              <Reveal>
                <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                  <h2 className="font-serif text-xl font-normal text-ink mb-7">
                    Fulfilment Status
                  </h2>
                  <div className="flex items-start relative">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div
                          key={stage}
                          className="flex-1 flex flex-col items-center relative"
                        >
                          {/* Connector line */}
                          {idx < STAGES.length - 1 && (
                            <div
                              className={`absolute top-[19px] left-1/2 w-full h-0.5 z-0 transition-all duration-500 ${
                                idx < currentStageIndex ? "bg-gold" : "bg-line"
                              }`}
                            />
                          )}
                          {/* Circle */}
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 flex-shrink-0 transition-all duration-500 ${
                              isCompleted
                                ? "bg-gold border-gold text-white"
                                : "bg-surface border-line text-muted"
                            } ${isCurrent ? "ring-4 ring-gold/20" : ""}`}
                          >
                            {isCompleted ? (
                              <span className="text-white font-bold text-base">✓</span>
                            ) : (
                              <span className="font-semibold text-xs">{idx + 1}</span>
                            )}
                          </div>
                          <p
                            className={`mt-2 text-[11px] text-center leading-tight transition-all duration-500 ${
                              isCompleted
                                ? "text-gold-dark font-bold"
                                : "text-muted font-medium"
                            }`}
                          >
                            {STAGE_LABELS[stage]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Order items */}
            <Reveal delay={0.1}>
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                <h2 className="font-serif text-xl font-normal text-ink mb-5">
                  Items Ordered
                </h2>
                <div className="flex flex-col">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2.5 border-b border-dashed border-line text-sm"
                    >
                      <span className="text-ink">
                        {item.name}{" "}
                        <span className="text-muted">× {item.qty}</span>
                      </span>
                      <span className="font-semibold text-ink">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3.5 text-base font-bold text-ink">
                    <span>Grand Total</span>
                    <span className="text-gold-dark">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Save page note */}
            <Reveal delay={0.15}>
              <div className="bg-soft border border-line rounded-card p-4 md:p-5 flex items-center gap-2.5">
                <span className="text-xl flex-shrink-0">🔖</span>
                <p className="text-sm text-muted leading-relaxed">
                  <strong className="text-ink">Save this page</strong> to track your order status. This is your unique order tracking link.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: delivery & payment details */}
          <div className="flex flex-col gap-5">
            {/* Delivery details */}
            <Reveal delay={0.05}>
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                <h2 className="font-serif text-lg font-normal text-ink mb-4">
                  Delivery Details
                </h2>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Name", value: order.name },
                    { label: "Phone", value: order.phone },
                    { label: "Address", value: order.address },
                    { label: "City", value: order.city },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span className="text-muted flex-shrink-0">{label}</span>
                      <span className="text-ink font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Payment details */}
            <Reveal delay={0.1}>
              <div className="bg-surface rounded-card shadow-card p-6 md:p-8">
                <h2 className="font-serif text-lg font-normal text-ink mb-4">
                  Payment
                </h2>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted">Method</span>
                    <span className="text-ink font-medium">{paymentMethodLabel(order.payMethod)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted">Status</span>
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "paid"
                          ? "text-green-600 dark:text-green-400"
                          : order.paymentStatus === "cod"
                          ? "text-gold-dark"
                          : "text-red-500"
                      }`}
                    >
                      {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

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
            <Link
              href="/shop"
              className="btn btn--dark text-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
