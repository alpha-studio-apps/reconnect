"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Entry, Journey } from "@/lib/types";
import { PROGRAM_DAYS } from "@/lib/data/program";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    backgroundColor: "#FAFAF8",
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 40,
  },
  daySection: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 14,
  },
  dayNum: {
    fontSize: 10,
    color: "#999",
  },
  dayTheme: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  entryLabel: {
    fontSize: 9,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  entryText: {
    fontSize: 11,
    lineHeight: 1.7,
    color: "#333",
    marginBottom: 14,
  },
});

function JourneyDocument({
  entries,
  journey,
}: {
  entries: Entry[];
  journey: Journey;
}) {
  const started = new Date(journey.started_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title="Reconnect — My 14-Day Journey">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reconnect</Text>
        <Text style={styles.subtitle}>My 14-day journey · {started}</Text>

        {PROGRAM_DAYS.map((pd) => {
          const morning = entries.find(
            (e) => e.day_number === pd.day && e.type === "morning"
          );
          const evening = entries.find(
            (e) => e.day_number === pd.day && e.type === "evening"
          );
          if (!morning?.content && !evening?.content) return null;

          return (
            <View key={pd.day} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayNum}>Day {pd.day}</Text>
                <Text style={styles.dayTheme}>{pd.theme}</Text>
              </View>
              {morning?.content && (
                <View>
                  <Text style={styles.entryLabel}>Morning</Text>
                  <Text style={styles.entryText}>{morning.content}</Text>
                </View>
              )}
              {evening?.content && (
                <View>
                  <Text style={styles.entryLabel}>Evening</Text>
                  <Text style={styles.entryText}>{evening.content}</Text>
                </View>
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

interface PdfDownloadButtonProps {
  entries: Entry[];
  journey: Journey;
}

export function PdfDownloadButton({ entries, journey }: PdfDownloadButtonProps) {
  const { t } = useLocale();
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const blob = await pdf(
        <JourneyDocument entries={entries} journey={journey} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reconnect-journey.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button onClick={handleDownload} loading={generating}>
      {t.results.exportPdf}
    </Button>
  );
}
