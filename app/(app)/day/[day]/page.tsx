import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PROGRAM_DAYS } from "@/lib/data/program";
import { DayClient } from "./DayClient";
import Link from "next/link";

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = await params;
  const dayNum = parseInt(dayParam, 10);

  if (isNaN(dayNum) || dayNum < 1 || dayNum > 14) notFound();

  if (!isSupabaseConfigured()) {
    return (
      <div className="container-narrow section">
        <p className="text-caption text-dim mb-6">
          <Link href="/dashboard" className="hover:text-muted transition-colors">
            ← Inicio
          </Link>
        </p>
        <div className="card p-8">
          <p className="text-caption mb-2" style={{ color: "#00C896" }}>Día {dayNum}</p>
          <h1 className="text-display-md text-ink mb-4">
            {PROGRAM_DAYS[dayNum - 1].theme}
          </h1>
          <p className="text-body text-muted">
            Conecta Supabase para guardar tus reflexiones.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const programDay = PROGRAM_DAYS[dayNum - 1];
  if (!programDay) notFound();

  const { data: journey } = await supabase
    .from("journeys")
    .select("*")
    .eq("user_id", user.id)
    .is("completed_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!journey) redirect("/dashboard");

  const [entriesResult, checkInResult] = await Promise.all([
    supabase
      .from("entries")
      .select("*")
      .eq("journey_id", journey.id)
      .eq("day_number", dayNum),
    supabase
      .from("check_ins")
      .select("id")
      .eq("journey_id", journey.id)
      .eq("day_number", dayNum)
      .maybeSingle(),
  ]);

  const entries = entriesResult.data ?? [];
  const isCheckedIn = !!checkInResult.data;
  const morningEntry = entries.find((e) => e.type === "morning") ?? null;
  const eveningEntry = entries.find((e) => e.type === "evening") ?? null;

  return (
    <DayClient
      dayNum={dayNum}
      journeyId={journey.id}
      userId={user.id}
      programDay={programDay}
      morningEntry={morningEntry}
      eveningEntry={eveningEntry}
      isCheckedIn={isCheckedIn}
      currentJourneyDay={journey.current_day}
    />
  );
}
