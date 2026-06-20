import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className={styles.wrapper}>
      <AdminSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
