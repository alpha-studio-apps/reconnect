"use client";

import { motion } from "framer-motion";

const MOODS = [
  { value: 1, label: "Muy bajo" },
  { value: 2, label: "Bajo" },
  { value: 3, label: "Regular" },
  { value: 4, label: "Bien" },
  { value: 5, label: "Muy bien" },
];

interface MoodPickerProps {
  value: number | null;
  onChange: (value: number) => void;
  labels?: string[];
}

export function MoodPicker({ value, onChange, labels }: MoodPickerProps) {
  return (
    <div className="flex gap-2">
      {MOODS.map((mood) => {
        const isSelected = value === mood.value;
        const label = labels?.[mood.value - 1] ?? mood.label;
        return (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            aria-label={label}
            title={label}
            className="flex flex-col items-center gap-1.5"
          >
            <motion.div
              animate={{
                scale: isSelected ? 1.15 : 1,
                opacity: value !== null && !isSelected ? 0.3 : 1,
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold"
              style={{
                borderColor: isSelected ? "#00C896" : "rgba(255,255,255,0.12)",
                background: isSelected ? "rgba(0,200,150,0.12)" : "transparent",
                color: isSelected ? "#00C896" : "#6B7280",
              }}
            >
              {mood.value}
            </motion.div>
            <span
              className="text-[10px] transition-colors duration-150"
              style={{ color: isSelected ? "#9CA3AF" : "transparent" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
