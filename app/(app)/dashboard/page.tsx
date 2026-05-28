import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PROGRAM_DAYS } from "@/lib/data/program";
import { DashboardClient } from "./DashboardClient";
import type { Journey, Entry, CheckIn } from "@/lib/types";
import Link from "next/link";

function SetupPrompt() {
  return (
    <div className="container-narrow section">
      <div
        className="card p-8"
        style={{ borderColor: "rgba(0, 200, 150, 0.2)", background: "rgba(0, 200, 150, 0.03)" }}
      >
        <p className="text-caption text-sage mb-2">Setup required</p>
        <h1 className="text-display-md text-ink mb-4">Connect Supabase</h1>
        <p className="text-body text-muted mb-6 max-w-md">
          To use the app, add your Supabase credentials to{" "}
          <code
            className="text-caption"
            style={{
              background: "rgba(255,255,255,0.06)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            .env.local
          </code>
          . See{" "}
          <code
            className="text-caption"
            style={{
              background: "rgba(255,255,255,0.06)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            .env.local.example
          </code>{" "}
          for the required variables, then run{" "}
          <code
            className="text-caption"
            style={{
              background: "rgba(255,255,255,0.06)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            supabase/schema.sql
          </code>{" "}
          in your Supabase SQL editor.
        </p>
        <Link href="/" className="btn-ghost text-sm">
          ← Back to landing
        </Link>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return <SetupPrompt />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userName =
    user.user_metadata?.full_name?.split(" ")[0] ?? "";

  const { data: journey } = await supabase
    .from("journeys")
    .select("*")
    .eq("user_id", user.id)
    .is("completed_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let checkIns: CheckIn[] = [];
  let todayEntries: Entry[] = [];

  if (journey) {
    const [checkInsResult, entriesResult] = await Promise.all([
      supabase
        .from("check_ins")
        .select("*")
        .eq("journey_id", journey.id),
      supabase
        .from("entries")
        .select("*")
        .eq("journey_id", journey.id)
        .eq("day_number", journey.current_day),
    ]);

    checkIns = checkInsResult.data ?? [];
    todayEntries = entriesResult.data ?? [];
  }

  return (
    <DashboardClient
      journey={journey as Journey | null}
      checkIns={checkIns}
      todayEntries={todayEntries}
      userName={userName}
      userId={user.id}
      programDays={PROGRAM_DAYS}
    />
  );
}
