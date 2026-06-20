import { getSections } from "@/lib/data";
import SectionsManager from "@/components/admin/SectionsManager";

export default async function SectionsPage() {
  const sections = await getSections();
  return (
    <div style={{ padding: "32px" }}>
      <SectionsManager sections={sections} />
    </div>
  );
}
