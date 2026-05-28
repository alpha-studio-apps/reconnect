import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResultsClient } from "./ResultsClient";
import type { Entry, CheckIn } from "@/lib/types";
import Link from "next/link";

export default async function ResultsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="container-narrow section">
        <div className="card p-8" style={{ borderColor: "rgba(0, 200, 150, 0.2)" }}>
          <p className="text-caption text-sage mb-2">Setup required</p>
          <h1 className="text-display-md text-ink mb-4">Connect Supabase</h1>
          <p className="text-body text-muted mb-6">
            Results will appear here after completing your 14-day journey.
          </p>
          <Link href="/" className="btn-ghost text-sm">
            ← Back to landing
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: journey } = await supabase
    .from("journeys")
    .select("*")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let entries: Entry[] = [];
  let checkIns: CheckIn[] = [];

  if (journey) {
    const [entriesResult, checkInsResult] = await Promise.all([
      supabase
        .from("entries")
        .select("*")
        .eq("journey_id", journey.id)
        .order("day_number"),
      supabase
        .from("check_ins")
        .select("*")
        .eq("journey_id", journey.id),
    ]);

    entries = entriesResult.data ?? [];
    checkIns = checkInsResult.data ?? [];
  }

  return (
    <ResultsClient journey={journey} entries={entries} checkIns={checkIns} />
  );
}
