import { getSections } from "@/lib/data";
import SectionsManager from "@/components/admin/SectionsManager";

export default async function SectionsPage() {
  const sections = await getSections();
  return (
    <div className="bg-page min-h-screen p-8">
      <SectionsManager sections={sections} />
    </div>
  );
}
