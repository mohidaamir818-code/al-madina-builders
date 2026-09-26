/** Extract lat/lng from a Google Maps URL (final or short-resolved). */
export function extractLatLngFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const candidates = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /\/search\/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/,
    /place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];

  for (const re of candidates) {
    const match = url.match(re);
    if (!match) continue;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }
  return null;
}

export function isLikelyMapsUrl(raw: string) {
  try {
    const u = new URL(raw.trim());
    return (
      u.hostname.includes("google.") ||
      u.hostname.includes("goo.gl") ||
      u.hostname.includes("maps.app.goo.gl")
    );
  } catch {
    return false;
  }
}
