"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/types";

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reminders, setReminders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");
      setName(user.user_metadata?.full_name ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("notify_reminders")
        .eq("id", user.id)
        .single();

      if (profile) setReminders(profile.notify_reminders ?? true);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await Promise.all([
      supabase.auth.updateUser({ data: { full_name: name } }),
      supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: name,
          locale,
          notify_reminders: reminders,
        }),
    ]);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function startNewJourney() {
    const confirmed = window.confirm(t.settings.newJourneyWarning);
    if (!confirmed) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Complete any active journey
    await supabase
      .from("journeys")
      .update({ completed_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("completed_at", null);

    // Create new one
    await supabase
      .from("journeys")
      .insert({ user_id: user.id, current_day: 1 });

    router.push("/day/1");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="container-narrow section">
        <div className="text-caption text-dim">Loading…</div>
      </div>
    );
  }

  return (
    <div className="container-narrow section">
      <Reveal>
        <h1 className="text-display-md text-ink mb-10">{t.settings.title}</h1>
      </Reveal>

      {/* Profile */}
      <Reveal delay={0.05}>
        <section className="mb-10">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.settings.profileSection}
          </h2>
          <div className="card p-6 flex flex-col gap-5">
            <Input
              label={t.settings.nameLabel}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              label={t.settings.emailLabel}
              value={email}
              disabled
              type="email"
              className="opacity-50"
            />
          </div>
        </section>
      </Reveal>

      {/* Language */}
      <Reveal delay={0.1}>
        <section className="mb-10">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.settings.languageSection}
          </h2>
          <div className="card p-6">
            <p className="text-caption text-muted mb-4">
              {t.settings.languageLabel}
            </p>
            <div className="flex gap-3">
              {(["en", "es"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className="px-5 py-2 rounded-full text-caption font-medium transition-all duration-200 border"
                  style={{
                    background:
                      locale === l
                        ? "rgba(0, 200, 150, 0.10)"
                        : "transparent",
                    borderColor:
                      locale === l
                        ? "rgba(0, 200, 150, 0.4)"
                        : "rgba(255,255,255,0.08)",
                    color: locale === l ? "#00C896" : "#6B7280",
                  }}
                >
                  {l === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Reminders */}
      <Reveal delay={0.15}>
        <section className="mb-10">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.settings.notificationsSection}
          </h2>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-ink mb-1">
                  {t.settings.notificationsLabel}
                </p>
                <p className="text-caption text-muted">
                  {t.settings.notificationsDesc}
                </p>
              </div>
              <button
                onClick={() => setReminders(!reminders)}
                className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
                style={{
                  background: reminders
                    ? "rgba(0, 200, 150, 0.5)"
                    : "rgba(255,255,255,0.10)",
                }}
                role="switch"
                aria-checked={reminders}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink transition-transform duration-300"
                  style={{
                    transform: reminders ? "translateX(20px)" : "translateX(0)",
                  }}
                />
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Practice */}
      <Reveal delay={0.2}>
        <section className="mb-10">
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.settings.journeySection}
          </h2>
          <div className="card p-6">
            <p className="text-caption text-muted mb-4">
              {t.settings.newJourneyWarning}
            </p>
            <Button variant="ghost" onClick={startNewJourney}>
              {t.settings.newJourneyButton}
            </Button>
          </div>
        </section>
      </Reveal>

      {/* Save */}
      <Reveal delay={0.25}>
        <div className="flex items-center gap-4 mb-14">
          <Button onClick={handleSave} loading={saving}>
            {saved ? t.settings.saved : t.settings.saveButton}
          </Button>
        </div>
      </Reveal>

      {/* Account */}
      <Reveal delay={0.3}>
        <section>
          <h2 className="text-caption text-dim uppercase tracking-widest mb-5">
            {t.settings.accountSection}
          </h2>
          <div className="card p-6 flex flex-col gap-4">
            <Button variant="ghost" onClick={handleSignOut}>
              {t.settings.signOutButton}
            </Button>
            <button
              onClick={() =>
                window.confirm(t.settings.deleteWarning) &&
                console.warn("Delete account — implement with caution")
              }
              className="text-caption text-ghost hover:text-red-400 transition-colors duration-200 text-left"
            >
              {t.settings.deleteAccountButton}
            </button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
