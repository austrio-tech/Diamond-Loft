import { getCategories } from "@/lib/data";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryTable from "@/components/admin/CategoryTable";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-page min-h-screen p-8">
      <h1 className="font-serif text-3xl text-ink mb-6">
        Categories{" "}
        <span className="font-body text-base font-normal text-muted ml-2">
          ({categories.length} total)
        </span>
      </h1>

      <CategoryTable categories={categories} />

      <div className="mt-8 bg-surface border border-line rounded-card shadow-card p-6">
        <p className="font-serif text-lg text-ink mb-4">+ Add Category</p>
        <CategoryForm />
      </div>
    </div>
  );
}
