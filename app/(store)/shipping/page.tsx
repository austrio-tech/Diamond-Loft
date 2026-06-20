import type { Metadata } from "next";
import InfoPage, { infoStyles as styles } from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Diamond Loft delivery areas, charges, and timeframes across Pakistan.",
};

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping & Delivery" subtitle="Fast, tracked delivery across Pakistan.">
      <p>
        We deliver nationwide across Pakistan through trusted courier partners. Every order is carefully
        packed and dispatched within 1–2 business days of confirmation.
      </p>

      <h2>Delivery Timeframes</h2>
      <table className={styles.table}>
        <thead>
          <tr><th>Region</th><th>Estimated Delivery</th></tr>
        </thead>
        <tbody>
          <tr><td>Lahore, Karachi, Islamabad</td><td>2–4 business days</td></tr>
          <tr><td>Other major cities</td><td>3–5 business days</td></tr>
          <tr><td>Remote areas</td><td>5–7 business days</td></tr>
        </tbody>
      </table>

      <h2>Shipping Charges</h2>
      <ul>
        <li><strong>Free shipping</strong> on all orders above PKR 3,000.</li>
        <li>A flat delivery charge applies to orders below PKR 3,000, shown at checkout.</li>
      </ul>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, we share the courier tracking number with you on WhatsApp so you can
        follow your parcel every step of the way.
      </p>
    </InfoPage>
  );
}
