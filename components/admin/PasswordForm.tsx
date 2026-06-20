"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./PasswordForm.module.css";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update password");
        return;
      }
      setSuccess("Password updated. Signing you out…");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Force re-login with the new password for safety.
      setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="current">
            Current Password
          </label>
          <input
            id="current"
            type="password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="new">
            New Password
          </label>
          <input
            id="new"
            type="password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <span className={styles.hint}>At least 8 characters.</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirm">
            Confirm New Password
          </label>
          <input
            id="confirm"
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" className={styles.btn} disabled={saving}>
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
