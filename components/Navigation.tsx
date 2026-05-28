"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LocaleToggle } from "./LocaleToggle";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { createClient } from "@/lib/supabase/client";

interface NavigationProps {
  variant?: "landing" | "app";
  userName?: string;
}

export function Navigation({ variant = "landing", userName }: NavigationProps) {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(8,8,8,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        {/* Logo — bold, no serif — Alpha Track DNA */}
        <Link
          href={variant === "app" ? "/dashboard" : "/"}
          className="font-bold text-white text-sm tracking-tight hover:opacity-75 transition-opacity duration-150"
        >
          Reconnect
        </Link>

        <div className="flex items-center gap-5">
          {variant === "landing" && (
            <>
              <Link
                href="#que"
                className="text-caption font-medium"
                style={{ color: "#6B7280" }}
              >
                Qué es
              </Link>
              <Link
                href="#como"
                className="text-caption font-medium"
                style={{ color: "#6B7280" }}
              >
                {t.landing.ctaSecondary}
              </Link>
            </>
          )}

          {variant === "app" && (
            <>
              <Link
                href="/dashboard"
                className="text-caption font-medium transition-colors duration-150"
                style={{ color: pathname === "/dashboard" ? "#FFFFFF" : "#6B7280" }}
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/settings"
                className="text-caption font-medium transition-colors duration-150"
                style={{ color: pathname === "/settings" ? "#FFFFFF" : "#6B7280" }}
              >
                {t.nav.settings}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-caption font-medium transition-colors duration-150"
                style={{ color: "#6B7280" }}
              >
                {t.nav.signOut}
              </button>
            </>
          )}

          <LocaleToggle />

          {variant === "landing" && (
            <Link href="/signup">
              <button className="btn-primary text-sm py-2.5 px-5">
                {t.nav.begin}
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
