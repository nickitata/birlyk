import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Upload, Loader2, Plus, Trash2, Copy, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveGuestToPostgres } from "@/lib/backend-api";
import { useI18n } from "@/lib/i18n";
import { emptyLayout, newId, normalizeLayout, type VenueLayout } from "@/lib/layout";
import { analyzeVenue } from "@/lib/venue.functions";
import { VenueMap } from "@/components/VenueMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/events/$id")({
  head: () => ({ meta: [{ title: "Manage event — Birlyk" }, { name: "description", content: "Edit event details, guests and the venue map." }] }),
  component: EventManager,
});

type Guest = { id: string; full_name: string; phone: string | null; table_label: string | null; seat_number: number | null };

function resizeImage(file: File, max = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.85));
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
    },
  });
  const guests = useQuery({
    queryKey: ["guests", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("guests").select("id, full_name, phone, table_label, seat_number").eq("event_id", id).order("created_at");
      if (error) throw error;
      return data as Guest[];
    },
  });

  const [form, setForm] = useState({ title: "", event_date: "", event_time: "", venue_name: "", venue_address: "" });
  const [layout, setLayout] = useState<VenueLayout>(emptyLayout());
  const [selTable, setSelTable] = useState<string | null>(null);
  const [assignGuest, setAssignGuest] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ev.data) return;
    setForm({
      title: ev.data.title ?? "", event_date: ev.data.event_date ?? "", event_time: ev.data.event_time ?? "",
      venue_name: ev.data.venue_name ?? "", venue_address: ev.data.venue_address ?? "",
    });
    setLayout(normalizeLayout(ev.data.layout));
  }, [ev.data]);

  const occupied = useMemo(() => new Set((guests.data ?? []).filter((g) => g.table_label && g.seat_number).map((g) => `${g.table_label}#${g.seat_number}`)), [guests.data]);

  if (ev.isLoading) return <main className="p-10 text-center text-muted-foreground">…</main>;
  if (!ev.data) return <main className="p-10 text-center">{t("not_found")}</main>;

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/e/${ev.data.slug}` : `/e/${ev.data.slug}`;

  async function update(patch: any, msg = t("ev_saved")) {
    const { error } = await supabase.from("events").update(patch).eq("id", id);
    if (error) { toast.error(t("error_generic")); return; }
    toast.success(msg);
    qc.invalidateQueries({ queryKey: ["event", id] });
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  async function onPhoto(file?: File) {
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      setPhoto(dataUrl);
      setAnalyzing(true);
      const res = await analyzeVenue({ data: { image: dataUrl } });
      setAnalyzing(false);
      if (!res.ok) { toast.error(res.error); return; }
      setLayout({ width: 1000, height: 700, tables: res.tables, features: res.features });
      toast.success(`${t("venue_done")} · ${res.tables.length}`);
    } catch {
      setAnalyzing(false);
      toast.error(t("error_generic"));
    }
  }

  function addTable(shape: "round" | "rect") {
    const n = layout.tables.length + 1;
    const tb = { id: newId(), label: String(n), shape, x: 440, y: 300, w: shape === "round" ? 110 : 180, h: shape === "round" ? 110 : 70, seats: shape === "round" ? 8 : 8 };
    setLayout({ ...layout, tables: [...layout.tables, tb] });
    setSelTable(tb.id);
  }
  const sel = layout.tables.find((x) => x.id === selTable);
  const patchSel = (p: Partial<NonNullable<typeof sel>>) => setLayout({ ...layout, tables: layout.tables.map((x) => (x.id === selTable ? { ...x, ...p } : x)) });

  async function addGuest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim().slice(0, 100);
    if (!name) return;
    const seat = parseInt(String(fd.get("seat") ?? ""), 10);
    const guest = {
      id: crypto.randomUUID(),
      event_id: id, owner_id: user.id, full_name: name,
      phone: String(fd.get("phone") ?? "").trim().slice(0, 30) || null,
      table_label: String(fd.get("table") ?? "").trim().slice(0, 8) || null,
      seat_number: Number.isFinite(seat) ? seat : null,
    };
    const { error } = await supabase.from("guests").insert(guest);
    if (error) { toast.error(t("error_generic")); return; }
    try {
      await saveGuestToPostgres({
        id: guest.id,
        eventId: guest.event_id,
        ownerId: guest.owner_id,
        fullName: guest.full_name,
        phone: guest.phone,
        tableLabel: guest.table_label,
        seatNumber: guest.seat_number,
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
  async function patchGuest(gid: string, p: Partial<Guest>) {
    const { error } = await supabase.from("guests").update(p).eq("id", gid);
    if (error) { toast.error(t("error_generic")); return; }
    qc.invalidateQueries({ queryKey: ["guests", id] });
  }
  async function delGuest(gid: string) {
    await supabase.from("guests").delete().eq("id", gid);
    qc.invalidateQueries({ queryKey: ["guests", id] });
  }

  const assigning = guests.data?.find((g) => g.id === assignGuest);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t("ev_back")}</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold">{ev.data.title}</h1>
        <Button className="ml-auto rounded-full" variant={ev.data.is_published ? "outline" : "default"}
          onClick={() => update({ is_published: !ev.data!.is_published, layout }, ev.data!.is_published ? t("ev_unpublish") : t("ev_publish"))}>
          {ev.data.is_published ? t("ev_unpublish") : t("ev_publish")}
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm">
        <span className="text-muted-foreground">{t("ev_public_link")}:</span>
        <a href={publicUrl} target="_blank" rel="noreferrer" className="font-semibold text-primary break-all">{publicUrl}</a>
        <Button size="sm" variant="ghost" className="ml-auto" onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success(t("ev_copied")); }}><Copy className="h-4 w-4" />{t("ev_copy")}</Button>
      </div>

      <Tabs defaultValue="venue" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">{t("tab_details")}</TabsTrigger>
          <TabsTrigger value="venue">{t("tab_venue")}</TabsTrigger>
          <TabsTrigger value="guests">{t("tab_guests")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); update({ ...form, title: form.title.trim() || ev.data!.title, event_date: form.event_date || null }); }}>
            {([["title", "ev_title", "text"], ["event_date", "ev_date", "date"], ["event_time", "ev_time", "time"], ["venue_name", "ev_venue", "text"], ["venue_address", "ev_address", "text"]] as const).map(([k, lab, type]) => (
              <div key={k} className={k === "venue_address" ? "md:col-span-2" : ""}>
                <Label>{t(lab)}</Label>
                <Input type={type} maxLength={160} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5" />
              </div>
            ))}
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit">{t("ev_save")}</Button>
              <Button type="button" variant="ghost" className="ml-auto text-destructive" onClick={async () => { if (!confirm(t("ev_delete") + "?")) return; await supabase.from("events").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["events"] }); navigate({ to: "/dashboard" }); }}>
                <Trash2 className="h-4 w-4" />{t("ev_delete")}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="venue" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input ref={uploadRef} type="file" accept="image/*" hidden onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
            <Button onClick={() => uploadRef.current?.click()} disabled={analyzing}><Upload className="h-4 w-4" />{t("venue_upload")}</Button>
            <Button variant="outline" size="icon" onClick={() => cameraRef.current?.click()} disabled={analyzing} aria-label="Camera"><Camera className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={() => addTable("round")}><Plus className="h-4 w-4" />{t("venue_add_round")}</Button>
            <Button variant="outline" onClick={() => addTable("rect")}><Plus className="h-4 w-4" />{t("venue_add_rect")}</Button>
            <Button variant="secondary" className="ml-auto" onClick={() => update({ layout })}>{t("venue_save")}</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="space-y-3">
              {analyzing && (
                <div className="flex items-center gap-3 rounded-xl border bg-accent/40 p-3 text-sm font-semibold"><Loader2 className="h-4 w-4 animate-spin" />{t("venue_analyzing")}</div>
              )}
              {assigning && (
                <div className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                  <MapPin className="h-4 w-4" />{t("venue_assigning")} <b>{assigning.full_name}</b>
                  <button className="ml-auto underline" onClick={() => setAssignGuest(null)}>×</button>
                </div>
              )}
              {layout.tables.length === 0 && !analyzing && <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{t("venue_empty")}</p>}
              <VenueMap layout={layout} editable onChange={setLayout} selectedTableId={selTable} onSelectTable={setSelTable} occupied={occupied}
                onSeatClick={assignGuest ? (label, seat) => { patchGuest(assignGuest, { table_label: label, seat_number: seat }); setAssignGuest(null); } : undefined} />
              <p className="text-xs text-muted-foreground">{t("venue_hint")}</p>
            </div>

            <aside className="space-y-4">
              {photo && <img src={photo} alt="Venue" className="w-full rounded-xl border" />}
              {sel && (
                <div className="space-y-3 rounded-xl border bg-card p-4">
                  <div><Label>{t("venue_label")}</Label><Input value={sel.label} maxLength={8} onChange={(e) => patchSel({ label: e.target.value })} className="mt-1" /></div>
                  <div><Label>{t("venue_seats")}</Label><Input type="number" min={1} max={20} value={sel.seats} onChange={(e) => patchSel({ seats: Math.max(1, Math.min(20, +e.target.value || 1)) })} className="mt-1" /></div>
                  <Button variant="ghost" className="w-full text-destructive" onClick={() => { setLayout({ ...layout, tables: layout.tables.filter((x) => x.id !== selTable) }); setSelTable(null); }}>
                    <Trash2 className="h-4 w-4" />{t("venue_remove")}
                  </Button>
                </div>
              )}
              <div className="rounded-xl border bg-card p-3">
                <p className="mb-2 text-sm font-bold">{t("tab_guests")}</p>
                <div className="max-h-80 space-y-1 overflow-auto">
                  {guests.data?.map((g) => (
                    <button key={g.id} onClick={() => setAssignGuest(g.id === assignGuest ? null : g.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm ${g.id === assignGuest ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                      <span className="truncate">{g.full_name}</span>
                      <span className="text-xs opacity-75">{g.table_label ? `${g.table_label}/${g.seat_number ?? "–"}` : "—"}</span>
                    </button>
                  ))}
                  {guests.data?.length === 0 && <p className="text-xs text-muted-foreground">{t("guests_none")}</p>}
                </div>
              </div>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="guests" className="space-y-4">
          <form onSubmit={addGuest} className="grid gap-2 rounded-2xl border bg-card p-4 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]">
            <Input name="name" placeholder={t("guests_name")} required maxLength={100} />
            <Input name="phone" placeholder={t("guests_phone")} maxLength={30} />
            <Input name="table" placeholder={t("guests_table")} maxLength={8} />
            <Input name="seat" type="number" min={1} max={20} placeholder={t("guests_seat")} />
            <Button type="submit"><Plus className="h-4 w-4" />{t("guests_add")}</Button>
          </form>
          <div className="overflow-hidden rounded-2xl border bg-card">
            {guests.data?.length === 0 && <p className="p-4 text-muted-foreground">{t("guests_none")}</p>}
            {guests.data?.map((g) => (
              <div key={g.id} className="grid items-center gap-2 border-b p-3 last:border-0 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]">
                <span className="font-semibold">{g.full_name}</span>
                <span className="text-sm text-muted-foreground">{g.phone || "—"}</span>
                <Input defaultValue={g.table_label ?? ""} maxLength={8} placeholder={t("guests_table")} onBlur={(e) => e.target.value !== (g.table_label ?? "") && patchGuest(g.id, { table_label: e.target.value.trim() || null })} />
                <Input defaultValue={g.seat_number ?? ""} type="number" min={1} max={20} placeholder={t("guests_seat")} onBlur={(e) => { const v = parseInt(e.target.value, 10); patchGuest(g.id, { seat_number: Number.isFinite(v) ? v : null }); }} />
                <Button size="icon" variant="ghost" onClick={() => delGuest(g.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
