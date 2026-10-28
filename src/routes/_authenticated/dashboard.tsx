import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveEventToPostgres } from "@/lib/backend-api";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Birlyk" }, { name: "description", content: "Manage your events, guests and venue maps." }] }),
  component: Dashboard,
});

function slugify(s: string) {
  return (s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 40) || "event") + "-" + Math.random().toString(36).slice(2, 7);
}

function Dashboard() {
  const { t, formatDate } = useI18n();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data,
  });
  const events = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*, guests(count)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const event = {
      id: crypto.randomUUID(),
      title: title.trim().slice(0, 120),
      slug: slugify(title),
      owner_id: user.id,
    };
    const { data, error } = await supabase.from("events").insert(event).select("id").single();
    if (error) { toast.error(t("error_generic")); return; }
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
    navigate({ to: "/events/$id", params: { id: data.id } });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-muted-foreground">{t("dash_hello")}, {profile.data?.full_name || user.email}{profile.data?.organization ? ` · ${profile.data.organization}` : ""}</p>
      <h1 className="text-3xl font-extrabold">{t("dash_title")}</h1>

      <form onSubmit={create} className="mt-6 flex gap-2 max-w-xl">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("ev_title")} className="h-11 rounded-xl" maxLength={120} />
        <Button type="submit" className="h-11 rounded-xl"><Plus className="h-4 w-4" />{t("dash_new")}</Button>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.data?.length === 0 && <p className="text-muted-foreground">{t("dash_empty")}</p>}
        {events.data?.map((ev) => (
          <Link key={ev.id} to="/events/$id" params={{ id: ev.id }} className="rounded-2xl border bg-card p-5 transition hover:shadow-soft">
            <div className="flex items-center justify-between">
              <Badge variant={ev.is_published ? "default" : "secondary"}>{ev.is_published ? t("dash_published") : t("dash_draft")}</Badge>
              <span className="text-sm text-muted-foreground">{(ev.guests as unknown as { count: number }[])?.[0]?.count ?? 0} {t("dash_guests")}</span>
            </div>
            <h3 className="mt-3 text-lg font-bold">{ev.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatDate(ev.event_date)}</p>
            <p className="mt-4 text-sm font-semibold text-primary">{t("dash_open")} →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
