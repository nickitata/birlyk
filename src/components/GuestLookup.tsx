import { useState } from "react";
import { Search, CalendarDays, Clock, MapPin, Armchair } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { normalizeLayout } from "@/lib/layout";
import { VenueMap } from "./VenueMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Result = {
  id: string;
  full_name: string;
  table_label: string | null;
  seat_number: number | null;
  event: { title: string; slug: string; event_date: string | null; event_time: string | null; venue_name: string | null; venue_address: string | null; layout: unknown };
};

export function GuestLookup({ slug, showDemoHint }: { slug?: string; showDemoHint?: boolean }) {
  const { t, formatDate } = useI18n();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [active, setActive] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  async function search(query = q) {
    if (query.trim().length < 2) return;
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase.rpc("find_guest", slug ? { _q: query, _slug: slug } : { _q: query });
    setLoading(false);
    if (error) return setErr(t("error_generic"));
    setResults((data as unknown as Result[]) ?? []);
    setActive(0);
  }

  const r = results?.[active];

  return (
    <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-soft">
      <h2 className="text-2xl md:text-3xl font-bold">{t("lookup_title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("lookup_sub")}</p>
      <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("lookup_placeholder")} className="h-12 pl-9 rounded-xl" maxLength={60} />
        </div>
        <Button type="submit" size="lg" className="h-12 rounded-xl" disabled={loading}>
          {loading ? t("lookup_searching") : t("lookup_btn")}
        </Button>
      </form>
      {showDemoHint && !results && (
        <button type="button" className="mt-3 text-sm text-primary underline-offset-4 hover:underline" onClick={() => { setQ("aruzhan"); search("aruzhan"); }}>
          {t("lookup_demo")}
        </button>
      )}
      {err && <p className="mt-4 text-destructive">{err}</p>}
      {results && results.length === 0 && <p className="mt-5 text-muted-foreground">{t("lookup_none")}</p>}

      {results && results.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {results.map((x, i) => (
            <Button key={x.id} size="sm" variant={i === active ? "default" : "outline"} className="rounded-full" onClick={() => setActive(i)}>
              {x.full_name}
            </Button>
          ))}
        </div>
      )}

      {r && (
        <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <p className="text-sm text-muted-foreground">{r.event.title}</p>
            <h3 className="text-xl font-bold">{r.full_name}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Info icon={<CalendarDays className="h-4 w-4" />} label={t("result_date")} value={formatDate(r.event.event_date)} />
            <Info icon={<Clock className="h-4 w-4" />} label={t("result_time")} value={r.event.event_time || "—"} />
            <Info icon={<MapPin className="h-4 w-4" />} label={t("result_venue")} value={[r.event.venue_name, r.event.venue_address].filter(Boolean).join(", ") || "—"} wide />
            <Info icon={<Armchair className="h-4 w-4" />} label={`${t("result_table")} / ${t("result_seat")}`} value={`${r.table_label ?? "—"} / ${r.seat_number ?? "—"}`} accent />
          </div>
          <VenueMap layout={normalizeLayout(r.event.layout)} highlight={{ table: r.table_label, seat: r.seat_number }} youLabel={t("result_you")} />
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value, wide, accent }: { icon: React.ReactNode; label: string; value: string; wide?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${wide ? "col-span-2" : ""} ${accent ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50"}`}>
      <div className={`flex items-center gap-1.5 text-xs ${accent ? "opacity-90" : "text-muted-foreground"}`}>{icon}{label}</div>
      <div className={`mt-1 font-bold ${accent ? "text-2xl font-display" : ""}`}>{value}</div>
    </div>
  );
}
