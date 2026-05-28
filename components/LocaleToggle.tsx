"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="text-caption font-semibold tracking-widest uppercase transition-colors duration-150"
      style={{ color: "#374151" }}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
