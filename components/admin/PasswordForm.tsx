"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import PasswordInput from "./PasswordInput";

const inputCls =
  "w-full bg-page border border-line rounded px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:border-gold focus:outline-none transition-colors";

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
    <div className="bg-surface border border-line rounded-card shadow-card p-6">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <p className="bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm px-3 py-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm px-3 py-2 rounded">
            {success}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-[0.15em] text-muted" htmlFor="current">
            Current Password
          </label>
          <PasswordInput
            id="current"
            inputClassName={inputCls}
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-[0.15em] text-muted" htmlFor="new">
            New Password
          </label>
          <PasswordInput
            id="new"
            inputClassName={inputCls}
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
            required
          />
          <span className="text-xs text-muted mt-0.5">At least 8 characters.</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-[0.15em] text-muted" htmlFor="confirm">
            Confirm New Password
          </label>
          <PasswordInput
            id="confirm"
            inputClassName={inputCls}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-ink-deep text-gold text-sm font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity self-start"
          disabled={saving}
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
