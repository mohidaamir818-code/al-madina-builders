"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Star, Trash2, X } from "lucide-react";
import type { Feedback } from "@/lib/feedbackStore";
import { ADMIN_BASE } from "@/lib/admin/constants";
import { AdminShell } from "@/components/admin/AdminShell";
import { cn } from "@/lib/cn";

type Filter = "pending" | "approved" | "all";

export function AdminReviewsPage({ initialFeedbacks }: { initialFeedbacks: Feedback[] }) {
  const [items, setItems] = useState(initialFeedbacks);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loadingId, setLoadingId] = useState("");
  const [toast, setToast] = useState("");

  const pendingCount = useMemo(() => items.filter((f) => !f.isPublished).length, [items]);

  const visible = useMemo(() => {
    if (filter === "pending") return items.filter((f) => !f.isPublished);
    if (filter === "approved") return items.filter((f) => f.isPublished);
    return items;
  }, [items, filter]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const setPublished = async (id: string, isPublished: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/feedbacks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      const data = (await res.json()) as { feedback?: Feedback; error?: string };
      if (!res.ok || !data.feedback) {
        showToast(data.error || "Update failed");
        return;
      }
      setItems((prev) => prev.map((f) => (f.id === id ? data.feedback! : f)));
      showToast(isPublished ? "Approved — home pe show hoga" : "Unpublished");
    } catch {
      showToast("Network error");
    } finally {
      setLoadingId("");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/feedbacks/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Delete failed");
        return;
      }
      setItems((prev) => prev.filter((f) => f.id !== id));
      showToast("Review deleted");
    } catch {
      showToast("Network error");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <AdminShell messageCount={pendingCount}>
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
            <h1 className="text-lg font-bold text-ink">Approve Reviews</h1>
            <p className="text-xs text-muted">
              Naye reviews pehle yahan aate hain. Approve ke baad hi homepage pe dikhte hain.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "pending", label: `Pending (${pendingCount})` },
              { key: "approved", label: "Approved" },
              { key: "all", label: "All" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-md px-3 py-2 text-xs font-semibold",
                filter === tab.key ? "bg-brand text-white" : "border border-line bg-white text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-md border border-dashed border-line bg-white px-4 py-10 text-center text-sm text-muted">
            {filter === "pending" ? "Koi pending review nahi." : "Koi review nahi mila."}
          </p>
        ) : (
          <ul className="space-y-3">
            {visible.map((item) => (
              <li key={item.id} className="rounded-md border border-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                      {" · "}
                      <span className={item.isPublished ? "text-primary" : "text-amber-600"}>
                        {item.isPublished ? "Approved" : "Pending"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < item.rating ? "fill-amber-400 text-amber-400" : "text-line",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!item.isPublished ? (
                    <button
                      type="button"
                      disabled={loadingId === item.id}
                      onClick={() => void setPublished(item.id, true)}
                      className="inline-flex h-9 items-center gap-1.5 rounded bg-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={loadingId === item.id}
                      onClick={() => void setPublished(item.id, false)}
                      className="inline-flex h-9 items-center gap-1.5 rounded border border-line bg-white px-3 text-xs font-semibold text-ink disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Unpublish
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={loadingId === item.id}
                    onClick={() => void remove(item.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </AdminShell>
  );
}
