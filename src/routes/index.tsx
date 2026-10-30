import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Move, Link2 } from "lucide-react";
import hero from "@/assets/hero-hall.jpg";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GuestLookup } from "@/components/GuestLookup";
import { SmartPlanner } from '../components/SmartPlanner';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Birlyk — Find your seat, plan your hall" },
      { name: "description", content: "Organizers turn a venue photo into an AI seating map. Guests search their name and see their exact seat." },
      { property: "og:title", content: "Birlyk — Find your seat, plan your hall" },
      { property: "og:description", content: "Organizers turn a venue photo into an AI seating map. Guests search their name and see their exact seat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const navigate = useNavigate();

  async function createEvent() {
    const { data } = await supabase.auth.getSession();
    navigate({ to: data.session ? "/dashboard" : "/auth" });
  }

  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36 text-primary-foreground">
          <p className="inline-block rounded-full bg-background/15 px-3 py-1 text-sm font-semibold backdrop-blur">{t("hero_kicker")}</p>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl font-extrabold leading-tight">{t("hero_title")}</h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">{t("hero_sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full" onClick={createEvent}>{t("cta_create")}</Button>
            <Button size="lg" variant="secondary" className="rounded-full" asChild>
              <a href="#lookup">{t("cta_try")}</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="lookup" className="mx-auto max-w-4xl px-4 -mt-12 relative scroll-mt-24">
        <GuestLookup showDemoHint />
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <SmartPlanner />
        <AnalyticsDashboard />
      </div>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-20 md:grid-cols-3">
        {[
          { i: <Camera className="h-6 w-6" />, t: t("feat1_t"), d: t("feat1_d") },
          { i: <Move className="h-6 w-6" />, t: t("feat2_t"), d: t("feat2_d") },
          { i: <Link2 className="h-6 w-6" />, t: t("feat3_t"), d: t("feat3_d") },
        ].map((f) => (
          <div key={f.t} className="rounded-2xl border bg-card p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">{f.i}</div>
            <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
            <p className="mt-1 text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
