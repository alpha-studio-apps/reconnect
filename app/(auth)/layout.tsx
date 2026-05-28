import { LocaleToggle } from "@/components/LocaleToggle";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-bold text-white text-sm tracking-tight hover:opacity-75 transition-opacity duration-150"
        >
          Reconnect
        </Link>
        <LocaleToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
