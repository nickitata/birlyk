import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VenueMap-CBdAcvuD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyLayout = () => ({
	width: 1e3,
	height: 700,
	tables: [],
	features: []
});
function normalizeLayout(raw) {
	const l = raw ?? {};
	return {
		width: Number(l.width) || 1e3,
		height: Number(l.height) || 700,
		tables: Array.isArray(l.tables) ? l.tables : [],
		features: Array.isArray(l.features) ? l.features : []
	};
}
/** Seat centers for a table, seat numbers 1..n */
function seatPositions(t) {
	const out = [];
	const cx = t.x + t.w / 2;
	const cy = t.y + t.h / 2;
	if (t.shape === "round") {
		const r = Math.max(t.w, t.h) / 2 + 16;
		for (let i = 0; i < t.seats; i++) {
			const a = i / t.seats * Math.PI * 2 - Math.PI / 2;
			out.push({
				n: i + 1,
				x: cx + Math.cos(a) * r,
				y: cy + Math.sin(a) * r
			});
		}
	} else {
		const top = Math.ceil(t.seats / 2);
		const bottom = t.seats - top;
		for (let i = 0; i < top; i++) out.push({
			n: i + 1,
			x: t.x + (i + 1) * t.w / (top + 1),
			y: t.y - 16
		});
		for (let i = 0; i < bottom; i++) out.push({
			n: top + i + 1,
			x: t.x + (i + 1) * t.w / (bottom + 1),
			y: t.y + t.h + 16
		});
	}
	return out;
}
var newId = () => Math.random().toString(36).slice(2, 9);
function VenueMap({ layout, highlight, youLabel, editable, onChange, selectedTableId, onSelectTable, onSeatClick, occupied }) {
	const svgRef = (0, import_react.useRef)(null);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const toSvg = (e) => {
		const svg = svgRef.current;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const p = pt.matrixTransform(svg.getScreenCTM().inverse());
		return {
			x: p.x,
			y: p.y
		};
	};
	const onMove = (e) => {
		if (!drag || !onChange) return;
		const p = toSvg(e);
		onChange({
			...layout,
			tables: layout.tables.map((t) => t.id === drag.id ? {
				...t,
				x: Math.max(0, Math.min(layout.width - t.w, p.x - drag.dx)),
				y: Math.max(0, Math.min(layout.height - t.h, p.y - drag.dy))
			} : t)
		});
	};
	const hlTable = highlight?.table?.toString().trim().toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		ref: svgRef,
		viewBox: `0 0 ${layout.width} ${layout.height}`,
		className: "w-full h-auto rounded-2xl border bg-map-floor touch-none select-none",
		onPointerMove: onMove,
		onPointerUp: () => setDrag(null),
		onPointerLeave: () => setDrag(null),
		onPointerDown: (e) => {
			if (e.target === svgRef.current) onSelectTable?.(null);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
				id: "grid",
				width: "50",
				height: "50",
				patternUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M 50 0 L 0 0 0 50",
					fill: "none",
					className: "stroke-border",
					strokeWidth: "1"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "0",
				y: "0",
				width: layout.width,
				height: layout.height,
				fill: "url(#grid)",
				pointerEvents: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "4",
				width: layout.width - 8,
				height: layout.height - 8,
				rx: "18",
				fill: "none",
				className: "stroke-muted-foreground/40",
				strokeWidth: "6",
				pointerEvents: "none"
			}),
			layout.features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				pointerEvents: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: f.x,
					y: f.y,
					width: f.w,
					height: f.h,
					rx: "10",
					className: f.type === "dancefloor" ? "fill-accent/60 stroke-gold" : f.type === "door" ? "fill-primary/20 stroke-primary" : "fill-map-feature stroke-muted-foreground/30",
					strokeWidth: "2",
					strokeDasharray: f.type === "dancefloor" ? "8 6" : void 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: f.x + f.w / 2,
					y: f.y + f.h / 2,
					textAnchor: "middle",
					dominantBaseline: "middle",
					className: "fill-muted-foreground font-sans",
					fontSize: "18",
					fontWeight: "700",
					children: f.label
				})]
			}, i)),
			layout.tables.map((t) => {
				const isHl = !!hlTable && t.label.toString().trim().toLowerCase() === hlTable;
				const isSel = selectedTableId === t.id;
				const cx = t.x + t.w / 2;
				const cy = t.y + t.h / 2;
				const seats = seatPositions(t);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					opacity: hlTable && !isHl ? .45 : 1,
					children: [
						seats.map((s) => {
							const isSeat = isHl && highlight?.seat === s.n;
							const taken = occupied?.has(`${t.label}#${s.n}`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								onClick: () => onSeatClick?.(t.label, s.n),
								className: onSeatClick ? "cursor-pointer" : void 0,
								children: [
									isSeat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: s.x,
										cy: s.y,
										r: "16",
										className: "fill-highlight seat-pulse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: s.x,
										cy: s.y,
										r: isSeat ? 13 : 10,
										className: isSeat ? "fill-highlight stroke-primary-foreground" : taken ? "fill-primary/70 stroke-primary" : "fill-map-seat stroke-muted-foreground/50",
										strokeWidth: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
										x: s.x,
										y: s.y,
										textAnchor: "middle",
										dominantBaseline: "central",
										fontSize: "10",
										fontWeight: "700",
										className: isSeat || taken ? "fill-primary-foreground" : "fill-muted-foreground",
										pointerEvents: "none",
										children: s.n
									})
								]
							}, s.n);
						}),
						t.shape === "round" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
							cx,
							cy,
							rx: t.w / 2,
							ry: t.h / 2,
							className: `${isHl ? "fill-highlight/25 stroke-highlight" : "fill-map-table stroke-gold"} ${editable ? "cursor-move" : ""}`,
							strokeWidth: isSel || isHl ? 5 : 3,
							strokeDasharray: isSel ? "6 4" : void 0,
							onPointerDown: (e) => {
								if (!editable) return;
								const p = toSvg(e);
								onSelectTable?.(t.id);
								setDrag({
									id: t.id,
									dx: p.x - t.x,
									dy: p.y - t.y
								});
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: t.x,
							y: t.y,
							width: t.w,
							height: t.h,
							rx: "10",
							className: `${isHl ? "fill-highlight/25 stroke-highlight" : "fill-map-table stroke-gold"} ${editable ? "cursor-move" : ""}`,
							strokeWidth: isSel || isHl ? 5 : 3,
							strokeDasharray: isSel ? "6 4" : void 0,
							onPointerDown: (e) => {
								if (!editable) return;
								const p = toSvg(e);
								onSelectTable?.(t.id);
								setDrag({
									id: t.id,
									dx: p.x - t.x,
									dy: p.y - t.y
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: cx,
							y: cy,
							textAnchor: "middle",
							dominantBaseline: "central",
							fontSize: "22",
							fontWeight: "800",
							className: "fill-foreground font-display",
							pointerEvents: "none",
							children: t.label
						}),
						isHl && highlight?.seat && youLabel && (() => {
							const s = seats.find((x) => x.n === highlight.seat);
							if (!s) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								pointerEvents: "none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: s.x - 55,
									y: s.y - 48,
									width: "110",
									height: "26",
									rx: "13",
									className: "fill-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: s.x,
									y: s.y - 35,
									textAnchor: "middle",
									dominantBaseline: "central",
									fontSize: "13",
									fontWeight: "700",
									className: "fill-background",
									children: youLabel
								})]
							});
						})()
					]
				}, t.id);
			})
		]
	});
}
//#endregion
export { normalizeLayout as i, emptyLayout as n, newId as r, VenueMap as t };
