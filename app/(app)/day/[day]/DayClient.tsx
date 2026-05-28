"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { MoodPicker } from "@/components/MoodPicker";
import { useLocale, interpolate } from "@/lib/i18n/LocaleProvider";
import { createClient } from "@/lib/supabase/client";
import type { Entry, ProgramDay } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved";

interface DayClientProps {
  dayNum: number;
  journeyId: string;
  userId: string;
  programDay: ProgramDay;
  morningEntry: Entry | null;
  eveningEntry: Entry | null;
  isCheckedIn: boolean;
  currentJourneyDay: number;
}

export function DayClient({
  dayNum,
  journeyId,
  userId,
  programDay,
  morningEntry,
  eveningEntry,
  isCheckedIn: initialCheckedIn,
  currentJourneyDay,
}: DayClientProps) {
  const { t } = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [morningContent, setMorningContent] = useState(
    morningEntry?.content ?? ""
  );
  const [eveningContent, setEveningContent] = useState(
    eveningEntry?.content ?? ""
  );
  const [morningMood, setMorningMood] = useState<number | null>(
    morningEntry?.mood_score ?? null
  );
  const [eveningMood, setEveningMood] = useState<number | null>(
    eveningEntry?.mood_score ?? null
  );
  const [isCheckedIn, setIsCheckedIn] = useState(initialCheckedIn);
  const [morningSave, setMorningSave] = useState<SaveState>("idle");
  const [eveningSave, setEveningSave] = useState<SaveState>("saved");
  const [completing, setCompleting] = useState(false);

  const morningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eveningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveEntry = useCallback(
    async (
      type: "morning" | "evening",
      content: string,
      moodScore: number | null,
      existingEntry: Entry | null,
      setSave: (s: SaveState) => void
    ) => {
      setSave("saving");

      if (existingEntry) {
        await supabase
          .from("entries")
          .update({ content, mood_score: moodScore, updated_at: new Date().toISOString() })
          .eq("id", existingEntry.id);
      } else {
        await supabase.from("entries").insert({
          journey_id: journeyId,
          user_id: userId,
          day_number: dayNum,
          type,
          content,
          mood_score: moodScore,
        });
      }

      setSave("saved");
      setTimeout(() => setSave("idle"), 3000);
    },
    [supabase, journeyId, userId, dayNum]
  );

  function debounceSave(
    type: "morning" | "evening",
    content: string,
    mood: number | null,
    existing: Entry | null,
    setSave: (s: SaveState) => void,
    timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  ) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSave("saving");
    timerRef.current = setTimeout(() => {
      saveEntry(type, content, mood, existing, setSave);
    }, 1500);
  }

  function handleMorningChange(val: string) {
    setMorningContent(val);
    debounceSave(
      "morning",
      val,
      morningMood,
      morningEntry,
      setMorningSave,
      morningTimer
    );
  }

  function handleEveningChange(val: string) {
    setEveningContent(val);
    debounceSave(
      "evening",
      val,
      eveningMood,
      eveningEntry,
      setEveningSave,
      eveningTimer
    );
  }

  async function toggleCheckIn() {
    if (isCheckedIn) return;
    setIsCheckedIn(true);
    await supabase.from("check_ins").insert({
      journey_id: journeyId,
      user_id: userId,
      day_number: dayNum,
    });
  }

  async function completeDay() {
    setCompleting(true);

    // Save any unsaved content
    if (morningContent && !morningEntry) {
      await saveEntry(
        "morning",
        morningContent,
        morningMood,
        morningEntry,
        setMorningSave
      );
    }
    if (eveningContent && !eveningEntry) {
      await saveEntry(
        "evening",
        eveningContent,
        eveningMood,
        eveningEntry,
        setEveningSave
      );
    }

    if (!isCheckedIn) {
      await supabase.from("check_ins").insert({
        journey_id: journeyId,
        user_id: userId,
        day_number: dayNum,
      });
    }

    const nextDay = dayNum + 1;
    if (nextDay > 14) {
      await supabase
        .from("journeys")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", journeyId);
      router.push("/results");
    } else {
      await supabase
        .from("journeys")
        .update({ current_day: nextDay })
        .eq("id", journeyId);
      router.push("/dashboard");
    }

    router.refresh();
  }

  const isCurrentOrPast = dayNum <= currentJourneyDay;

  return (
    <div className="container-narrow section">
      {/* Nav */}
      <Reveal>
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/dashboard"
            className="text-caption text-dim hover:text-muted transition-colors duration-200"
          >
            {t.day.backToDashboard}
          </Link>
          <span className="text-caption text-dim">
            {interpolate(t.day.dayOf, { day: dayNum })}
          </span>
        </div>

        <div className="mb-10">
          <p className="text-caption mb-2" style={{ color: "#00C896" }}>{programDay.theme}</p>
          <h1 className="text-display-md text-ink">{programDay.subtitle}</h1>
        </div>
      </Reveal>

      {/* Morning reflection */}
      <Reveal delay={0.1}>
        <section className="mb-10">
          <h2 className="text-body text-muted mb-1">{t.day.morningTitle}</h2>
          <div className="divider mb-5" />
          <p className="text-body-lg text-ink mb-6 leading-relaxed">
            {programDay.morningPrompt}
          </p>

          <TextArea
            value={morningContent}
            onChange={(e) => handleMorningChange(e.target.value)}
            placeholder={t.day.placeholder}
            saveState={morningSave}
            disabled={!isCurrentOrPast}
            rows={7}
          />

          <div className="mt-5">
            <p className="text-caption text-dim mb-3">{t.day.moodLabel}</p>
            <MoodPicker
              value={morningMood}
              labels={t.day.moodValues}
              onChange={(v) => {
                setMorningMood(v);
                debounceSave(
                  "morning",
                  morningContent,
                  v,
                  morningEntry,
                  setMorningSave,
                  morningTimer
                );
              }}
            />
          </div>
        </section>
      </Reveal>

      {/* Evening reflection */}
      <Reveal delay={0.2}>
        <section className="mb-10">
          <h2 className="text-body text-muted mb-1">{t.day.eveningTitle}</h2>
          <div className="divider mb-5" />
          <p className="text-body-lg text-ink mb-6 leading-relaxed">
            {programDay.eveningPrompt}
          </p>

          <TextArea
            value={eveningContent}
            onChange={(e) => handleEveningChange(e.target.value)}
            placeholder={t.day.placeholder}
            saveState={eveningSave}
            disabled={!isCurrentOrPast}
            rows={7}
          />

          <div className="mt-5">
            <p className="text-caption text-dim mb-3">{t.day.moodLabel}</p>
            <MoodPicker
              value={eveningMood}
              labels={t.day.moodValues}
              onChange={(v) => {
                setEveningMood(v);
                debounceSave(
                  "evening",
                  eveningContent,
                  v,
                  eveningEntry,
                  setEveningSave,
                  eveningTimer
                );
              }}
            />
          </div>
        </section>
      </Reveal>

      {/* Daily practice */}
      <Reveal delay={0.3}>
        <section className="mb-12">
          <h2 className="text-body text-muted mb-1">{t.day.practiceTitle}</h2>
          <div className="divider mb-5" />

          <div className="card p-5 flex items-start gap-4">
            <button
              onClick={toggleCheckIn}
              disabled={!isCurrentOrPast}
              className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: isCheckedIn
                  ? "#00C896"
                  : "rgba(255,255,255,0.20)",
                background: isCheckedIn
                  ? "rgba(0,200,150,0.12)"
                  : "transparent",
              }}
              aria-label={
                isCheckedIn ? t.day.practiceChecked : t.day.practiceCheck
              }
            >
              <AnimatePresence>
                {isCheckedIn && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[10px] font-bold" style={{ color: "#00C896" }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div>
              <p className="text-body text-ink mb-1">
                {programDay.practiceLabel}
              </p>
              <p className="text-caption text-muted leading-relaxed">
                {programDay.practiceDescription}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Complete day */}
      {isCurrentOrPast && dayNum === currentJourneyDay && (
        <Reveal delay={0.4}>
          <div className="flex items-center gap-4">
            <Button
              onClick={completeDay}
              loading={completing}
              className="w-full sm:w-auto justify-center"
            >
              {dayNum === 14
                ? t.locale === "es"
                  ? "Completar el viaje →"
                  : "Complete the journey →"
                : interpolate(t.day.completeDayButton, { day: dayNum })}
            </Button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
