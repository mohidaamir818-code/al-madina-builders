"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Link2, MapPin, Minus, Plus, Search } from "lucide-react";
import { useGoogleMaps } from "@/lib/admin/useGoogleMaps";
import { cn } from "@/lib/cn";

type LocationValue = { lat: number; lng: number; label: string };

type SharedProps = {
  address: string;
  lat: number | null;
  lng: number | null;
  onChange: (next: LocationValue) => void;
};

type Prediction = { placeId: string; description: string };

/** Search + paste-link controls (place above Society dropdown). */
export function LocationSearchControls({ address, lat, lng, onChange }: SharedProps) {
  const { hasKey } = useGoogleMaps();
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const apply = useCallback(
    (nextLat: number, nextLng: number, label?: string) => {
      const roundedLat = Number(nextLat.toFixed(6));
      const roundedLng = Number(nextLng.toFixed(6));
      onChange({
        lat: roundedLat,
        lng: roundedLng,
        label: label?.trim() || `${roundedLat.toFixed(5)}, ${roundedLng.toFixed(5)}`,
      });
    },
    [onChange],
  );

  useEffect(() => {
    if (query.trim().length < 2) {
      setPredictions([]);
      return;
    }
    const t = window.setTimeout(() => {
      setSearchLoading(true);
      setSearchError("");
      fetch(`/api/admin/maps/autocomplete?q=${encodeURIComponent(query.trim())}`)
        .then(async (res) => {
          const data = (await res.json()) as { predictions?: Prediction[]; error?: string };
          if (!res.ok) {
            setSearchError(data.error || "Search unavailable");
            setPredictions([]);
            return;
          }
          setPredictions(data.predictions || []);
          setSearchOpen(true);
        })
        .catch(() => setSearchError("Search failed"))
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const pickPrediction = async (item: Prediction) => {
    setQuery(item.description);
    setSearchOpen(false);
    setPredictions([]);
    try {
      const res = await fetch(`/api/admin/maps/place-details?placeId=${encodeURIComponent(item.placeId)}`);
      const data = (await res.json()) as { lat?: number; lng?: number; label?: string; error?: string };
      if (!res.ok || data.lat == null || data.lng == null) {
        setSearchError(data.error || "Could not load place");
        return;
      }
      apply(data.lat, data.lng, data.label || item.description);
    } catch {
      setSearchError("Could not load place");
    }
  };

  const setFromLink = async () => {
    setLinkError("");
    setLinkLoading(true);
    try {
      const res = await fetch("/api/admin/maps/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl }),
      });
      const data = (await res.json()) as { lat?: number; lng?: number; label?: string; error?: string };
      if (!res.ok || data.lat == null || data.lng == null) {
        setLinkError(
          data.error ||
            "Location link samajh nahi aaya, dobara try karein ya search/drag use karein.",
        );
        return;
      }
      apply(data.lat, data.lng, data.label);
      setLinkOpen(false);
    } catch {
      setLinkError("Location link samajh nahi aaya, dobara try karein ya search/drag use karein.");
    } finally {
      setLinkLoading(false);
    }
  };

  void address;
  void lat;
  void lng;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => predictions.length && setSearchOpen(true)}
          placeholder="Search location on map..."
          className="h-11 w-full rounded border border-line bg-white pr-3 pl-9 text-sm outline-none focus:border-primary"
        />
        {searchLoading ? (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-muted">…</span>
        ) : null}
        {searchOpen && predictions.length ? (
          <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded border border-line bg-white shadow-lg">
            {predictions.map((p) => (
              <li key={p.placeId}>
                <button
                  type="button"
                  onClick={() => void pickPrediction(p)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-mint"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {p.description}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {searchError ? <p className="mt-1 text-xs text-amber-700">{searchError}</p> : null}
        {!hasKey ? (
          <p className="mt-1 text-[11px] text-muted">
            Tip: set <code className="rounded bg-mint px-1">GOOGLE_MAPS_API_KEY</code> in .env.local (Places
            API + Maps JavaScript API).
          </p>
        ) : null}
      </div>

      <div className="rounded border border-line bg-white">
        <button
          type="button"
          onClick={() => setLinkOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-brand"
        >
          <span className="inline-flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Or paste Google Maps link
          </span>
          {linkOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {linkOpen ? (
          <div className="space-y-2 border-t border-line px-3 py-3">
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/... or Google Maps URL"
              className="h-10 w-full rounded border border-line px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              disabled={linkLoading || !linkUrl.trim()}
              onClick={() => void setFromLink()}
              className="inline-flex h-10 items-center justify-center rounded bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {linkLoading ? "Setting…" : "Set Location"}
            </button>
            {linkError ? <p className="text-xs text-red-600">{linkError}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Map canvas + Selected Location bar (place below address fields). */
export function LocationMapPicker({ address, lat, lng, onChange }: SharedProps) {
  const { ready } = useGoogleMaps();
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [zoom, setZoom] = useState(16);

  const safeLat = lat ?? 30.1575;
  const safeLng = lng ?? 71.5249;
  const center = useMemo(() => ({ lat: safeLat, lng: safeLng }), [safeLat, safeLng]);

  const apply = useCallback(
    (nextLat: number, nextLng: number, label?: string) => {
      const roundedLat = Number(nextLat.toFixed(6));
      const roundedLng = Number(nextLng.toFixed(6));
      onChange({
        lat: roundedLat,
        lng: roundedLng,
        label: label?.trim() || `${roundedLat.toFixed(5)}, ${roundedLng.toFixed(5)}`,
      });
    },
    [onChange],
  );

  useEffect(() => {
    if (!ready || !mapEl.current || !window.google?.maps) return;

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapEl.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        position: center,
        draggable: true,
        title: "Drag to fine-tune location",
      });
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current?.getPosition();
        if (!pos) return;
        apply(pos.lat(), pos.lng());
      });
    } else {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
      markerRef.current?.setPosition(center);
    }
  }, [ready, center, zoom, apply]);

  const nudge = (dLat: number, dLng: number) => {
    apply(safeLat + dLat, safeLng + dLng, address);
  };

  const selectedLabel =
    lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Not Selected";

  const iframeSrc = `https://maps.google.com/maps?q=${safeLat},${safeLng}&z=${zoom}&hl=en&output=embed`;

  return (
    <div className="overflow-hidden rounded border border-line">
      <div className="relative h-56 bg-mint sm:h-64">
        {ready ? (
          <div ref={mapEl} className="h-full w-full" />
        ) : (
          <>
            <iframe title="Property location map" src={iframeSrc} className="h-full w-full border-0" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex -translate-y-4 flex-col items-center">
                <span className="mb-1 rounded bg-brand px-2 py-1 text-[10px] font-semibold text-white shadow">
                  Drag the marker to set location
                </span>
                <MapPin className="h-8 w-8 text-primary drop-shadow" fill="currentColor" />
              </div>
            </div>
          </>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setZoom((z) => Math.min(z + 1, 20));
              mapRef.current?.setZoom((mapRef.current.getZoom() || 16) + 1);
            }}
            className="flex h-8 w-8 items-center justify-center rounded bg-white shadow"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom((z) => Math.max(z - 1, 10));
              mapRef.current?.setZoom((mapRef.current.getZoom() || 16) - 1);
            }}
            className="flex h-8 w-8 items-center justify-center rounded bg-white shadow"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {!ready ? (
          <div className="absolute bottom-12 left-2 flex gap-1">
            {(["N", "S", "W", "E"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => {
                  if (dir === "N") nudge(0.001, 0);
                  if (dir === "S") nudge(-0.001, 0);
                  if (dir === "W") nudge(0, -0.001);
                  if (dir === "E") nudge(0, 0.001);
                }}
                className="rounded bg-white/95 px-2 py-1 text-[10px] font-semibold shadow"
              >
                {dir}
              </button>
            ))}
          </div>
        ) : (
          <p className="absolute bottom-12 left-2 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink shadow">
            Drag pin to fine-tune
          </p>
        )}
      </div>
      <div className={cn("bg-brand px-3 py-2 text-xs font-semibold text-white")}>
        Selected Location: {selectedLabel}
      </div>
    </div>
  );
}
