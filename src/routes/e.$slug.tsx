import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { normalizeLayout } from "@/lib/layout";
import { GuestLookup } from "@/components/GuestLookup";
import { VenueMap } from "@/components/VenueMap";

export const Route = createFileRoute("/e/$slug")({
  head: () => ({
    meta: [
      { title: "Find your seat — Birlyk" },
      { name: "description", content: "Search your name or phone to see your table and seat on the venue map." },
      { property: "og:title", content: "Find your seat — Birlyk" },
      { property: "og:description", content: "Search your name or phone to see your table and seat on the venue map." },
    ],
  }),
  component: PublicEvent,
});

type Ev = { title: string; event_date: string | null; event_time: string | null; venue_name: string | null; venue_address: string | null; layout: unknown };

function PublicEvent() {
  const { slug } = Route.useParams();
  const { t, formatDate } = useI18n();
  const [ev, setEv] = useState<Ev | null | undefined>(undefined);

  useEffect(() => {
    supabase.rpc("get_public_event", { _slug: slug }).then(({ data }) => setEv((data as unknown as Ev) ?? null));
  }, [slug]);

  if (ev === undefined) return <main className="p-10 text-center text-muted-foreground">…</main>;
  if (ev === null) return <main className="p-10 text-center text-muted-foreground">{t("not_found")}</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">{t("public_event")}</p>
        <h1 className="text-3xl md:text-4xl font-extrabold">{ev.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {formatDate(ev.event_date)} {ev.event_time ? `· ${ev.event_time}` : ""} {ev.venue_name ? `· ${ev.venue_name}` : ""} {ev.venue_address ? `, ${ev.venue_address}` : ""}
        </p>
      </div>
      <GuestLookup slug={slug} />
      <VenueMap layout={normalizeLayout(ev.layout)} />
    </main>
  );
}
