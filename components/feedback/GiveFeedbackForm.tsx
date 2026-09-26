"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { MessageSquareHeart, Send, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const TEXT_MAX = 1000;

export function GiveFeedbackForm() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({});

  const validate = () => {
    const next: { name?: string; text?: string } = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!text.trim()) next.text = "Please write your review.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setToast("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), text: text.trim(), rating }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToast(data.error || "Submit failed");
        return;
      }
      setDone(true);
      setName("");
      setText("");
      setRating(5);
      setToast("Shukriya! Aapka review admin ke paas gaya — approve hone ke baad site pe dikhega.");
    } catch {
      setToast("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 pt-8">
      <Container className="max-w-2xl">
        <div className="rounded-[10px] border border-line bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF7EE] text-brand">
              <MessageSquareHeart className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-ink">Give Feedback</h1>
              <p className="mt-1 text-sm text-muted">
                Apna experience share karein. Review pehle admin approve karega, phir home page par dikhega.
              </p>
            </div>
          </div>

          {done ? (
            <div className="mt-8 space-y-4 text-center">
              <p className="text-base font-semibold text-brand">Thank you for your review!</p>
              <p className="text-sm text-muted">
                Admin approve karne ke baad yeh home page par show hoga.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-deep"
                >
                  Back to Home
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false);
                    setToast("");
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] border border-line px-5 text-sm font-semibold text-ink"
                >
                  Write another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink">Your Name*</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Ali Raza"
                  className={cn(
                    "h-11 w-full rounded-[10px] border px-3 text-sm outline-none focus:border-primary",
                    errors.name ? "border-red-400" : "border-line",
                  )}
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
              </label>

              <div>
                <span className="mb-2 block text-xs font-medium text-ink">Rating</span>
                <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    const active = value <= (hoverRating || rating);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        className="p-0.5"
                        aria-label={`${value} star`}
                      >
                        <Star
                          className={cn(
                            "h-7 w-7 transition-colors",
                            active ? "fill-yellow-400 text-yellow-400" : "text-line",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink">Your Review*</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, TEXT_MAX))}
                  rows={6}
                  placeholder="Apna experience yahan likhein..."
                  className={cn(
                    "w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none focus:border-primary",
                    errors.text ? "border-red-400" : "border-line",
                  )}
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.text ? <p className="text-xs text-red-600">{errors.text}</p> : <span />}
                  <p className="text-[11px] text-muted">
                    {text.length}/{TEXT_MAX}
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? "Submitting…" : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </Container>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
