"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ScheduleVisitModalProps = {
  open: boolean;
  onClose: () => void;
  propertyTitle: string;
};

const fieldClass =
  "w-full rounded border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary";

export function ScheduleVisitModal({ open, onClose, propertyTitle }: ScheduleVisitModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
  const [sent, setSent] = useState(false);

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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Schedule visit:", { propertyTitle, name, phone, when });
    setSent(true);
    setName("");
    setPhone("");
    setWhen("");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-visit-title"
        className="relative z-10 w-full max-w-md rounded border border-line bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="schedule-visit-title" className="text-lg font-bold text-ink">
              Schedule a Visit
            </h2>
            <p className="mt-1 text-xs text-muted">{propertyTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <p className="mt-4 rounded border border-[#CDE8D4] bg-[#EAF7EE] p-3 text-sm text-ink">
            Thank you. Our team will confirm your visit shortly.
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
              <span className="mb-1 block text-xs font-medium text-ink">Preferred Date / Time*</span>
              <input
                required
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className={fieldClass}
              />
            </label>
            <button
              type="submit"
              className={cn(
                "inline-flex h-11 w-full items-center justify-center rounded bg-primary text-sm font-semibold text-white hover:bg-primary-hover",
              )}
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
