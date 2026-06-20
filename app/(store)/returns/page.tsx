import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Diamond Loft 30-day return and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & Exchanges" subtitle="Shop with confidence — 30-day easy returns.">
      <p>
        We want you to love your jewellery. If something isn&apos;t right, you may return or exchange
        eligible items within <strong>30 days</strong> of delivery.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>Items must be unworn and in their original condition and packaging.</li>
        <li>Proof of purchase (your order confirmation) is required.</li>
        <li>For hygiene reasons, earrings and ear tops can only be returned if the seal is unbroken.</li>
        <li>Customised or personalised pieces are non-returnable unless faulty.</li>
      </ul>

      <h2>How to Start a Return</h2>
      <ul>
        <li>Message us on WhatsApp with your order number and reason for return.</li>
        <li>We&apos;ll confirm eligibility and share the return address.</li>
        <li>Once we receive and inspect the item, we process your refund or exchange.</li>
      </ul>

      <h2>Refunds</h2>
      <p>
        Approved refunds are issued to your original payment method (Bank Transfer / JazzCash / EasyPaisa)
        within 5–7 business days of inspection. Return shipping costs are the customer&apos;s
        responsibility unless the item was faulty or incorrect.
      </p>
    </InfoPage>
  );
}
