"use client";

import { FormEvent, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { contactInterestOptions } from "@/data/contact";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

type FormState = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

const empty: FormState = {
  name: "",
  phone: "",
  email: "",
  interest: "Choose an option",
  message: "",
};

const fieldClass =
  "w-full rounded border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-all duration-200 focus:border-primary";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^(\+92|0)?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      next.phone = "Enter a valid Pakistani mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (form.interest === "Choose an option") next.interest = "Please select an interest.";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");
    setSent(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          interest: form.interest,
          message: form.message.trim(),
          source: "Contact page form",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(data.error || "Unable to send message.");
        return;
      }
      setSent(true);
      setForm(empty);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="rounded border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">Send Us a Message</h2>
          <p className="mt-1 text-sm text-muted">
            Fill out the form below — message seedha {site.email} par jayegi.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Full Name*</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className={fieldClass}
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Phone Number*</span>
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className={fieldClass}
            placeholder="03XX-XXXXXXX"
            autoComplete="tel"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Email Address*</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className={fieldClass}
            placeholder="you@email.com"
            autoComplete="email"
          />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Select Interest</span>
          <select
            value={form.interest}
            onChange={(event) => setForm({ ...form, interest: event.target.value })}
            className={cn(fieldClass, form.interest === "Choose an option" && "text-muted")}
          >
            {contactInterestOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {errors.interest ? <p className="mt-1 text-xs text-red-600">{errors.interest}</p> : null}
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-ink">Message*</span>
        <textarea
          rows={5}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className={cn(fieldClass, "resize-none")}
          placeholder="Write your message here..."
        />
        {errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-[#0B3B1E] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#072816] disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {loading ? "Sending…" : "Send Message"}
      </button>

      {submitError ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}
      {sent ? (
        <p className="mt-3 text-sm text-primary" role="status">
          Message sent to {site.email}. We will contact you soon.
        </p>
      ) : null}
    </form>
  );
}
