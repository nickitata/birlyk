import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
  const { data } = await supabase.auth.getUser();
  const mockUser = {
    id: "00000000-0000-0000-0000-000000000001",
    email: "demo@birlyk.app",
    user_metadata: { full_name: "Тестовый Организатор" }
  };
  return { user: data.user || mockUser };
},
  component: () => <Outlet />,
});
