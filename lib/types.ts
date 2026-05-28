export type Locale = "en" | "es";

export interface Profile {
  id: string;
  full_name: string | null;
  locale: Locale;
  notify_reminders: boolean;
  created_at: string;
}

export interface Journey {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  current_day: number;
}

export interface Entry {
  id: string;
  journey_id: string;
  user_id: string;
  day_number: number;
  type: "morning" | "evening";
  content: string | null;
  mood_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  journey_id: string;
  user_id: string;
  day_number: number;
  completed_at: string;
}

export interface ProgramDay {
  day: number;
  theme: string;
  subtitle: string;
  morningPrompt: string;
  eveningPrompt: string;
  practiceLabel: string;
  practiceDescription: string;
}
