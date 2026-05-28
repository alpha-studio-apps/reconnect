"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { PROGRAM_DAYS } from "@/lib/data/program";
import type { Journey, Entry, CheckIn } from "@/lib/types";

const PdfDownloadButton = dynamic(
  () => import("./PdfDownloadButton").then((m) => m.PdfDownloadButton),
  { ssr: false }
);

interface ResultsClientProps {
  journey: Journey | null;
  entries: Entry[];
  checkIns: CheckIn[];
}

export function ResultsClient({ journey, entries, checkIns }: ResultsClientProps) {
  const { t } = useLocale();

  if (!journey) {
    return (
      <div className="container-narrow section text-center">
        <Reveal>
          <p className="text-display-md text-ink mb-4">{t.results.emptyState}</p>
          <p className="text-body text-muted mb-8">{t.results.emptyStateSub}</p>
          <Link href="/dashboard">
            <button className="btn-primary">{t.nav.dashboard}</button>
          </Link>
        </Reveal>
      </div>
    );
  }

  const completedDays = checkIns.length;

  const totalWords = entries.reduce(
    (sum, e) => sum + (e.content?.split(/\s+/).filter(Boolean).length ?? 0),
    0
  );

  const moods = entries.filter((e) => e.mood_score != null);
  const avgMood =
    moods.length > 0
      ? (moods.reduce((s, e) => s + (e.mood_score ?? 0), 0) / moods.length).toFixed(1)
      : "—";

  // Per-day mood data (average of morning + evening)
  const moodByDay: { day: number; mood: number | null }[] = Array.from(
    { length: 14 },
    (_, i) => {
      const dayEntries = entries.filter((e) => e.day_number === i + 1 && e.mood_score);
      const avg =
        dayEntries.length > 0
          ? dayEntries.reduce((s, e) => s + (e.mood_score ?? 0), 0) /
            dayEntries.length
          : null;
      return { day: i + 1, mood: avg ? Math.round(avg * 10) / 10 : null };
    }
  );

  const wordsByDay = Array.from({ length: 14 }, (_, i) => {
    const dayEntries = entries.filter((e) => e.day_number === i + 1);
    const words = dayEntries.reduce(
      (s, e) => s + (e.content?.split(/\s+/).filter(Boolean).length ?? 0),
      0
    );
    return { day: i + 1, words };
  });

  const tooltipStyle = {
    background: "#13131A",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.75rem",
    color: "#F4F2EE",
    fontSize: "0.8125rem",
    boxShadow: "0 8px 30px -10px rgba(0,0,0,0.5)",
  };

  return (
    <div className="container-narrow section">
      <Reveal>
        <p className="text-caption text-sage mb-3">{t.results.subtitle}</p>
        <h1 className="text-display-md text-ink mb-12">{t.results.title}</h1>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.1}>
        <section className="mb-12">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.results.statsTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t.results.daysCompleted, value: completedDays },
              { label: t.results.totalEntries, value: entries.length },
              { label: t.results.totalWords, value: totalWords.toLocaleString() },
              { label: t.results.avgMood, value: avgMood + " / 5" },
            ].map((stat) => (
              <div key={stat.label} className="card p-5">
                <p
                  className="text-display-md text-ink mb-1"
                  style={{ fontSize: "1.75rem" }}
                >
                  {stat.value}
                </p>
                <p className="text-caption text-dim">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Mood chart */}
      <Reveal delay={0.15}>
        <section className="mb-12">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.results.moodChartTitle}
          </h2>
          <div className="card p-6" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodByDay}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6B6878", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: t.results.dayLabel,
                    position: "insideBottom",
                    offset: -2,
                    fill: "#3A3845",
                    fontSize: 10,
                  }}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fill: "#6B6878", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: "rgba(255,255,255,0.06)" }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#00C896"
                  strokeWidth={2}
                  dot={{ fill: "#00C896", r: 3, strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </Reveal>

      {/* Word count chart */}
      <Reveal delay={0.2}>
        <section className="mb-12">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.results.wordChartTitle}
          </h2>
          <div className="card p-6" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wordsByDay}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6B6878", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B6878", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="words" fill="rgba(0, 200, 150, 0.35)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </Reveal>

      {/* Entries */}
      <Reveal delay={0.25}>
        <section className="mb-12">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.results.entriesTitle}
          </h2>
          <div className="flex flex-col gap-4">
            {PROGRAM_DAYS.map((pd) => {
              const morning = entries.find(
                (e) => e.day_number === pd.day && e.type === "morning"
              );
              const evening = entries.find(
                (e) => e.day_number === pd.day && e.type === "evening"
              );
              if (!morning?.content && !evening?.content) return null;

              return (
                <div key={pd.day} className="card p-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-caption text-dim">
                      {t.results.dayLabel} {pd.day}
                    </span>
                    <span className="text-body text-sage font-medium">
                      {pd.theme}
                    </span>
                  </div>
                  {morning?.content && (
                    <div className="mb-4">
                      <p className="text-caption text-dim mb-2">
                        {t.results.morningLabel}
                      </p>
                      <p className="text-body text-muted leading-relaxed">
                        {morning.content}
                      </p>
                    </div>
                  )}
                  {morning?.content && evening?.content && (
                    <div className="divider my-4" />
                  )}
                  {evening?.content && (
                    <div>
                      <p className="text-caption text-dim mb-2">
                        {t.results.eveningLabel}
                      </p>
                      <p className="text-body text-muted leading-relaxed">
                        {evening.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Actions */}
      <Reveal delay={0.3}>
        <div className="flex flex-wrap gap-3">
          <PdfDownloadButton entries={entries} journey={journey} />
          <Link href="/settings">
            <button className="btn-ghost">{t.results.newJourney}</button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
