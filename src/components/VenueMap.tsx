import { useRef, useState } from "react";
import { seatPositions, type VenueLayout } from "@/lib/layout";

type Props = {
  layout: VenueLayout;
  highlight?: { table: string | null; seat: number | null } | null;
  youLabel?: string;
  editable?: boolean;
  onChange?: (l: VenueLayout) => void;
  selectedTableId?: string | null;
  onSelectTable?: (id: string | null) => void;
  onSeatClick?: ((tableLabel: string, seat: number) => void) | undefined;
  occupied?: Set<string>;
};

export function VenueMap({ layout, highlight, youLabel, editable, onChange, selectedTableId, onSelectTable, onSeatClick, occupied }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null);

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: p.x, y: p.y };
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag || !onChange) return;
    const p = toSvg(e);
    onChange({
      ...layout,
      tables: layout.tables.map((t) =>
        t.id === drag.id
          ? { ...t, x: Math.max(0, Math.min(layout.width - t.w, p.x - drag.dx)), y: Math.max(0, Math.min(layout.height - t.h, p.y - drag.dy)) }
          : t,
      ),
    });
  };

  const hlTable = highlight?.table?.toString().trim().toLowerCase();

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="w-full h-auto rounded-2xl border bg-map-floor touch-none select-none"
      onPointerMove={onMove}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
      onPointerDown={(e) => {
        if (e.target === svgRef.current) onSelectTable?.(null);
      }}
    >
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" className="stroke-border" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={layout.width} height={layout.height} fill="url(#grid)" pointerEvents="none" />
      <rect x="4" y="4" width={layout.width - 8} height={layout.height - 8} rx="18" fill="none" className="stroke-muted-foreground/40" strokeWidth="6" pointerEvents="none" />

      {layout.features.map((f, i) => (
        <g key={i} pointerEvents="none">
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="10"
            className={f.type === "dancefloor" ? "fill-accent/60 stroke-gold" : f.type === "door" ? "fill-primary/20 stroke-primary" : "fill-map-feature stroke-muted-foreground/30"}
            strokeWidth="2" strokeDasharray={f.type === "dancefloor" ? "8 6" : undefined} />
          <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground font-sans" fontSize="18" fontWeight="700">
            {f.label}
          </text>
        </g>
      ))}

      {layout.tables.map((t) => {
        const isHl = !!hlTable && t.label.toString().trim().toLowerCase() === hlTable;
        const isSel = selectedTableId === t.id;
        const cx = t.x + t.w / 2;
        const cy = t.y + t.h / 2;
        const seats = seatPositions(t);
        return (
          <g key={t.id} opacity={hlTable && !isHl ? 0.45 : 1}>
            {seats.map((s) => {
              const isSeat = isHl && highlight?.seat === s.n;
              const taken = occupied?.has(`${t.label}#${s.n}`);
              return (
                <g key={s.n} onClick={() => onSeatClick?.(t.label, s.n)} className={onSeatClick ? "cursor-pointer" : undefined}>
                  {isSeat && <circle cx={s.x} cy={s.y} r="16" className="fill-highlight seat-pulse" />}
                  <circle cx={s.x} cy={s.y} r={isSeat ? 13 : 10}
                    className={isSeat ? "fill-highlight stroke-primary-foreground" : taken ? "fill-primary/70 stroke-primary" : "fill-map-seat stroke-muted-foreground/50"}
                    strokeWidth="2" />
                  <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="700"
                    className={isSeat || taken ? "fill-primary-foreground" : "fill-muted-foreground"} pointerEvents="none">
                    {s.n}
                  </text>
                </g>
              );
            })}
            {t.shape === "round" ? (
              <ellipse cx={cx} cy={cy} rx={t.w / 2} ry={t.h / 2}
                className={`${isHl ? "fill-highlight/25 stroke-highlight" : "fill-map-table stroke-gold"} ${editable ? "cursor-move" : ""}`}
                strokeWidth={isSel || isHl ? 5 : 3} strokeDasharray={isSel ? "6 4" : undefined}
                onPointerDown={(e) => {
                  if (!editable) return;
                  const p = toSvg(e);
                  onSelectTable?.(t.id);
                  setDrag({ id: t.id, dx: p.x - t.x, dy: p.y - t.y });
                }} />
            ) : (
              <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="10"
                className={`${isHl ? "fill-highlight/25 stroke-highlight" : "fill-map-table stroke-gold"} ${editable ? "cursor-move" : ""}`}
                strokeWidth={isSel || isHl ? 5 : 3} strokeDasharray={isSel ? "6 4" : undefined}
                onPointerDown={(e) => {
                  if (!editable) return;
                  const p = toSvg(e);
                  onSelectTable?.(t.id);
                  setDrag({ id: t.id, dx: p.x - t.x, dy: p.y - t.y });
                }} />
            )}
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="800" className="fill-foreground font-display" pointerEvents="none">
              {t.label}
            </text>
            {isHl && highlight?.seat && youLabel && (() => {
              const s = seats.find((x) => x.n === highlight.seat);
              if (!s) return null;
              return (
                <g pointerEvents="none">
                  <rect x={s.x - 55} y={s.y - 48} width="110" height="26" rx="13" className="fill-foreground" />
                  <text x={s.x} y={s.y - 35} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" className="fill-background">{youLabel}</text>
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}
