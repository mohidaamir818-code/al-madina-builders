"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { ADMIN_BASE } from "@/lib/admin/constants";

export function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }
      router.push(`${ADMIN_BASE}/otp`);
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F4] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Admin Access</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Al Madina Builders — product management</p>

        <label className="mt-6 block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink">
            <Mail className="h-3.5 w-3.5 text-primary" /> Email address
          </span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="admin@example.com"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink">
            <Lock className="h-3.5 w-3.5 text-primary" /> Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-line px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="••••••••"
          />
        </label>

        {error ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded bg-brand text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
