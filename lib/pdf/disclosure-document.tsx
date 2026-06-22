import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { DisclosureSection } from "@/lib/content/public-data";
import { SITE_FULL_NAME, SITE_URL } from "@/lib/utils/constants";

const styles = StyleSheet.create({
  page:     { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: "#111" },
  header:   { textAlign: "center", marginBottom: 20 },
  title:    { fontSize: 14, fontWeight: "bold", color: "#0D2660" },
  subtitle: { fontSize: 8, color: "#666", marginTop: 4 },
  section:  { marginBottom: 12 },
  secTitle: { fontSize: 10, fontWeight: "bold", color: "#0D2660", marginBottom: 4, borderBottom: "0.5pt solid #ccc", paddingBottom: 2 },
  item:     { fontSize: 8, color: "#333", marginLeft: 8, marginBottom: 2 },
  footer:   { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 7, color: "#888", textAlign: "center", borderTop: "0.5pt solid #eee", paddingTop: 6 },
});

export function DisclosurePdfDocument({ sections }: { sections: DisclosureSection[] }) {
  return (
    <Document title={`UGC Mandatory Disclosure — ${SITE_FULL_NAME}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{SITE_FULL_NAME}</Text>
          <Text style={styles.subtitle}>UGC Public Self-Disclosure — Narayanpur, Chhattisgarh</Text>
          <Text style={styles.subtitle}>Generated {new Date().toLocaleDateString("en-IN")} · {SITE_URL}/disclosure</Text>
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.secTitle}>{section.label}</Text>
            {section.items.map((item) => (
              <Text key={`${section.id}-${item.label}`} style={styles.item}>
                • {item.label} — {item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          This document lists publicly accessible disclosure links as mandated by UGC Guidelines 2024 and AICTE APH 2024–27.
        </Text>
      </Page>
    </Document>
  );
}
