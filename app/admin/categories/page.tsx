import { getCategories } from "@/lib/data";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryTable from "@/components/admin/CategoryTable";
import styles from "./categories.module.css";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        Categories{" "}
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", fontWeight: 400, color: "var(--muted)" }}>
          ({categories.length} total)
        </span>
      </h1>

      <CategoryTable categories={categories} />

      <div className={styles.addSection}>
        <p className={styles.addTitle}>+ Add Category</p>
        <CategoryForm />
      </div>
    </div>
  );
}
