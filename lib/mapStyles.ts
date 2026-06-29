import type { StyleSpecification } from "maplibre-gl";

const CACHE = new Map<string, StyleSpecification>();

export async function fetchModifiedStyle(
  url: string,
): Promise<StyleSpecification> {
  const cached = CACHE.get(url);
  if (cached) return cached;

  const res = await fetch(url);
  const style: StyleSpecification = await res.json();

  // Bengali non-Latin text on map tiles is now handled by the MapLibre
  // Complex Text Plugin (registered in map.tsx), which shapes Bengali
  // glyphs via HarfBuzz and serves them through a redirect to the
  // positioned-glyph font server. No need to strip text fields here.

  CACHE.set(url, style);
  return style;
}

export const LIGHT_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
export const DARK_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
