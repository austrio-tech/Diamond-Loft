import type { Metadata } from "next";
import InfoPage from "@/components/store/InfoPage";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "How to measure for rings, bracelets, and necklace lengths at Diamond Loft.",
};

export default function SizeGuidePage() {
  return (
    <InfoPage title="Size Guide" subtitle="Find your perfect fit.">
      <h2>Bracelets</h2>
      <p>Measure your wrist snugly with a tape, then add 1.5–2 cm for a comfortable fit.</p>
      <table>
        <thead>
          <tr><th>Wrist Size</th><th>Recommended Bracelet</th></tr>
        </thead>
        <tbody>
          <tr><td>14–15 cm</td><td>Small (16–17 cm)</td></tr>
          <tr><td>15–16 cm</td><td>Medium (17–18 cm)</td></tr>
          <tr><td>16–17 cm</td><td>Large (18–20 cm)</td></tr>
        </tbody>
      </table>

      <h2>Necklace & Pendant Lengths</h2>
      <table>
        <thead>
          <tr><th>Length</th><th>Sits At</th></tr>
        </thead>
        <tbody>
          <tr><td>40 cm (16&quot;)</td><td>Base of the neck (choker style)</td></tr>
          <tr><td>45 cm (18&quot;)</td><td>On the collarbone — most popular</td></tr>
          <tr><td>50 cm (20&quot;)</td><td>Just below the collarbone</td></tr>
        </tbody>
      </table>

      <h2>Earrings & Ear Tops</h2>
      <p>
        Each product page lists exact dimensions (drop length and diameter) so you know precisely how a
        piece will sit. Studs and ear tops are one-size and suit all.
      </p>
      <p>Still unsure? Message us on WhatsApp and we&apos;ll help you choose.</p>
    </InfoPage>
  );
}
