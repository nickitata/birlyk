import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useI18n, t as Button } from "./button-Dw7b32bY.mjs";
import { t as supabase } from "./client-CbJ-cyTK.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Move, c as Link2, h as Camera } from "../_libs/lucide-react.mjs";
import { t as GuestLookup } from "./GuestLookup-378PrNVE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cef6FCmV.js
var import_jsx_runtime = require_jsx_runtime();
var hero_hall_default = "/assets/hero-hall-CcKpF8lE.jpg";
function Index() {
	const { t } = useI18n();
	const navigate = useNavigate();
	async function createEvent() {
		const { data } = await supabase.auth.getSession();
		navigate({ to: data.session ? "/dashboard" : "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero_hall_default,
					alt: "",
					width: 1600,
					height: 912,
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-hero" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl px-4 py-24 md:py-36 text-primary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "inline-block rounded-full bg-background/15 px-3 py-1 text-sm font-semibold backdrop-blur",
							children: t("hero_kicker")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 max-w-3xl text-4xl md:text-6xl font-extrabold leading-tight",
							children: t("hero_title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-2xl text-lg opacity-90",
							children: t("hero_sub")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "rounded-full",
								onClick: createEvent,
								children: t("cta_create")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "rounded-full",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#lookup",
									children: t("cta_try")
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "lookup",
			className: "mx-auto max-w-4xl px-4 -mt-12 relative scroll-mt-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestLookup, { showDemoHint: true })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-6xl gap-5 px-4 py-20 md:grid-cols-3",
			children: [
				{
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6" }),
					t: t("feat1_t"),
					d: t("feat1_d")
				},
				{
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "h-6 w-6" }),
					t: t("feat2_t"),
					d: t("feat2_d")
				},
				{
					i: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-6 w-6" }),
					t: t("feat3_t"),
					d: t("feat3_d")
				}
			].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground",
						children: f.i
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-lg font-bold",
						children: f.t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: f.d
					})
				]
			}, f.t))
		})
	] });
}
//#endregion
export { Index as component };
