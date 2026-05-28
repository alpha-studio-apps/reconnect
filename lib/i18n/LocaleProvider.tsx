"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale } from "@/lib/types";
import { en } from "./en";
import { es } from "./es";
import type { Translations } from "./en";

const COOKIE_NAME = "reconnect.locale";

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "es",
  t: es,
  setLocale: () => {},
});

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  // Default to "es" if no cookie set
  const val = match ? decodeURIComponent(match[1]) : "es";
  return val === "en" ? "en" : "es";
}

function writeLocaleCookie(locale: Locale) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const detected = readLocaleCookie();
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeLocaleCookie(next);
    document.documentElement.lang = next;
  }, []);

  const t = locale === "en" ? en : es;

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

/** Interpolate {key} placeholders in a translation string */
export function interpolate(
  str: string,
  vars: Record<string, string | number>
): string {
  return str.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}
