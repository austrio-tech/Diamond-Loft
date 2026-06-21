"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import PasswordInput from "@/components/admin/PasswordInput";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Full navigation so the server admin layout re-runs with the new
      // session and renders the sidebar (a client router.push would keep the
      // already-mounted shell-less layout until a manual refresh).
      window.location.href = "/admin";
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-surface border border-line rounded-card shadow-card p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-gold-dark tracking-wide">
            Diamond Loft
          </h1>
          <p className="text-muted text-xs uppercase tracking-[0.2em] mt-1">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-page border border-line rounded px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:border-gold focus:outline-none transition-colors"
              placeholder="admin@diamondloft.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.15em] text-muted">
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              inputClassName="w-full bg-page border border-line rounded px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:border-gold focus:outline-none transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-deep text-gold font-serif tracking-widest text-sm py-3 rounded border border-gold/30 hover:border-gold transition-colors disabled:opacity-60 cursor-pointer mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
