"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import type { DealSubscriber } from "@/lib/dealAlertStore";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { AdminShell } from "@/components/admin/AdminShell";

export function AdminDealAlertsPage({ initialSubscribers }: { initialSubscribers: DealSubscriber[] }) {
  const [items, setItems] = useState(initialSubscribers);
  const [loadingId, setLoadingId] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/deal-alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        showToast("Delete failed");
        return;
      }
      setItems((prev) => prev.filter((s) => s.id !== id));
      showToast("Subscriber removed");
    } catch {
      showToast("Network error");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <AdminShell>
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href={`${ADMIN_BASE}/dashboard`}
            className="flex h-9 w-9 items-center justify-center rounded border border-line bg-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-ink">Deal Alert Subscribers</h1>
            <p className="text-xs text-muted">{items.length} registered</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-line bg-white px-4 py-12 text-center">
            <p className="text-sm font-semibold text-ink">Abhi koi registration nahi</p>
            <p className="mt-1 text-xs text-muted">Home page se email + WhatsApp register hone par yahan dikhenge.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-md border border-line bg-white px-3 py-3 shadow-sm"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-ink hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{item.email}</span>
                  </a>
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/^\+/, "").replace(/^0/, "92")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {item.whatsapp}
                  </a>
                  <p className="text-[11px] text-muted">
                    {new Date(item.createdAt).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loadingId === item.id}
                  onClick={() => remove(item.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-line text-red-600 hover:bg-red-50 disabled:opacity-50"
                  aria-label="Delete subscriber"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {toast ? (
          <p className="fixed right-4 bottom-28 z-50 rounded-md bg-ink px-3 py-2 text-xs text-white shadow-lg">
            {toast}
          </p>
        ) : null}
      </div>
    </AdminShell>
  );
}
