"use client";

import { useState } from "react";
import { Link2, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

type MapsLinkFieldProps = {
  value: string;
  lat: number | null;
  lng: number | null;
  onChange: (next: { mapsLink: string; lat: number | null; lng: number | null }) => void;
  error?: boolean;
};

export function MapsLinkField({ value, lat, lng, onChange, error }: MapsLinkFieldProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const resolve = async (url: string) => {
    const trimmed = url.trim();
    onChange({ mapsLink: trimmed, lat, lng });
    if (!trimmed) {
      setMsg("");
      onChange({ mapsLink: "", lat: null, lng: null });
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/maps/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as { lat?: number; lng?: number; error?: string };
      if (!res.ok || data.lat == null || data.lng == null) {
        setMsg(
          data.error ||
            "Location link samajh nahi aaya — phir bhi link save ho sakti hai; embed ke liye full Maps URL try karein.",
        );
        onChange({ mapsLink: trimmed, lat: null, lng: null });
        return;
      }
      onChange({ mapsLink: trimmed, lat: data.lat, lng: data.lng });
      setMsg(`Map set: ${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`);
    } catch {
      setMsg("Link check nahi ho saki. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const preview =
    lat != null && lng != null
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`
      : null;

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-ink">
          <Link2 className="h-3.5 w-3.5 text-primary" />
          Google Maps Link<span className="text-red-500">*</span>
        </span>
        <div className="relative">
          <input
            value={value}
            onChange={(e) => onChange({ mapsLink: e.target.value, lat, lng })}
            onBlur={() => void resolve(value)}
            placeholder="Paste Google Maps share link (maps.app.goo.gl / google.com/maps/...)"
            className={cn(
              "h-11 w-full rounded border px-3 pr-10 text-sm outline-none focus:border-primary",
              error ? "border-red-400" : "border-line",
            )}
          />
          {loading ? (
            <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted" />
          ) : null}
        </div>
      </label>
      <p className="text-[11px] text-muted">
        Property Detail page par yahi map dikhega. Phone se location share karke link yahan paste karein.
      </p>
      {msg ? (
        <p className={cn("text-xs", msg.startsWith("Map set") ? "text-primary" : "text-amber-700")}>{msg}</p>
      ) : null}

      {preview ? (
        <div className="overflow-hidden rounded border border-line">
          <iframe title="Map preview" src={preview} className="h-44 w-full border-0" loading="lazy" />
          <div className="flex items-center gap-1.5 bg-brand px-3 py-2 text-xs font-semibold text-white">
            <MapPin className="h-3.5 w-3.5" />
            Preview: {lat!.toFixed(5)}, {lng!.toFixed(5)}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        disabled={loading || !value.trim()}
        onClick={() => void resolve(value)}
        className="inline-flex h-10 items-center justify-center rounded bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Checking…" : "Set Map from Link"}
      </button>
    </div>
  );
}
