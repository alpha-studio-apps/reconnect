"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface DayCardProps {
  day: number;
  theme: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}

export function DayCard({ day, theme, isCompleted, isCurrent, isFuture }: DayCardProps) {
  const content = (
    <div
      className="relative flex flex-col gap-1 p-3 rounded-xl border transition-all duration-150"
      style={{
        borderColor: isCurrent
          ? "rgba(0, 200, 150, 0.4)"
          : isCompleted
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.04)",
        background: isCurrent
          ? "rgba(0, 200, 150, 0.05)"
          : isCompleted
          ? "rgba(255,255,255,0.02)"
          : "transparent",
        opacity: isFuture ? 0.35 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-caption" style={{ color: "#374151" }}>{day}</span>
        {isCompleted && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: "#00C896", fontSize: "10px", fontWeight: 700 }}
          >
            ✓
          </motion.span>
        )}
        {isCurrent && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#00C896" }}
          />
        )}
      </div>
      <p
        className="text-caption leading-tight"
        style={{ color: isFuture ? "#374151" : "#6B7280" }}
      >
        {theme}
      </p>
    </div>
  );

  if (isFuture) return content;

  return (
    <Link href={`/day/${day}`} className="block">
      <div className="hover:scale-[1.03] transition-transform duration-150">{content}</div>
    </Link>
  );
}
