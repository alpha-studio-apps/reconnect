"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { DayCard } from "@/components/DayCard";
import { Button } from "@/components/ui/Button";
import { useLocale, interpolate } from "@/lib/i18n/LocaleProvider";
import { createClient } from "@/lib/supabase/client";
import type { Journey, Entry, CheckIn, ProgramDay } from "@/lib/types";

interface DashboardClientProps {
  journey: Journey | null;
  checkIns: CheckIn[];
  todayEntries: Entry[];
  userName: string;
  userId: string;
  programDays: ProgramDay[];
}

export function DashboardClient({
  journey,
  checkIns,
  todayEntries,
  userName,
  userId,
  programDays,
}: DashboardClientProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const completedDays = new Set(checkIns.map((c) => c.day_number));
  const currentDay = journey?.current_day ?? 1;
  const today = programDays[currentDay - 1];

  const hasMorning = todayEntries.some(
    (e) => e.type === "morning" && e.content
  );
  const hasEvening = todayEntries.some(
    (e) => e.type === "evening" && e.content
  );

  async function startJourney() {
    setStarting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("journeys")
      .insert({ user_id: userId, current_day: 1 })
      .select()
      .single();

    if (!error && data) {
      router.push(`/day/1`);
      router.refresh();
    }
    setStarting(false);
  }

  if (!journey) {
    return (
      <div className="container-narrow section">
        <Reveal>
          <p className="text-caption text-dim mb-3">
            {t.dashboard.welcomeBack} {userName}
          </p>
          <h1 className="text-display-md text-ink mb-5">
            {t.dashboard.startJourney}
          </h1>
          <p className="text-body text-muted mb-10 max-w-md">
            {t.dashboard.startJourneySub}
          </p>

          {/* Day themes preview */}
          <div className="overflow-x-auto -mx-4 px-4 mb-10">
            <div className="grid grid-cols-7 gap-2" style={{ minWidth: "380px" }}>
              {programDays.map((d, i) => (
                <div
                  key={d.day}
                  className="flex flex-col items-center gap-1 py-3"
                  style={{ opacity: 0.3 + i * 0.05 }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#3A3845" }}
                  />
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{ color: "#3A3845" }}
                  >
                    {t.themes[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={startJourney}
            loading={starting}
            className="w-full sm:w-auto justify-center"
          >
            {t.dashboard.startButton}
          </Button>
        </Reveal>
      </div>
    );
  }

  const progressPercent = Math.round(
    (completedDays.size / 14) * 100
  );

  return (
    <div className="container-narrow section">
      {/* Header */}
      <Reveal>
        <p className="text-caption text-dim mb-2">
          {t.dashboard.welcomeBack} {userName}
        </p>
        <h1 className="text-display-md text-ink mb-1">
          {interpolate(t.dashboard.dayOf, { day: currentDay })}
        </h1>
        <p className="text-body text-sage mb-8">{today.theme}</p>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-dim">
              {t.dashboard.progressLabel}
            </span>
            <span className="text-caption text-muted">
              {completedDays.size} / 14
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Reveal>

      {/* Today's card */}
      <Reveal delay={0.1}>
        <Link href={`/day/${currentDay}`} className="block">
          <div
            className="card card-hover p-6 mb-8 cursor-pointer"
            style={{
              borderColor: "rgba(0, 200, 150, 0.2)",
              background: "rgba(0, 200, 150, 0.03)",
            }}
          >
            <p className="text-caption text-dim mb-1">
              {t.dashboard.todayTheme}
            </p>
            <h2 className="text-display-md text-ink mb-1">{today.theme}</h2>
            <p className="text-caption text-muted mb-6">{today.subtitle}</p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-caption text-muted">
                  {t.dashboard.morningReflection}
                </span>
                <span
                  className="text-caption"
                  style={{ color: hasMorning ? "#00C896" : "#6B7280" }}
                >
                  {hasMorning ? t.dashboard.completed : t.dashboard.openPractice}
                </span>
              </div>
              <div
                className="divider"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <div className="flex items-center justify-between">
                <span className="text-caption text-muted">
                  {t.dashboard.eveningReflection}
                </span>
                <span
                  className="text-caption"
                  style={{ color: hasEvening ? "#00C896" : "#6B7280" }}
                >
                  {hasEvening
                    ? t.dashboard.completed
                    : t.dashboard.openPractice}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* 14-day grid */}
      <Reveal delay={0.2}>
        <p className="text-caption text-dim mb-4">
          {t.dashboard.overviewLabel}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {programDays.map((d) => (
            <DayCard
              key={d.day}
              day={d.day}
              theme={t.themes[d.day - 1]}
              isCompleted={completedDays.has(d.day)}
              isCurrent={d.day === currentDay}
              isFuture={d.day > currentDay}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
