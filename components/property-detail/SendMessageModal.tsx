"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/data/site";

type SendMessageModalProps = {
  open: boolean;
  onClose: () => void;
  propertyTitle: string;
};

const fieldClass =
  "w-full rounded border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary";

export function SendMessageModal({ open, onClose, propertyTitle }: SendMessageModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          propertyTitle,
          source: "Property detail message",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Unable to send message.");
        return;
      }
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-message-title"
        className="relative z-10 w-full max-w-md rounded border border-line bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="send-message-title" className="text-lg font-bold text-ink">
              Send Message
            </h2>
            <p className="mt-1 text-xs text-muted">{propertyTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <p className="mt-4 rounded border border-[#CDE8D4] bg-[#EAF7EE] p-3 text-sm text-ink">
            Message sent to {site.email}. We will reply soon Insha&apos;Allah.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink">Name*</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink">Phone*</span>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink">Message*</span>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={fieldClass}
                placeholder={`Assalam o Alaikum, mujhe ${propertyTitle} ke bare mein maloomat chahiye`}
              />
            </label>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded bg-primary text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
