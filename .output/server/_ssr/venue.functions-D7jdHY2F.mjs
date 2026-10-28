import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CMevzYJH.mjs";
import { in as object, sn as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/venue.functions-D7jdHY2F.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeVenue_createServerFn_handler = createServerRpc({
	id: "512ffdc0feb6e3f1300c22b6e37bbbdcf4bb4f7b0ec960cb29975e3f3ac1c5f2",
	name: "analyzeVenue",
	filename: "src/lib/venue.functions.ts"
}, (opts) => analyzeVenue.__executeServer(opts));
var analyzeVenue = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => object({ image: string().startsWith("data:image/").max(6e6) }).parse(input)).handler(analyzeVenue_createServerFn_handler, async ({ data }) => {
	const { analyzeVenuePhoto } = await import("./venue.server-CjTakOub.mjs");
	try {
		const out = await analyzeVenuePhoto(data.image);
		const clamp = (v, a, b) => Math.max(a, Math.min(b, Number(v) || 0));
		return {
			ok: true,
			tables: out.tables.slice(0, 80).map((t, i) => {
				const w = clamp(t.w, 60, 320), h = clamp(t.h, 50, 200);
				return {
					id: `ai${i}${Math.random().toString(36).slice(2, 6)}`,
					label: (t.label || String(i + 1)).slice(0, 8),
					shape: t.shape,
					w,
					h,
					x: clamp(t.x, 0, 1e3 - w),
					y: clamp(t.y, 0, 700 - h),
					seats: Math.round(clamp(t.seats, 1, 20))
				};
			}),
			features: out.features.slice(0, 20).map((f) => ({
				...f,
				label: f.label.slice(0, 24),
				w: clamp(f.w, 20, 1e3),
				h: clamp(f.h, 20, 700),
				x: clamp(f.x, 0, 980),
				y: clamp(f.y, 0, 680)
			}))
		};
	} catch (e) {
		console.error("analyzeVenue failed", e);
		const status = e?.statusCode;
		return {
			ok: false,
			error: status === 402 ? "AI credits exhausted" : status === 429 ? "Too many requests, try again shortly" : "Could not analyze the photo"
		};
	}
});
//#endregion
export { analyzeVenue_createServerFn_handler };
