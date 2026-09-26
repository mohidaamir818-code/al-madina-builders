"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: typeof google;
    __ambMapsReady?: Promise<void>;
  }
}

function loadMapsScript(apiKey: string) {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__ambMapsReady) return window.__ambMapsReady;

  window.__ambMapsReady = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-amb-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.ambMaps = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(script);
  });

  return window.__ambMapsReady;
}

export function useGoogleMaps() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    if (!key) {
      setError("missing-key");
      return;
    }
    let cancelled = false;
    loadMapsScript(key)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError("load-failed");
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { ready, error, hasKey: Boolean(key) };
}
