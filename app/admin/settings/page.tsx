import { auth } from "@/lib/auth";
import PasswordForm from "@/components/admin/PasswordForm";
import styles from "../dashboard.module.css";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Account Settings</h1>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>
        Signed in as <strong>{session?.user?.email}</strong>. Change your admin
        password below. You&apos;ll be signed out after a successful change.
      </p>
      <PasswordForm />
    </div>
  );
}
