"use client";

import { FormEvent, useState } from "react";
import { BellRing, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type FormState = {
  email: string;
  whatsapp: string;
};

const empty: FormState = { email: "", whatsapp: "" };

export function DealAlerts() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const next: Partial<FormState> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!/^(\+92|0)?3\d{9}$/.test(form.whatsapp.replace(/[\s-]/g, ""))) {
      next.whatsapp = "Enter a valid Pakistani WhatsApp number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDone("");
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/deal-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setSubmitError(data.error || "Unable to register. Please try again.");
        return;
      }
      setDone(data.message || "You are registered for deal alerts.");
      setForm(empty);
      setErrors({});
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="deal-alerts" className="scroll-mt-24 relative overflow-hidden py-14 lg:py-20">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(22,163,74,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(11,59,30,0.55),_transparent_50%),linear-gradient(135deg,#072816_0%,#0b3b1e_45%,#14532d_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary-bright uppercase">
            <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
            Early access alerts
          </span>
          <h2 className="mt-4 font-script text-4xl text-white sm:text-5xl">Never Miss a Deal</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Get notified first when a new house, plot or ready-to-build map goes live in Multan. Leave
            your email and WhatsApp — we will only message you about real opportunities.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
          noValidate
        >
          <label className="block text-left">
            <span className="sr-only">Email</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Your email"
                className={cn(
                  "h-12 w-full rounded-md border bg-white pr-3 pl-9 text-sm text-ink outline-none focus:border-primary",
                  errors.email ? "border-red-400" : "border-transparent",
                )}
              />
            </span>
            {errors.email ? <span className="mt-1 block text-xs text-red-200">{errors.email}</span> : null}
          </label>

          <label className="block text-left">
            <span className="sr-only">WhatsApp</span>
            <span className="relative block">
              <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="tel"
                name="whatsapp"
                autoComplete="tel"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                placeholder="WhatsApp (03XX…)"
                className={cn(
                  "h-12 w-full rounded-md border bg-white pr-3 pl-9 text-sm text-ink outline-none focus:border-primary",
                  errors.whatsapp ? "border-red-400" : "border-transparent",
                )}
              />
            </span>
            {errors.whatsapp ? (
              <span className="mt-1 block text-xs text-red-200">{errors.whatsapp}</span>
            ) : null}
          </label>

          <Button type="submit" disabled={loading} className="h-12 w-full sm:w-auto" showArrow={!loading}>
            {loading ? "Saving…" : "Register"}
          </Button>
        </form>

        {done ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium text-primary-bright" role="status">
            {done}
          </p>
        ) : null}
        {submitError ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-red-200" role="alert">
            {submitError}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
