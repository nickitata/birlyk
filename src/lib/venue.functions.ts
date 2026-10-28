import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const analyzeVenue = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ image: z.string().startsWith("data:image/").max(6_000_000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { analyzeVenuePhoto } = await import("./venue.server");
    try {
      const out = await analyzeVenuePhoto(data.image);
      const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, Number(v) || 0));
      return {
        ok: true as const,
        tables: out.tables.slice(0, 80).map((t, i) => {
          const w = clamp(t.w, 60, 320), h = clamp(t.h, 50, 200);
          return {
            id: `ai${i}${Math.random().toString(36).slice(2, 6)}`,
            label: (t.label || String(i + 1)).slice(0, 8),
            shape: t.shape,
            w, h,
            x: clamp(t.x, 0, 1000 - w),
            y: clamp(t.y, 0, 700 - h),
            seats: Math.round(clamp(t.seats, 1, 20)),
          };
        }),
        features: out.features.slice(0, 20).map((f) => ({
          ...f, label: f.label.slice(0, 24),
          w: clamp(f.w, 20, 1000), h: clamp(f.h, 20, 700), x: clamp(f.x, 0, 980), y: clamp(f.y, 0, 680),
        })),
      };
    } catch (e) {
      console.error("analyzeVenue failed", e);
      const status = (e as { statusCode?: number })?.statusCode;
      return { ok: false as const, error: status === 402 ? "AI credits exhausted" : status === 429 ? "Too many requests, try again shortly" : "Could not analyze the photo" };
    }
  });
