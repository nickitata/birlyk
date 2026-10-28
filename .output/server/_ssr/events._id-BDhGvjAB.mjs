import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as useI18n, i as cn, t as Button } from "./button-Dw7b32bY.mjs";
import { t as supabase } from "./client-CbJ-cyTK.mjs";
import { t as Input } from "./input-D8m6tiBL.mjs";
import { t as Label } from "./label-Cl8CDyyY.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as saveGuestToPostgres } from "./backend-api-t_CPCZq8.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as ArrowLeft, h as Camera, i as Plus, n as Trash2, o as MapPin, s as LoaderCircle, t as Upload, u as Copy } from "../_libs/lucide-react.mjs";
import { i as normalizeLayout, n as emptyLayout, r as newId, t as VenueMap } from "./VenueMap-CBdAcvuD.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-C9-MeJfD.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CMevzYJH.mjs";
import { t as Route } from "./events._id-YzmR1ksP.mjs";
import { in as object, sn as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as TabsTrigger$1, n as TabsContent$1, r as TabsList$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events._id-BDhGvjAB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeVenue = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => object({ image: string().startsWith("data:image/").max(6e6) }).parse(input)).handler(createSsrRpc("512ffdc0feb6e3f1300c22b6e37bbbdcf4bb4f7b0ec960cb29975e3f3ac1c5f2"));
var Tabs = Tabs$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsList$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsTrigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsContent$1.displayName;
function resizeImage(file, max = 1280) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const s = Math.min(1, max / Math.max(img.width, img.height));
			const c = document.createElement("canvas");
			c.width = Math.round(img.width * s);
			c.height = Math.round(img.height * s);
			c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
			resolve(c.toDataURL("image/jpeg", .85));
			URL.revokeObjectURL(img.src);
		};
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}
function EventManager() {
	const { id } = Route.useParams();
	const { user } = Route.useRouteContext();
	const { t } = useI18n();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const ev = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
			if (error) throw error;
			return data;
		}
	});
	const guests = useQuery({
		queryKey: ["guests", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("guests").select("id, full_name, phone, table_label, seat_number").eq("event_id", id).order("created_at");
			if (error) throw error;
			return data;
		}
	});
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		event_date: "",
		event_time: "",
		venue_name: "",
		venue_address: ""
	});
	const [layout, setLayout] = (0, import_react.useState)(emptyLayout());
	const [selTable, setSelTable] = (0, import_react.useState)(null);
	const [assignGuest, setAssignGuest] = (0, import_react.useState)(null);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const uploadRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!ev.data) return;
		setForm({
			title: ev.data.title ?? "",
			event_date: ev.data.event_date ?? "",
			event_time: ev.data.event_time ?? "",
			venue_name: ev.data.venue_name ?? "",
			venue_address: ev.data.venue_address ?? ""
		});
		setLayout(normalizeLayout(ev.data.layout));
	}, [ev.data]);
	const occupied = (0, import_react.useMemo)(() => new Set((guests.data ?? []).filter((g) => g.table_label && g.seat_number).map((g) => `${g.table_label}#${g.seat_number}`)), [guests.data]);
	if (ev.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-10 text-center text-muted-foreground",
		children: "…"
	});
	if (!ev.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "p-10 text-center",
		children: t("not_found")
	});
	const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/e/${ev.data.slug}` : `/e/${ev.data.slug}`;
	async function update(patch, msg = t("ev_saved")) {
		const { error } = await supabase.from("events").update(patch).eq("id", id);
		if (error) {
			toast.error(t("error_generic"));
			return;
		}
		toast.success(msg);
		qc.invalidateQueries({ queryKey: ["event", id] });
		qc.invalidateQueries({ queryKey: ["events"] });
	}
	async function onPhoto(file) {
		if (!file) return;
		try {
			const dataUrl = await resizeImage(file);
			setPhoto(dataUrl);
			setAnalyzing(true);
			const res = await analyzeVenue({ data: { image: dataUrl } });
			setAnalyzing(false);
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setLayout({
				width: 1e3,
				height: 700,
				tables: res.tables,
				features: res.features
			});
			toast.success(`${t("venue_done")} · ${res.tables.length}`);
		} catch {
			setAnalyzing(false);
			toast.error(t("error_generic"));
		}
	}
	function addTable(shape) {
		const n = layout.tables.length + 1;
		const tb = {
			id: newId(),
			label: String(n),
			shape,
			x: 440,
			y: 300,
			w: shape === "round" ? 110 : 180,
			h: shape === "round" ? 110 : 70,
			seats: shape === "round" ? 8 : 8
		};
		setLayout({
			...layout,
			tables: [...layout.tables, tb]
		});
		setSelTable(tb.id);
	}
	const sel = layout.tables.find((x) => x.id === selTable);
	const patchSel = (p) => setLayout({
		...layout,
		tables: layout.tables.map((x) => x.id === selTable ? {
			...x,
			...p
		} : x)
	});
	async function addGuest(e) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const name = String(fd.get("name") ?? "").trim().slice(0, 100);
		if (!name) return;
		const seat = parseInt(String(fd.get("seat") ?? ""), 10);
		const guest = {
			id: crypto.randomUUID(),
			event_id: id,
			owner_id: user.id,
			full_name: name,
			phone: String(fd.get("phone") ?? "").trim().slice(0, 30) || null,
			table_label: String(fd.get("table") ?? "").trim().slice(0, 8) || null,
			seat_number: Number.isFinite(seat) ? seat : null
		};
		const { error } = await supabase.from("guests").insert(guest);
		if (error) {
			toast.error(t("error_generic"));
			return;
		}
		try {
			await saveGuestToPostgres({
				id: guest.id,
				eventId: guest.event_id,
				ownerId: guest.owner_id,
				fullName: guest.full_name,
				phone: guest.phone,
				tableLabel: guest.table_label,
				seatNumber: guest.seat_number
			});
		} catch (backendError) {
			console.error("Failed to save the guest to PostgreSQL.", backendError);
			const { error: rollbackError } = await supabase.from("guests").delete().eq("id", guest.id);
			if (rollbackError) console.error("Failed to roll back the Supabase guest.", rollbackError);
			toast.error(t("error_generic"));
			return;
		}
		e.currentTarget.reset();
		qc.invalidateQueries({ queryKey: ["guests", id] });
	}
	async function patchGuest(gid, p) {
		const { error } = await supabase.from("guests").update(p).eq("id", gid);
		if (error) {
			toast.error(t("error_generic"));
			return;
		}
		qc.invalidateQueries({ queryKey: ["guests", id] });
	}
	async function delGuest(gid) {
		await supabase.from("guests").delete().eq("id", gid);
		qc.invalidateQueries({ queryKey: ["guests", id] });
	}
	const assigning = guests.data?.find((g) => g.id === assignGuest);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), t("ev_back")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold",
					children: ev.data.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "ml-auto rounded-full",
					variant: ev.data.is_published ? "outline" : "default",
					onClick: () => update({
						is_published: !ev.data.is_published,
						layout
					}, ev.data.is_published ? t("ev_unpublish") : t("ev_publish")),
					children: ev.data.is_published ? t("ev_unpublish") : t("ev_publish")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [t("ev_public_link"), ":"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: publicUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "font-semibold text-primary break-all",
						children: publicUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						className: "ml-auto",
						onClick: () => {
							navigator.clipboard.writeText(publicUrl);
							toast.success(t("ev_copied"));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" }), t("ev_copy")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "venue",
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "details",
							children: t("tab_details")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "venue",
							children: t("tab_venue")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "guests",
							children: t("tab_guests")
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "details",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2",
							onSubmit: (e) => {
								e.preventDefault();
								update({
									...form,
									title: form.title.trim() || ev.data.title,
									event_date: form.event_date || null
								});
							},
							children: [[
								[
									"title",
									"ev_title",
									"text"
								],
								[
									"event_date",
									"ev_date",
									"date"
								],
								[
									"event_time",
									"ev_time",
									"time"
								],
								[
									"venue_name",
									"ev_venue",
									"text"
								],
								[
									"venue_address",
									"ev_address",
									"text"
								]
							].map(([k, lab, type]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: k === "venue_address" ? "md:col-span-2" : "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t(lab) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type,
									maxLength: 160,
									value: form[k],
									onChange: (e) => setForm({
										...form,
										[k]: e.target.value
									}),
									className: "mt-1.5"
								})]
							}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: t("ev_save")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									className: "ml-auto text-destructive",
									onClick: async () => {
										if (!confirm(t("ev_delete") + "?")) return;
										await supabase.from("events").delete().eq("id", id);
										qc.invalidateQueries({ queryKey: ["events"] });
										navigate({ to: "/dashboard" });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), t("ev_delete")]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "venue",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: uploadRef,
									type: "file",
									accept: "image/*",
									hidden: true,
									onChange: (e) => {
										onPhoto(e.target.files?.[0]);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: cameraRef,
									type: "file",
									accept: "image/*",
									capture: "environment",
									hidden: true,
									onChange: (e) => {
										onPhoto(e.target.files?.[0]);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => uploadRef.current?.click(),
									disabled: analyzing,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), t("venue_upload")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									onClick: () => cameraRef.current?.click(),
									disabled: analyzing,
									"aria-label": "Camera",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => addTable("round"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), t("venue_add_round")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => addTable("rect"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), t("venue_add_rect")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									className: "ml-auto",
									onClick: () => update({ layout }),
									children: t("venue_save")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 lg:grid-cols-[1fr_280px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 rounded-xl border bg-accent/40 p-3 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), t("venue_analyzing")]
									}),
									assigning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }),
											t("venue_assigning"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: assigning.full_name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "ml-auto underline",
												onClick: () => setAssignGuest(null),
												children: "×"
											})
										]
									}),
									layout.tables.length === 0 && !analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-xl border border-dashed p-4 text-sm text-muted-foreground",
										children: t("venue_empty")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenueMap, {
										layout,
										editable: true,
										onChange: setLayout,
										selectedTableId: selTable,
										onSelectTable: setSelTable,
										occupied,
										onSeatClick: assignGuest ? (label, seat) => {
											patchGuest(assignGuest, {
												table_label: label,
												seat_number: seat
											});
											setAssignGuest(null);
										} : void 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t("venue_hint")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "space-y-4",
								children: [
									photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photo,
										alt: "Venue",
										className: "w-full rounded-xl border"
									}),
									sel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 rounded-xl border bg-card p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("venue_label") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: sel.label,
												maxLength: 8,
												onChange: (e) => patchSel({ label: e.target.value }),
												className: "mt-1"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("venue_seats") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 1,
												max: 20,
												value: sel.seats,
												onChange: (e) => patchSel({ seats: Math.max(1, Math.min(20, +e.target.value || 1)) }),
												className: "mt-1"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "ghost",
												className: "w-full text-destructive",
												onClick: () => {
													setLayout({
														...layout,
														tables: layout.tables.filter((x) => x.id !== selTable)
													});
													setSelTable(null);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), t("venue_remove")]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border bg-card p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-2 text-sm font-bold",
											children: t("tab_guests")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "max-h-80 space-y-1 overflow-auto",
											children: [guests.data?.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setAssignGuest(g.id === assignGuest ? null : g.id),
												className: `flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm ${g.id === assignGuest ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: g.full_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs opacity-75",
													children: g.table_label ? `${g.table_label}/${g.seat_number ?? "–"}` : "—"
												})]
											}, g.id)), guests.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: t("guests_none")
											})]
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "guests",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: addGuest,
							className: "grid gap-2 rounded-2xl border bg-card p-4 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "name",
									placeholder: t("guests_name"),
									required: true,
									maxLength: 100
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "phone",
									placeholder: t("guests_phone"),
									maxLength: 30
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "table",
									placeholder: t("guests_table"),
									maxLength: 8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									name: "seat",
									type: "number",
									min: 1,
									max: 20,
									placeholder: t("guests_seat")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), t("guests_add")]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-2xl border bg-card",
							children: [guests.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-muted-foreground",
								children: t("guests_none")
							}), guests.data?.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid items-center gap-2 border-b p-3 last:border-0 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: g.full_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: g.phone || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: g.table_label ?? "",
										maxLength: 8,
										placeholder: t("guests_table"),
										onBlur: (e) => e.target.value !== (g.table_label ?? "") && patchGuest(g.id, { table_label: e.target.value.trim() || null })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: g.seat_number ?? "",
										type: "number",
										min: 1,
										max: 20,
										placeholder: t("guests_seat"),
										onBlur: (e) => {
											const v = parseInt(e.target.value, 10);
											patchGuest(g.id, { seat_number: Number.isFinite(v) ? v : null });
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => delGuest(g.id),
										"aria-label": "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}, g.id))]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { EventManager as component };
