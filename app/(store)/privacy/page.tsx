import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";
import { STORE_INFO } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Diamond Loft collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" subtitle="Your data, handled with care.">
      <p>
        Diamond Loft respects your privacy. This policy explains what information we collect and how we
        use it when you shop with us.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact and delivery details you provide at checkout: name, phone number, and address.</li>
        <li>Order details: the items you purchase and your chosen payment method.</li>
        <li>Messages you send us via WhatsApp or email.</li>
      </ul>

      <h2>How We Use It</h2>
      <ul>
        <li>To process, confirm, and deliver your orders.</li>
        <li>To contact you about your order and provide customer support.</li>
        <li>To improve our products and service.</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>
        We share your delivery details only with our courier partners to fulfil your order. We never
        sell your personal information to third parties.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time. Contact
        us at <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a> and we&apos;ll assist you.
      </p>
    </InfoPage>
  );
}
