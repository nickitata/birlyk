export type TableShape = "round" | "rect";
export type VenueTable = { id: string; label: string; shape: TableShape; x: number; y: number; w: number; h: number; seats: number };
export type FeatureType = "stage" | "dancefloor" | "door" | "bar" | "wall" | "other";
export type VenueFeature = { type: FeatureType; label: string; x: number; y: number; w: number; h: number };
export type VenueLayout = { width: number; height: number; tables: VenueTable[]; features: VenueFeature[] };

export const emptyLayout = (): VenueLayout => ({ width: 1000, height: 700, tables: [], features: [] });

export function normalizeLayout(raw: unknown): VenueLayout {
  const l = (raw ?? {}) as Partial<VenueLayout>;
  return {
    width: Number(l.width) || 1000,
    height: Number(l.height) || 700,
    tables: Array.isArray(l.tables) ? l.tables : [],
    features: Array.isArray(l.features) ? l.features : [],
  };
}

/** Seat centers for a table, seat numbers 1..n */
export function seatPositions(t: VenueTable): { n: number; x: number; y: number }[] {
  const out: { n: number; x: number; y: number }[] = [];
  const cx = t.x + t.w / 2;
  const cy = t.y + t.h / 2;
  if (t.shape === "round") {
    const r = Math.max(t.w, t.h) / 2 + 16;
    for (let i = 0; i < t.seats; i++) {
      const a = (i / t.seats) * Math.PI * 2 - Math.PI / 2;
      out.push({ n: i + 1, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
  } else {
    const top = Math.ceil(t.seats / 2);
    const bottom = t.seats - top;
    for (let i = 0; i < top; i++) out.push({ n: i + 1, x: t.x + ((i + 1) * t.w) / (top + 1), y: t.y - 16 });
    for (let i = 0; i < bottom; i++) out.push({ n: top + i + 1, x: t.x + ((i + 1) * t.w) / (bottom + 1), y: t.y + t.h + 16 });
  }
  return out;
}

export const newId = () => Math.random().toString(36).slice(2, 9);
