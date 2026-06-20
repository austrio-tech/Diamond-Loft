import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";
import { STORE_INFO } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing purchases from Diamond Loft.",
};

export default function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions" subtitle="The terms governing your purchase.">
      <p>
        By placing an order with Diamond Loft, you agree to the following terms. Please read them
        carefully.
      </p>

      <h2>Orders</h2>
      <ul>
        <li>All orders are subject to confirmation of availability and payment.</li>
        <li>Prices are listed in Pakistani Rupees (PKR) and are inclusive of applicable taxes.</li>
        <li>We reserve the right to refuse or cancel any order at our discretion.</li>
      </ul>

      <h2>Pricing & Payment</h2>
      <p>
        Order totals are calculated on our servers from current product prices at the time of purchase.
        Payment must be completed via the agreed method before dispatch.
      </p>

      <h2>Product Representation</h2>
      <p>
        We make every effort to display our products accurately. Slight variations in colour may occur
        due to photography and screen settings. Natural stones and pearls are unique, so each piece may
        differ subtly from the images shown.
      </p>

      <h2>Liability</h2>
      <p>
        Our liability is limited to the value of the products purchased. We are not responsible for
        delays caused by courier partners or events beyond our control.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of the Islamic Republic of Pakistan. Questions? Contact us
        at <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>.
      </p>
    </InfoPage>
  );
}
