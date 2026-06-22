import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page:    { padding: 36, fontSize: 9, fontFamily: "Helvetica", color: "#111" },
  header:  { textAlign: "center", marginBottom: 16 },
  title:   { fontSize: 14, fontWeight: "bold", color: "#0D2660" },
  subtitle:{ fontSize: 9, color: "#666", marginTop: 4 },
  meta:    { fontSize: 8, color: "#888", textAlign: "center", marginBottom: 12 },
  rowHead: { flexDirection: "row", backgroundColor: "#0D2660", padding: 6 },
  row:     { flexDirection: "row", borderBottom: "0.5pt solid #eee", padding: 6 },
  cell:    { paddingRight: 4 },
  hCell:   { color: "#fff", fontWeight: "bold", fontSize: 8 },
  footer:  { marginTop: 20, fontSize: 7, color: "#888", textAlign: "center" },
});

export type InterviewListRow = {
  name: string;
  email: string;
  phone: string;
  vacancy: string;
  qualifications: string;
  experienceYears: string;
  status: string;
  applied: string;
};

const COLS: { key: keyof InterviewListRow; label: string; width: string }[] = [
  { key: "name",             label: "Applicant",      width: "18%" },
  { key: "email",            label: "Email",          width: "20%" },
  { key: "phone",            label: "Phone",          width: "10%" },
  { key: "vacancy",          label: "Vacancy",        width: "18%" },
  { key: "qualifications",   label: "Qualifications", width: "14%" },
  { key: "experienceYears",  label: "Exp (yrs)",      width: "8%"  },
  { key: "status",           label: "Status",         width: "8%"  },
  { key: "applied",          label: "Applied",        width: "8%"  },
];

export function InterviewListDocument({ rows, generatedAt }: { rows: InterviewListRow[]; generatedAt: string }) {
  return (
    <Document title="Recruitment Interview List">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ramakrishna Mission College, Narayanpur</Text>
          <Text style={styles.subtitle}>Faculty Recruitment — Interview List</Text>
        </View>
        <Text style={styles.meta}>Generated {generatedAt} · {rows.length} candidate(s)</Text>

        <View style={styles.rowHead}>
          {COLS.map((c) => (
            <Text key={c.key} style={[styles.cell, styles.hCell, { width: c.width }]}>{c.label}</Text>
          ))}
        </View>

        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {COLS.map((c) => (
              <Text key={c.key} style={[styles.cell, { width: c.width }]}>{row[c.key] || "—"}</Text>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>Confidential — HR use only</Text>
      </Page>
    </Document>
  );
}
