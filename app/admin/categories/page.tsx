import { getCategories } from "@/lib/data";
import CategoryForm from "@/components/admin/CategoryForm";
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

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Accent</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat._count?.products ?? 0}</td>
                <td>
                  <span
                    className={styles.colorSwatch}
                    style={{ backgroundColor: cat.accent }}
                    title={cat.accent}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.addSection}>
        <p className={styles.addTitle}>+ Add Category</p>
        <CategoryForm />
      </div>
    </div>
  );
}
