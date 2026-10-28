import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useI18n, t as Button } from "./button-Dw7b32bY.mjs";
import { t as supabase } from "./client-CbJ-cyTK.mjs";
import { t as Input } from "./input-D8m6tiBL.mjs";
import { d as Clock, g as CalendarDays, o as MapPin, r as Search, v as Armchair } from "../_libs/lucide-react.mjs";
import { i as normalizeLayout, t as VenueMap } from "./VenueMap-CBdAcvuD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GuestLookup-378PrNVE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GuestLookup({ slug, showDemoHint }) {
	const { t, formatDate } = useI18n();
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)(null);
	const [active, setActive] = (0, import_react.useState)(0);
	const [err, setErr] = (0, import_react.useState)(null);
	async function search(query = q) {
		if (query.trim().length < 2) return;
		setLoading(true);
		setErr(null);
		const { data, error } = await supabase.rpc("find_guest", slug ? {
			_q: query,
			_slug: slug
		} : { _q: query });
		setLoading(false);
		if (error) return setErr(t("error_generic"));
		setResults(data ?? []);
		setActive(0);
	}
	const r = results?.[active];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border bg-card p-6 md:p-8 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl md:text-3xl font-bold",
				children: t("lookup_title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: t("lookup_sub")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					search();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: t("lookup_placeholder"),
						className: "h-12 pl-9 rounded-xl",
						maxLength: 60
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					className: "h-12 rounded-xl",
					disabled: loading,
					children: loading ? t("lookup_searching") : t("lookup_btn")
				})]
			}),
			showDemoHint && !results && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 text-sm text-primary underline-offset-4 hover:underline",
				onClick: () => {
					setQ("aruzhan");
					search("aruzhan");
				},
				children: t("lookup_demo")
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-destructive",
				children: err
			}),
			results && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-muted-foreground",
				children: t("lookup_none")
			}),
			results && results.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: results.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: i === active ? "default" : "outline",
					className: "rounded-full",
					onClick: () => setActive(i),
					children: x.full_name
				}, x.id))
			}),
			r && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-5 animate-in fade-in slide-in-from-bottom-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: r.event.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold",
						children: r.full_name
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-5 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }),
								label: t("result_date"),
								value: formatDate(r.event.event_date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
								label: t("result_time"),
								value: r.event.event_time || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }),
								label: t("result_venue"),
								value: [r.event.venue_name, r.event.venue_address].filter(Boolean).join(", ") || "—",
								wide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Armchair, { className: "h-4 w-4" }),
								label: `${t("result_table")} / ${t("result_seat")}`,
								value: `${r.table_label ?? "—"} / ${r.seat_number ?? "—"}`,
								accent: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenueMap, {
						layout: normalizeLayout(r.event.layout),
						highlight: {
							table: r.table_label,
							seat: r.seat_number
						},
						youLabel: t("result_you")
					})
				]
			})
		]
	});
}
function Info({ icon, label, value, wide, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border p-3 ${wide ? "col-span-2" : ""} ${accent ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-center gap-1.5 text-xs ${accent ? "opacity-90" : "text-muted-foreground"}`,
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-1 font-bold ${accent ? "text-2xl font-display" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { GuestLookup as t };
