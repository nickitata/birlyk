import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Birlyk" },
      { name: "description", content: "Sign in or create a Birlyk organizer account to manage events and seating." },
      { property: "og:title", content: "Sign in — Birlyk" },
      { property: "og:description", content: "Sign in or create a Birlyk organizer account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/dashboard" }); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { if (s) navigate({ to: "/dashboard" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name.trim(), organization: org.trim() } },
      });
      if (error) toast.error(error.message);
      else if (!data.session) { toast.success(t("auth_check_email")); setMode("in"); }
    }
    setBusy(false);
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error(t("error_generic"));
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="text-2xl font-bold">{mode === "in" ? t("auth_signin_t") : t("auth_signup_t")}</h1>
        <Button variant="outline" className="mt-6 w-full h-11 rounded-xl" onClick={google}>{t("auth_google")}</Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />{t("auth_or")}<div className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "up" && (
            <>
              <div><Label>{t("auth_name")}</Label><Input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
              <div><Label>{t("auth_org")}</Label><Input maxLength={100} value={org} onChange={(e) => setOrg(e.target.value)} className="mt-1.5" /></div>
            </>
          )}
          <div><Label>{t("auth_email")}</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label>{t("auth_password")}</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" className="w-full h-11 rounded-xl" disabled={busy}>{mode === "in" ? t("auth_signin_btn") : t("auth_signup_btn")}</Button>
        </form>
        <button className="mt-5 w-full text-sm text-primary hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? t("auth_to_signup") : t("auth_to_signin")}
        </button>
      </div>
    </main>
  );
}
