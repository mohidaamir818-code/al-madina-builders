"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

const field =
  "w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-primary";

export default function AdminProfilePage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d: { email?: string }) => setEmail(d.email || ""))
      .catch(() => setEmail(""));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { error?: string; message?: string; hash?: string };
      if (!res.ok) {
        setError(data.error || "Could not update password.");
        return;
      }
      setMessage(data.message || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-muted">Signed in as {email || "…"}</p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-md border border-line bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-ink">Change password</h2>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Current password</span>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">New password (min 8)</span>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={field}
            />
          </label>
          {error ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="rounded border border-[#CDE8D4] bg-[#EAF7EE] px-3 py-2 text-sm text-ink">{message}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center rounded bg-brand text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
