import { auth } from "@/lib/auth";
import PasswordForm from "@/components/admin/PasswordForm";
import styles from "./settings.module.css";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Account Settings</h1>
        <p className={styles.subtitle}>
          Signed in as <strong>{session?.user?.email}</strong>. Change your admin
          password below. You&apos;ll be signed out after a successful change.
        </p>
        <PasswordForm />
      </div>
    </div>
  );
}
