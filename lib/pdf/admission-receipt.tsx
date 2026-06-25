import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Application, PersonalData, AcademicData, ProgramData } from "@/lib/supabase/types";

const styles = StyleSheet.create({
  page:     { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  header:   { textAlign: "center", marginBottom: 16 },
  title:    { fontSize: 16, fontWeight: "bold", color: "#0D2660" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 4 },
  appNo:    { textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#C8201A", marginVertical: 12 },
  section:  { marginBottom: 14, border: "1pt solid #ccc", borderRadius: 4 },
  secTitle: { backgroundColor: "#0D2660", color: "#fff", padding: 6, fontSize: 9, fontWeight: "bold" },
  row:      { flexDirection: "row", borderBottom: "0.5pt solid #eee", padding: 6 },
  label:    { width: "40%", color: "#555" },
  value:    { width: "60%", fontWeight: "bold" },
  footer:   { marginTop: 24, fontSize: 8, color: "#888", textAlign: "center", borderTop: "0.5pt solid #eee", paddingTop: 8 },
});

interface Props {
  app: Application & { programs?: { name?: string } };
}

export function AdmissionReceiptDocument({ app }: Props) {
  const pd  = app.personal_data as PersonalData | null;
  const ad  = app.academic_data as AcademicData | null;
  const pgd = app.program_data as ProgramData | null;

  const rows = (pairs: [string, string][]) =>
    pairs.map(([label, value]) => (
      <View key={label} style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "—"}</Text>
      </View>
    ));

  return (
    <Document title={`Admission ${app.application_no ?? "Draft"}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ramakrishna Mission Vivekananda College, Narayanpur</Text>
          <Text style={styles.subtitle}>Narayanpur, Chhattisgarh — A Branch Centre of Belur Math</Text>
        </View>
        <Text style={styles.appNo}>
          {app.application_no ?? "DRAFT"} · {app.status.toUpperCase()}
        </Text>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Personal Details</Text>
          {rows([
            ["Full Name", pd?.full_name ?? ""],
            ["Email", pd?.email ?? ""],
            ["Phone", pd?.phone ?? ""],
            ["Date of Birth", pd?.dob ?? ""],
            ["Gender", pd?.gender ?? ""],
            ["Category", pd?.category?.toUpperCase() ?? ""],
            ["Address", pd ? `${pd.address}, ${pd.city}, ${pd.state} - ${pd.pincode}` : ""],
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Academic History</Text>
          {rows([
            ["10th", ad ? `${ad.tenth.board} — ${ad.tenth.year} (${ad.tenth.percentage}%)` : ""],
            ["12th", ad ? `${ad.twelfth.board} — ${ad.twelfth.year} (${ad.twelfth.percentage}%)` : ""],
            ["Entrance Exam", ad?.entrance_exam ? `${ad.entrance_exam} — ${ad.entrance_score ?? ""}` : "—"],
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Programme</Text>
          {rows([
            ["Programme", pgd?.program_name ?? app.programs?.name ?? ""],
            ["Academic Year", app.academic_year ?? ""],
            ["Submitted", app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("en-IN") : "—"],
          ])}
        </View>

        <Text style={styles.footer}>
          Generated {new Date().toLocaleString("en-IN")} · Ramakrishna Mission Vivekananda College, Narayanpur · आत्मनो मोक्षार्थं जगद्धिताय च
        </Text>
      </Page>
    </Document>
  );
}
