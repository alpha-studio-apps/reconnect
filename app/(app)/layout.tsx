import { Navigation } from "@/components/Navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName: string | undefined;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userName = user?.user_metadata?.full_name?.split(" ")[0] ?? undefined;
    } catch {
      // auth unavailable
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navigation variant="app" userName={userName} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
