import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Diamond Loft jewellery, orders, shipping, and returns.",
};

export default function FaqPage() {
  return (
    <InfoPage title="Frequently Asked Questions" subtitle="Everything you need to know before you order.">
      <h2>Orders & Payment</h2>
      <h3>How do I place an order?</h3>
      <p>
        Add the pieces you love to your cart and proceed to checkout. Fill in your delivery details,
        choose a payment method, and confirm. Your order summary is sent directly to our team on
        WhatsApp, where we confirm availability and arrange payment.
      </p>
      <h3>What payment methods do you accept?</h3>
      <p>
        We accept <strong>Bank Transfer</strong> and <strong>JazzCash / EasyPaisa</strong>. Payment
        details are shared at checkout and on WhatsApp once your order is confirmed.
      </p>

      <h2>Shipping</h2>
      <h3>How long does delivery take?</h3>
      <p>
        Orders are dispatched within 1–2 business days. Delivery typically takes 3–5 business days
        depending on your city. See our <a href="/shipping">Shipping page</a> for details.
      </p>
      <h3>Is shipping free?</h3>
      <p>Shipping is free on all orders above PKR 3,000. A flat delivery charge applies below that.</p>

      <h2>Returns & Care</h2>
      <h3>Can I return an item?</h3>
      <p>
        Yes — we offer a 30-day return window on unworn items in original condition. Read the full
        policy on our <a href="/returns">Returns page</a>.
      </p>
      <h3>How do I care for my jewellery?</h3>
      <p>
        Each piece comes with care guidance. For tips on keeping your jewellery looking its best, visit
        our <a href="/care-guide">Care Guide</a>.
      </p>
    </InfoPage>
  );
}
