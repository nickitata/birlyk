import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useI18n } from "./button-Dw7b32bY.mjs";
import { t as supabase } from "./client-CbJ-cyTK.mjs";
import { t as Route } from "./e._slug-BBQ1Veu5.mjs";
import { i as normalizeLayout, t as VenueMap } from "./VenueMap-CBdAcvuD.mjs";
import { t as GuestLookup } from "./GuestLookup-378PrNVE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/e._slug-By1tzI_P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicEvent() {
	const { slug } = Route.useParams();
	const { t, formatDate } = useI18n();
	const [ev, setEv] = (0, import_react.useState)(void 0);
	(0, import_react.useEffect)(() => {
		supabase.rpc("get_public_event", { _slug: slug }).then(({ data }) => setEv(data ?? null));
	}, [slug]);
	if (ev === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-10 text-center text-muted-foreground",
		children: "…"
	});
	if (ev === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-10 text-center text-muted-foreground",
		children: t("not_found")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-4xl px-4 py-10 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-primary",
					children: t("public_event")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-4xl font-extrabold",
					children: ev.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted-foreground",
					children: [
						formatDate(ev.event_date),
						" ",
						ev.event_time ? `· ${ev.event_time}` : "",
						" ",
						ev.venue_name ? `· ${ev.venue_name}` : "",
						" ",
						ev.venue_address ? `, ${ev.venue_address}` : ""
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLookup, { slug }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenueMap, { layout: normalizeLayout(ev.layout) })
		]
	});
}
//#endregion
export { PublicEvent as component };
