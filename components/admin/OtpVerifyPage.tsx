"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_BASE, OTP_RESEND_COOLDOWN_MS } from "@/lib/admin/constants";

export function OtpVerifyPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(Math.floor(OTP_RESEND_COOLDOWN_MS / 1000));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onPaste = (text: string) => {
    const chars = text.replace(/\D/g, "").slice(0, 6).split("");
    if (!chars.length) return;
    const next = ["", "", "", "", "", ""];
    chars.forEach((c, i) => {
      next[i] = c;
    });
    setDigits(next);
    inputs.current[Math.min(chars.length, 5)]?.focus();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const otp = digits.join("");
      const res = await fetch("/api/admin/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Invalid verification code.");
        return;
      }
      router.replace(`${ADMIN_BASE}/dashboard`);
    } catch {
      setError("Unable to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;
    setError("");
    try {
      const res = await fetch("/api/admin/otp", { method: "PUT" });
      const data = (await res.json()) as { error?: string; waitSec?: number };
      if (!res.ok) {
        setError(data.error || "Unable to resend.");
        if (data.waitSec) setCooldown(data.waitSec);
        return;
      }
      setCooldown(Math.floor(OTP_RESEND_COOLDOWN_MS / 1000));
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch {
      setError("Unable to resend code.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F4] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded border border-line bg-white p-6 shadow-sm sm:p-8"
      >
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Step 2</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Email verification</h1>
        <p className="mt-1 text-sm text-muted">
          Enter the 6-digit code sent to your admin email. Code expires in 10 minutes.
        </p>

        <div className="mt-6 flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e.key)}
              onPaste={(e) => {
                e.preventDefault();
                onPaste(e.clipboardData.getData("text"));
              }}
              className="h-12 w-11 rounded border border-line text-center text-lg font-bold outline-none focus:border-primary sm:h-14 sm:w-12"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || digits.join("").length !== 6}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded bg-brand text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0}
          className="mt-4 w-full text-center text-sm font-semibold text-primary disabled:text-muted"
        >
          {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
        </button>
      </form>
    </div>
  );
}
