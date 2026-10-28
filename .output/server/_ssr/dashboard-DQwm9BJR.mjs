import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as useI18n, i as cn, t as Button } from "./button-Dw7b32bY.mjs";
import { t as supabase } from "./client-CbJ-cyTK.mjs";
import { t as Input } from "./input-D8m6tiBL.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./dashboard-Cma25X5C.mjs";
import { t as saveEventToPostgres } from "./backend-api-t_CPCZq8.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as CalendarDays, i as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DQwm9BJR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function slugify(s) {
	return (s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "event") + "-" + Math.random().toString(36).slice(2, 7);
}
function Dashboard() {
	const { t, formatDate } = useI18n();
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const profile = useQuery({
		queryKey: ["profile", user.id],
		queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data
	});
	const events = useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const { data, error } = await supabase.from("events").select("*, guests(count)").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	async function create(e) {
		e.preventDefault();
		if (!title.trim()) return;
		const event = {
			id: crypto.randomUUID(),
			title: title.trim().slice(0, 120),
			slug: slugify(title),
			owner_id: user.id
		};
		const { data, error } = await supabase.from("events").insert(event).select("id").single();
		if (error) {
			toast.error(t("error_generic"));
			return;
		}
		try {
			await saveEventToPostgres(event);
		} catch (backendError) {
			console.error("Failed to save the event to PostgreSQL.", backendError);
			const { error: rollbackError } = await supabase.from("events").delete().eq("id", data.id);
			if (rollbackError) console.error("Failed to roll back the Supabase event.", rollbackError);
			toast.error(t("error_generic"));
			return;
		}
		qc.invalidateQueries({ queryKey: ["events"] });
		navigate({
			to: "/events/$id",
			params: { id: data.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					t("dash_hello"),
					", ",
					profile.data?.full_name || user.email,
					profile.data?.organization ? ` · ${profile.data.organization}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: t("dash_title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: create,
				className: "mt-6 flex gap-2 max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: t("ev_title"),
					className: "h-11 rounded-xl",
					maxLength: 120
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "h-11 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), t("dash_new")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [events.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: t("dash_empty")
				}), events.data?.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/events/$id",
					params: { id: ev.id },
					className: "rounded-2xl border bg-card p-5 transition hover:shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: ev.is_published ? "default" : "secondary",
								children: ev.is_published ? t("dash_published") : t("dash_draft")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted-foreground",
								children: [
									ev.guests?.[0]?.count ?? 0,
									" ",
									t("dash_guests")
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-lg font-bold",
							children: ev.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" }), formatDate(ev.event_date)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm font-semibold text-primary",
							children: [t("dash_open"), " →"]
						})
					]
				}, ev.id))]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
