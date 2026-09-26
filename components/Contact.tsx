"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const serviceOptions = ["Free Consultation", ...services.map((item) => item.title)];

type FormState = {
  name: string;
  phone: string;
  service: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  service: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^(\+92|0)?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      next.phone = "Enter a valid Pakistani mobile number.";
    }
    if (!form.service) next.service = "Please select a service.";
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
          service: form.service,
          message: form.message.trim(),
          source: "Homepage contact form",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(data.error || "Unable to send message.");
        return;
      }
      setSent(true);
      setForm(emptyForm);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  return (
    <section id="contact" className="bg-brand scroll-mt-24 py-14 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="text-white">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary-bright uppercase">
              Let&apos;s Build Together
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
              Let&apos;s Build Your Dream Together
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Tell us about the plot, the house map or the property you are looking for. We reply by email and phone.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <a href={`tel:${site.phoneTel}`} className="inline-flex items-center gap-3 hover:text-primary-bright">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-primary-bright">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{site.address}</span>
              </li>
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-md border border-white/10 bg-white p-5 shadow-sm sm:p-6"
          >
            <h3 className="text-lg font-semibold text-ink">Send a Message</h3>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className={fieldClass}
                />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
              </label>
              <label className="block">
                <span className="sr-only">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className={fieldClass}
                />
                {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
              </label>
              <label className="block">
                <span className="sr-only">Service</span>
                <select
                  name="service"
                  value={form.service}
                  onChange={(event) => setForm({ ...form, service: event.target.value })}
                  className={cn(fieldClass, !form.service && "text-muted")}
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.service ? <p className="mt-1 text-xs text-red-600">{errors.service}</p> : null}
              </label>
              <label className="block">
                <span className="sr-only">Message</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Message"
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  className={cn(fieldClass, "resize-none")}
                />
                {errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
              </label>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send Inquiry"}
              </Button>
              {submitError ? (
                <p className="text-xs text-red-600" role="alert">
                  {submitError}
                </p>
              ) : null}
              {sent ? (
                <p className="text-xs text-primary" role="status">
                  Message sent to {site.email}. We will contact you soon.
                </p>
              ) : null}
            </div>
          </form>

          <div className="min-h-[280px] overflow-hidden rounded-md border border-white/10 bg-white shadow-sm lg:min-h-full">
            <iframe
              title="Al Madina Builders location in Multan"
              src={site.mapEmbed}
              className="h-full min-h-[280px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
