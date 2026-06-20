import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "Jewellery Care Guide",
  description: "How to keep your Diamond Loft jewellery looking beautiful for years.",
};

export default function CareGuidePage() {
  return (
    <InfoPage title="Jewellery Care Guide" subtitle="Keep your pieces radiant for years to come.">
      <h2>Everyday Care</h2>
      <ul>
        <li>Put your jewellery on last — after applying perfume, lotion, and hairspray.</li>
        <li>Remove pieces before showering, swimming, exercising, or sleeping.</li>
        <li>Avoid contact with water, harsh chemicals, and household cleaners.</li>
      </ul>

      <h2>Cleaning</h2>
      <ul>
        <li>Gently wipe with a soft, dry cloth after each wear to remove oils.</li>
        <li>For a deeper clean, use a mild soap with lukewarm water and pat dry immediately.</li>
        <li>Do not use abrasive cloths or ultrasonic cleaners on plated or pearl pieces.</li>
      </ul>

      <h2>Storage</h2>
      <ul>
        <li>Store each piece separately in a pouch or lined box to prevent scratches and tangling.</li>
        <li>Keep jewellery in a cool, dry place away from direct sunlight.</li>
        <li>For gold-plated items, limit air exposure to slow natural tarnishing.</li>
      </ul>

      <h2>Material Notes</h2>
      <p>
        <strong>Gold-plated brass &amp; silver:</strong> plating is a surface layer — gentle handling
        preserves its shine. <strong>Pearls &amp; natural stones:</strong> porous and delicate; keep
        away from moisture and chemicals.
      </p>
    </InfoPage>
  );
}
